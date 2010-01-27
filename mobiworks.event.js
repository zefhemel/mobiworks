var mobiworks = window.mobiworks || {};

function replace (node, view) {
    node = $(node);
    // find the parent node holding the data
    var datasource = node.datasource();
    view.hide();
    node.hide('slide', {
        direction: "left"
    }, 100, function () {
        node.replaceWith(view);
        view.databind(datasource);
        view.show('slide', {
            direction: "right"
        }, 100);
    });
}

function replaceWithView (node, viewFn, arg) {
    replace(node, viewFn($(node).datasource()[arg]));
}

jQuery.fn.enableExtraEvents = function () {
    var eventedNodes = this.find("*[onswipe]");
    var nodes = [];
    for ( var i = 0; i < eventedNodes.length; i++) {
        nodes.push(eventedNodes.eq(i));
    }
    if (this.attr("onswipe")) {
        nodes.push(this);
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