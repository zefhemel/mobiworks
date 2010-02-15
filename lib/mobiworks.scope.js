if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F () {
        }
        F.prototype = o;
        return new F();
    };
};

var mobiworks = window.mobiworks || {};

jQuery.fn.scope = function (newValue) {
    if (newValue) { // setting
        this.data("scope", newValue);
        this.initScope();
    } else {
        var current = this;
        while (current.parent().length > 0 && !current.data("scope")) {
            current = current.parent().eq(0);
            // console.log(counter)
            // console.log(current);
        }
        if (!current.data("scope")) {
            current.data("scope", {});
        }
        return current.data("scope");
    }
};

jQuery.fn.initScope = function () {
    var that = this;
    for ( var i = 0; i < this.length; i++) {
        (function () {
            var node = that.eq(i);
            var traverseChildren = true;
            var scope = node.scope();
            if (node.hasClass('template')) {
                var name = node.attr("id");
                var code = node.contents();
                //console.log(scope);
                scope[name] = function () {
                    var newNode = code.clone(true);
                    newNode.scope(scope);
                    newNode.databind();
                    return newNode;
                };
                node.remove();
                traverseChildren = false;
            }
            if(node.attr("item")) {
                node.data("template", node.html());
                node.empty();
                traverseChildren = false;
            }
            if(node.attr("id") && !node.hasClass('template')) { 
                //var scope = node.scope();
                scope[node.attr("id")] = node;
            }
            if(node.hasClass("templatecall")) {
                //var scope = node.scope();
                var templateName = node.attr('template');
                //node.removeClass("templatecall");
                var templateFn = scope[templateName];
                if (!templateFn) {
                    console.log("template " + templateName + " not found.");
                } else {
                    node.append(templateFn());
                }
                traverseChildren = false;
            }
            if(traverseChildren) {
                node.children().initScope();
            }
        }());
    }
};
