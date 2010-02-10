var screen = window.screen || {};

screen.home = {};

tasks = observable.list( [], false);
// updates = observable.list([], false);
screen.home.properties = observable.object({title: "All tasks"});

screen.home.showLinks = function () {
    $("#optionpanel").slideDown("fast");
};

screen.home.hideLinks = function () {
    $("#optionpanel").slideUp("fast");
};

screen.home.deleteTask = function (t) {
    persistence.remove(t);
    persistence.flush();
    tasks.remove(t);
};

screen.home.checkTask = function(el) {
    var scope = el.scope();
    //scope.t.done = !!el.attr("checked");
    persistence.flush();
};

screen.home.setFilter = function(el, filter) {
    var dom = $(el);
    $("div#tabbar div.selected").removeClass('selected');
    dom.addClass('selected');
    switch(filter) {
    case "all":
        Task.all().list(null, function(allTasks) {
            tasks.clear();
            tasks.addAll(allTasks);
            screen.home.properties.title = "All Tasks";
            updateScrollers();
        });
        break;
    case "completed":
        Task.all().filter("done", '=', true).list(null, function(allTasks) {
            screen.home.properties.title = "Completed Tasks";
            tasks.clear();
            tasks.addAll(allTasks);
            updateScrollers();
        });
        break;
    case "not-completed":
        Task.all().filter("done", '=', false).list(null, function(allTasks) {
            screen.home.properties.title = "Not-Completed Tasks";
            tasks.clear();
            tasks.addAll(allTasks);
            updateScrollers();
        });
        break;
    }
};

screen.home.addTask = function () {
    mobiworks.call("screen.add", null, function (name) {
        if (name) {
            var t = new Task();
            t.name = name;
            t.done = false;
            persistence.add(t);
            persistence.flush(null, function() {
                tasks.add(t);
            });
        }
    });
};

screen.home.init = function (args, callback) {
    // tasks.add(observable.object({name: "Task 1", done: false}));
    // tasks.add(observable.object({name: "Task 2", done: true}));
    Task.all().list(null, function(allTasks) {
        //console.log(allTasks);
        tasks.addAll(allTasks);
        updateScrollers();
    });
    $("#screen_home").scope( {
        tasks: tasks,
        properties: screen.home.properties
    });
    // $("#screen_home").initScope();
    $("#screen_home").databind();
    /*
     * setTimeout(function() {
     * $.getJSON("http://twitter.com/status/user_timeline/zef.json?count=10&callback=?",
     * function(updates) { updates.addAll(updates); }); }, 100);
     */
}