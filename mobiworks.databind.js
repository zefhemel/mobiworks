if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F () {
        }
        F.prototype = o;
        return new F();
    };
};

var mobiworks = window.mobiworks || {};

jQuery.fn.getRootObj = function () {
    var current = this;
    while (current && !current.data("rootObj")) {
        current = current.parent().eq(0);
    }
    return current.data("rootObj");
}

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
    observableList.subscribe( [ "add", "remove", "addAll" ], function () {
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
                    switch (node.attr("type")) {
                    case "text":
                        if (current.subscribe) {
                            current.subscribe("set", function (_, prop, val) {
                                if (prop === property) {
                                    node.val(val);
                                }
                            });
                        }
                        node.keyup(function () { // keyup or onchange?
                                    current[property] = node.val();
                                });
                        node.val(current[property]);
                        break;
                    case "checkbox":
                        if (current.subscribe) {
                            current.subscribe("set", function (_, prop, val) {
                                if (prop === property) {
                                    node.attr("checked", val);
                                }
                            });
                        }
                        node.change(function () {
                            current[property] = node.attr("checked");
                        });
                        node.attr("checked", current[property]);
                        break;
                    }
                } else if (tag == "IMG") {
                    node.attr("src", current[property]);
                } else {
                    if (current.subscribe) {
                        current.subscribe("set", function (_, prop, val) {
                            if (prop === property) {
                                node.text(val);
                            }
                        });
                    }
                    node.text(current[property]);
                }
            }
        }());
    }
    mobiworks.initEventing(rootNode);
}