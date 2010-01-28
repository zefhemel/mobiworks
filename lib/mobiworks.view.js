jQuery.fn.registerViews = function (toScreen) {
    var allViews = this.find("div.view");
    for ( var i = 0; i < allViews.length; i++) {
        (function () {
            var view = allViews.eq(i);
            var arg = view.attr("arg");
            var name = view.attr("id");
            var html = view.html();
            toScreen[name] = function (val) {
                var node = $(html);
                var datasource = {};
                datasource[arg] = val;
                node.databind(datasource);
                return node;
            }
        }());
    }
}