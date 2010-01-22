var myapp = window.myapp || {};
myapp.screen = myapp.screen || {};

myapp.screen.home = {};
myapp.screen.home.init = function(args, callback) {
    $("#home #close-button").bind('click', function() {
        callback();
    });
    $("#home #add-button").bind('click', function() {
        mobiworks.call("add", null, function(name) {
            if(name) {
                alert("Adding task: " + name);
            }
        });
    });
    
    addSwipeListener($("ul > li").get(0), function(data) {
        alert(data.direction);
    });
}