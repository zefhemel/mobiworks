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
}

jQuery.fn.initScope = function () {
    // grab all iterator thingies
    var allIterateThings = this.find("*[item]");
    for ( var i = 0; i < allIterateThings.length; i++) {
        (function () {
            var iterateThing = allIterateThings.eq(i);
            if(!iterateThing.data("template")) {
                if(iterateThing.parents(".template").length === 0) {
                    iterateThing.data("template", iterateThing.html());
                    iterateThing.empty();
                }
            }
        }());
    }
    
    // grab templates, turn them into functions and put them in scope
    var allTemplates = this.find("div.template");
    for ( var i = 0; i < allTemplates.length; i++) {
        (function () {
            var template = allTemplates.eq(i);
            if (template.parents("*[databind]").length === 0) {
                var scope = template.scope();
                var name = template.attr("id");
                var code = template.contents();
                scope[name] = function () {
                    var node = code.clone(true);
                    // var myScope = Object.create(scope);
                    // myScope[arg] = val;
                    // console.log(name);
                    // console.log(scope)
                    node.scope(scope);
                    //node.initScope();
                    node.databind();
                    return node;
                };
                template.remove();
            }
        }());
    }
    // allTemplates.remove();
    // Register all ids to their respective scopes
    var allIdElements = this.find("*[id]");
    for ( var i = 0; i < allIdElements.length; i++) {
        var el = allIdElements.eq(i);
        el.scope()[el.attr("id")] = el;
    }

    var allTemplateCalls = this.find(".templatecall");
    var scope = this.scope();
    for ( var i = 0; i < allTemplateCalls.length; i++) {
        var tc = allTemplateCalls.eq(i);
        if (tc.parents("*[databind]").length === 0) {
            var templateName = tc.attr('template');
            tc.removeClass("templatecall");
            var templateFn = scope[templateName];
            if(!templateFn) {
                console.log("template " + templateName + " not found.");
            } else {
                tc.append(templateFn());
            }
        }
    }
}
