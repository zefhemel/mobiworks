var screen = window.screen || {};

screen.home = {};

tasks = observable.list([], true);
//updates = observable.list([], false);

screen.home.showLinks = function() {
    $("#optionpanel").slideDown("fast");    
}

screen.home.hideLinks = function() {
    $("#optionpanel").slideUp("fast");    
}

screen.home.deleteTask = function(t) {
    //$.jGrowl("Task removed.");
    tasks.remove(t);
}

screen.home.addTask = function() {
    mobiworks.call("screen.add", null, function(name) {
        if(name) {
            tasks.add(observable.object({"name": name, "done": false}));
        }
    });    
}

screen.home.init = function(args, callback) {
    tasks.add(observable.object({name: "Task 1", done: false}));
    tasks.add(observable.object({name: "Task 2", done: true}));
    $("#screen_home").databind(window);
    /*setTimeout(function() {
        $.getJSON("http://twitter.com/status/user_timeline/zef.json?count=10&callback=?", function(updates) {
            updates.addAll(updates);
        });
    }, 100);*/
}