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
            current.data("scope", new mobiworks.LinkedMap());
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
                var fargs = [];
                while (node.attr("farg" + fargs.length)) {
                    fargs.push(node.attr("farg" + fargs.length));
                }
                // console.log(scope);
                scope.setLocal(name, function (scope) {
                    for ( var i = 1; i < arguments.length; i++) {
                        scope.setLocal(fargs[i-1], arguments[i]);
                    }
                    if (node.attr("oninit")) {
                        eval(node.attr("oninit"))(scope); // for now
                    }
                    var newNode = code.clone(true);
                    newNode.scope(scope);
                    //newNode.databind();
                    return newNode;
                });
                node.remove();
                traverseChildren = false;
            }
            if (node.attr("item")) {
                node.data("template", node.html());
                node.empty();
                traverseChildren = false;
            }
            if (node.attr("id") && !node.hasClass('template')) {
                // var scope = node.scope();
                scope.setLocal(node.attr("id"), node);
            }
            if (node.hasClass("templatecall")) {
                // var scope = node.scope();
                var templateName = node.attr('template');
                // node.removeClass("templatecall");
                var templateFn = scope.get(templateName);
                if (!templateFn) {
                    console.error("template " + templateName + " not found.");
                } else {
                    var args = [];
                    var subScope = new mobiworks.LinkedMap(scope);
                    var code = node.contents();
                    subScope.setLocal('elements', function(scope) {
                        var newNode = code.clone(true);
                        newNode.scope(scope);
                        //newNode.databind();
                        return newNode;
                    });
                    args.push(subScope);
                    (function () {
                        while (node.attr("arg" + (args.length-1))) {
                            args.push(eval(node.attr("arg" + (args.length-1))));
                        }
                    }).apply(node);
                    
                    // make the call
                    var result = templateFn.apply(null, args);
                    
                    var attributes = node[0].attributes;
                    for(var j = 0; j < attributes.length; j++) {
                        var attribute = attributes[j];
                        if(attribute.nodeName != 'id' && attribute.nodeName != 'class' && attribute.nodeName != 'template' && attribute.nodeName.substring(0, 3) !== 'arg') {
                            if(attribute.nodeName.substring(0, 2) === 'on') { // event
                                result.bind(attribute.nodeName.substring(2), function() {
                                    (function() {
                                        node.data("scope", scope);
                                        eval(attribute.nodeValue);
                                    }).apply(node);
                                });
                            } else {
                                result.attr(attribute.nodeName, attribute.nodeValue);
                            }
                        }
                    }
                    if (node.attr("id")) {
                        node.append(result);
                    } else {
                        node.replaceWith(result);
                    }
                }
                traverseChildren = false;
            }
            if (traverseChildren) {
                node.children().initScope();
            }
        }());
    }
};
