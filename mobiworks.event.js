var mobiworks = window.mobiworks || {};

function replace (node, view) {
    node = $(node);
    // find the parent node holding the data
    var rootObj = node.getRootObj();
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

function replaceWithView (node, viewFn, arg) {
    replace(node, viewFn($(node).getRootObj()[arg]));
}

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
        var node = nodes[i];
        if (node.data("evented")) {
            return;
        }
        
        var swipeFn = function(event) {
            var fn = function(event) {
                eval(node.attr("onswipe"));
            };
            fn.call(node, event);
        };
        node.swipe(swipeFn);
        node.dblclick(swipeFn); // debugging
        node.data("evented", true);
    }
}