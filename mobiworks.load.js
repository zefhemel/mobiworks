var mobiworks = window.mobiworks || {};
mobiworks.screenStack = [];

mobiworks.call = function(screenName, args, callback) {
    var screen = {"name": screenName, "args": args, "callback": callback};
    mobiworks.screenStack.push(screen);
    $.get("screen/" + screenName + ".html", function(data) {
        var body = $("body");
        if(mobiworks.screenStack.length > 1) {
            var previousScreen = mobiworks.screenStack[mobiworks.screenStack.length-2];
            $("body > #" + previousScreen.name).hide('slide', {direction: "left"}, 150);
        }
        var newScreenCode = $("<div id=\"" + screenName + "\" class=\"screen\" style=\"position: absolute; left: 0; top: 0; width: 100%;\">" + data + "</div>");
        if(mobiworks.screenStack.length > 1) {
            newScreenCode.hide().appendTo(body).show('slide', {direction: "right"}, 150);
        } else {
            newScreenCode.appendTo(body);
        }
        setTimeout(scrollTo, 0, 0, 1);
        $(function() {
            $.getScript("screen/" + screenName + ".js", function() {
                screen.object = window[window.applicationNamespace].screen[screenName];
                screen.object.init(args, function() {
                    // when callback funciton is called (i.e. return)
                    mobiworks.screenStack.pop();
                    if(mobiworks.screenStack.length > 0) {
                        var previousScreen = mobiworks.screenStack[mobiworks.screenStack.length-1];
                        $("body > #" + screen.name).hide('slide', {direction: "right"}, 150, function() {
                            $("body > #" + screen.name).remove();
                        });
                        $("body > #" + previousScreen.name).show('slide', {direction: "left"}, 150);
                    }
                    if(callback) {
                        callback.apply(null, arguments);
                    }
                });
            });
            mobiworks.view.registerAll();
        });
    });
}

$(function () {
    mobiworks.call("home", [], function() { location = "http://zef.me"; });
    window.scrollTo(0, 1);
    //document.ontouchmove = function(e){ e.preventDefault(); } 
});