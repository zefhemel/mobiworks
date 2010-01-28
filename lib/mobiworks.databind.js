if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F () {
        }
        F.prototype = o;
        return new F();
    };
};

var mobiworks = window.mobiworks || {};

jQuery.fn.datasource = function (newValue) {
    if (newValue) { // setting
        this.data("datasource", newValue);
    } else {
        var current = this;
        while (current && !current.data("datasource")) {
            current = current.parent().eq(0);
        }
        return current.data("datasource");
    }
}

mobiworks.databind_render = function (node, observableList, datasource) {
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
            var subSource = Object.create(datasource);
            node.append(template);
            subSource[iteratorItem] = array[j];
            node.children().last().databind(subSource);
        }());
    }

    setTimeout(scrollTo, 0, 0, 1);
}

jQuery.fn.databind = function (datasource) {
    for ( var idx = 0; idx < this.length; idx++) {
        var rootNode = this.eq(idx);
        rootNode.datasource(datasource); // Persist datasource in DOM
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
                var current = datasource;
                for ( var j = 0; j < parts.length - 1; j++) {
                    current = current[parts[j]];
                }
                var property = parts[parts.length - 1];
                var tag = node[0].tagName;
                if (current[property].subscribe) { // it's an observable
                    mobiworks.databind_render(node, current[property],
                            datasource);
                    // Add listeners
                    current[property].subscribe( [ "add", "remove", "addAll" ],
                            function () {
                                mobiworks.databind_render(node, current[property],
                                        datasource);
                            });
                } else {
                    if ($.inArray(tag, [ "INPUT", "SELECT" ]) != -1) {
                        switch (node.attr("type")) {
                        case "text":
                            if (current.subscribe) {
                                current.subscribe("set",
                                        function (_, prop, val) {
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
                                current.subscribe("set",
                                        function (_, prop, val) {
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
        rootNode.enableExtraEvents();
    }
}