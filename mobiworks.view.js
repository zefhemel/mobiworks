var mobiworks = window.mobiworks || {};

mobiworks.view = {};

mobiworks.view.registerAll = function () {
    var allViews = $("div.view");
    for ( var i = 0; i < allViews.length; i++) {
        (function () {
            var view = allViews.eq(i);
            var arg = view.attr("arg");
            var name = view.attr("id");
            var html = view.html();
            window[name] = function (val) {
                var node = $(html);
                var rootObj = {};
                rootObj[arg] = val;
                mobiworks.databind(node, rootObj);
                return node;
            }
        }());
    }
}