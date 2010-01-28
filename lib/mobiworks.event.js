var mobiworks = window.mobiworks || {};

function replace (node, view) {
    node = $(node);
    // find the parent node holding the data
    var datasource = node.datasource();
    view.hide();
    node.hide('slide', {
        direction: "left"
    }, 100, function () {
        node.disableExtraEvents();
        node.replaceWith(view);
        view.databind(datasource);
        view.show('slide', {
            direction: "right"
        }, 100);
    });
}

function replaceWithView (node, viewFn, arg) {
    // alert($(node).datasource());
    replace(node, viewFn($(node).datasource()[arg]));
}

jQuery.fn.enableExtraEvents = function () {
    var nodes = [];
    var that = this;
    function addNodesWithAttribute (attr) {
        var eventedNodes = that.find("*[" + attr + "]");
        for ( var i = 0; i < eventedNodes.length; i++) {
            if (eventedNodes.eq(i).parents(".view").length === 0) {
                nodes.push( [ attr, eventedNodes.eq(i) ]);
            }
        }
        if (that.attr(attr)) {
            nodes.push( [ attr, that ]);
        }
    }
    addNodesWithAttribute("onswipe");
    addNodesWithAttribute("onlandscapeleft");
    addNodesWithAttribute("onlandscaperight");
    addNodesWithAttribute("onportrait");
    for ( var i = 0; i < nodes.length; i++) {
        (function () {
            var attr = nodes[i][0];
            var node = nodes[i][1];
            if (node.data(attr + "_evented")) {
                return;
            }

            var execFn = function (event) {
                // console.log(node.html());

                if (arguments.length > 1) {
                    event = arguments[1];
                }
                var fn = function (event) {
                    eval(node.attr(attr));
                };
                // alert(node);
                fn.call(node, event);
            };
            switch (attr) {
            case 'onswipe':
                node.swipe(execFn);
                node.dblclick(execFn); // debugging
                break;
            case 'onportrait':
                node.data(attr+"_sid", mobiworks.orientation.subscribe('portrait', execFn));
                break;
            case 'onlandscapeleft':
                node.data(attr+"_sid", mobiworks.orientation.subscribe('landscapeLeft', execFn));
                break;
            case 'onlandscapeleft':
                node.data(attr+"_sid", mobiworks.orientation.subscribe('landscapeRight', execFn));
                break;
            }
            node.data(attr + "_evented", true);
        }());
    }
}

jQuery.fn.disableExtraEvents = function () {
    var nodes = [];
    var that = this;
    function addNodesWithAttribute (attr) {
        var eventedNodes = that.find("*[" + attr + "]");
        for ( var i = 0; i < eventedNodes.length; i++) {
            if (eventedNodes.eq(i).data(attr + "_evented")) {
                nodes.push( [ attr, eventedNodes.eq(i) ]);
            }
        }
        if (that.attr(attr)) {
            nodes.push( [ attr, that ]);
        }
    }
    addNodesWithAttribute("onlandscapeleft");
    addNodesWithAttribute("onlandscaperight");
    addNodesWithAttribute("onportrait");
    for ( var i = 0; i < nodes.length; i++) {
        var attr = nodes[i][0];
        var node = nodes[i][1];
        switch (attr) {
        case 'onportrait':
            mobiworks.orientation.unsubscribe('portrait', node.data(attr+"_sid"));
            break;
        case 'onlandscapeleft':
            mobiworks.orientation.unsubscribe('landscapeLeft', node.data(attr+"_sid"));
            break;
        case 'onlandscapeleft':
            mobiworks.orientation.unsubscribe('landscapeRight', node.data(attr+"_sid"));
            break;
        }
        console.log("Removing from: " + attr);
    }
}