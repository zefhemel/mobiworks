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
    t.remove();
    tasks.remove(t);
}

screen.home.addTask = function() {
    mobiworks.call("screen.add", null, function(name) {
        if(name) {
            var t = mobiworks.orm.create('Task');
            t.name = name;
            t.done = false;
            t.save();
            tasks.add(t);
        }
    });    
}

screen.home.init = function(args, callback) {
    //tasks.add(observable.object({name: "Task 1", done: false}));
    //tasks.add(observable.object({name: "Task 2", done: true}));
    mobiworks.orm.all('Task', function(allTasks) {
        tasks.addAll(allTasks);
    });
    $("#screen_home").databind(window);
    /*setTimeout(function() {
        $.getJSON("http://twitter.com/status/user_timeline/zef.json?count=10&callback=?", function(updates) {
            updates.addAll(updates);
        });
    }, 100);*/
}