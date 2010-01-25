var myapp = window.myapp || {};
myapp.screen = myapp.screen || {};

myapp.screen.home = {};
myapp.screen.home.init = function(args, callback) {
    var tasks = observable.list();
    $("#home #close-button").bind('click', function() {
        callback();
    });
    $("#home #add-button").bind('click', function() {
        mobiworks.call("add", null, function(name) {
            if(name) {
                tasks.add(observable.object({"name": name}));
            }
        });
    });
    
    addSwipeListener($("ul > li").get(0), function(data) {
        alert(data.direction);
    });
    window.root = {};
    tasks.add(observable.object({name: "Task 1"}));
    tasks.add(observable.object({name: "Task 2"}));
    root.tasks = tasks;
    mobiworks.databind($("#home"), root);
}