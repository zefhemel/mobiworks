var mobiworks = window.mobiworks || {};

mobiworks.initEventing = function (rootNode) {
    var eventedNodes = rootNode.find("*[onswipe]");
    var nodes = [];
    for ( var i = 0; i < eventedNodes.length; i++) {
        nodes.push(eventedNodes.eq(i));
    }
    if (rootNode.attr("onswipe")) {
        nodes.push(rootNode);
    }
    var callRegexp = /([^\(]+)\(([^\)]+)\)/;
    for ( var i = 0; i < nodes.length; i++) {
        (function () {
            var node = nodes[i];
            if (node.data("evented")) {
                return;
            }
            var swipeFn = function (data) {
                // find the parent node holding the data
                var current = node;
                while (current && !current.data("rootObj")) {
                    current = current.parent().eq(0);
                }
                var rootObj = current.data("rootObj");
                var match = callRegexp.exec(node.attr("onswipe"));
                var viewName = match[1];
                var argName = match[2];
                var view = $($("#" + viewName).html());
                view.hide();
                node.hide('slide', {
                    direction: "left"
                }, 100, function () {
                    node.replaceWith(view);
                    mobiworks.databind(view, rootObj);
                    view.show('slide', {
                        direction: "right"
                    }, 100);
                });
            }
            node.swipe(swipeFn);
            node.dblclick(swipeFn); // debugging
            node.data("evented", true);
        }());
    }
}