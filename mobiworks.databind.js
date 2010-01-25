if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F () {
        }
        F.prototype = o;
        return new F();
    };
};

var mobiworks = window.mobiworks || {};

$(function () {
    mobiworks.databind_div = $("<div id=\"__temp\">").hide();
    $("body").append(mobiworks.databind_div);
});

mobiworks.databind_render = function (node, observableList, rootObj) {
    var array = observableList.array();
    var template;
    if (node.data("template")) {
        template = node.data("template");
    } else {
        template = node.html();
        node.data("template", node.html());
    }
    var iteratorItem = node.attr("item");
    node.empty();
    for ( var j = 0; j < array.length; j++) {
        (function () {
            var subRootObj = Object.create(rootObj);
            node.append(template);
            subRootObj[iteratorItem] = array[j];
            mobiworks.databind(node.children().last(), subRootObj);
            // console.log(node.children().last())
        }());
    }

    // Add listeners
    observableList.subscribe("add", function () {
        mobiworks.databind_render(node, observableList, rootObj);
    });
}
mobiworks.databind = function (rootNode, rootObj) {
    rootNode.data("rootObj", rootObj); // Persist rootobject in DOM
    var allNodes = rootNode.find("*[databind]");
    var nodeLength = allNodes.length;
    var newNodes = [];
    for ( var i = 0; i < nodeLength; i++) {
        if (allNodes.eq(i).parents("*[databind]").length === 0
                && allNodes.eq(i).parents(".view").length === 0) {
            newNodes.push(allNodes.eq(i));
        }
    }
    if (rootNode.attr("databind")
            && rootNode.parents("*[databind]").length === 0
            && rootNode.parents(".view").length === 0) {
        newNodes.push(rootNode);
    }

    for ( var i = 0; i < newNodes.length; i++) {
        (function () {
            var node = newNodes[i];
            var expr = node.attr("databind");
            node.removeAttr("databind");
            var parts = expr.split(".");
            var current = rootObj;
            for ( var j = 0; j < parts.length - 1; j++) {
                current = current[parts[j]];
            }
            var property = parts[parts.length - 1];
            var tag = node[0].tagName;
            if (current[property].subscribe) { // it's an observable
                mobiworks.databind_render(node, current[property], rootObj);
            } else {
                if ($.inArray(tag, [ "INPUT", "SELECT" ]) != -1) {
                    current.subscribe("set", function (_, prop, val) {
                        if (prop === property) {
                            node.val(val);
                        }
                    });
                    node.keyup(function () { // keyup or onchange?
                                current[property] = node.val();
                            });
                    node.val(current[property]);
                } else {
                    current.subscribe("set", function (_, prop, val) {
                        if (prop === property) {
                            node.text(val);
                        }
                    });
                    node.text(current[property]);
                }
            }
        }());
    }
    mobiworks.initEventing(rootNode);
}