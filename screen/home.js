var myapp = window.myapp || {};
myapp.screen = myapp.screen || {};

myapp.screen.home = {};

myapp.tasks = observable.list([], true);
myapp.updates = observable.list([], false);

myapp.screen.home.showLinks = function() {
    $("#optionpanel").slideDown("fast");    
}

myapp.screen.home.hideLinks = function() {
    $("#optionpanel").slideUp("fast");    
}

myapp.screen.home.deleteTask = function(t) {
    myapp.tasks.remove(t);
}

myapp.screen.home.addTask = function() {
    mobiworks.call("add", null, function(name) {
        if(name) {
            myapp.tasks.add(observable.object({"name": name, "done": false}));
        }
    });    
}

myapp.screen.home.init = function(args, callback) {
    myapp.tasks.add(observable.object({name: "Task 1", done: false}));
    myapp.tasks.add(observable.object({name: "Task 2", done: true}));
    mobiworks.databind($("#home"), myapp);
    mobiworks.initEventing($("#home"));
    /*setTimeout(function() {
        $.getJSON("http://twitter.com/status/user_timeline/zef.json?count=10&callback=?", function(updates) {
            myapp.updates.addAll(updates);
        });
    }, 100);*/
}