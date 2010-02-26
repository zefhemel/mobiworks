var screen = window.screen || {};

screen.home = {};

tasks = Task.all().order("done", false);

// updates = observable.list([], false);

/*screen.home.showLinks = function () {
    $("#optionpanel").slideDown("fast");
};

screen.home.hideLinks = function () {
    $("#optionpanel").slideUp("fast");
};*/

screen.home.deleteTask = function (t) {
    tasks.remove(t);
    persistence.flush();
};

screen.home.checkTask = function(el) {
    persistence.flush();
};

screen.home.setFilter = function(el, filter) {
    var dom = $(el);
    $("div#tabbar div.selected").removeClass('selected');
    dom.addClass('selected');
    switch(filter) {
    case "all":
        screen.home.scope.set('tasks', Task.all().order('done', false));
        screen.home.scope.get('properties').title =  "All Tasks";
        $("#screen_home").databind(true);
        break;
    case "completed":
        screen.home.scope.get('properties').title = "Completed Tasks";
        screen.home.scope.set('tasks', Task.all().filter("done", '=', true));
        $("#screen_home").databind(true);
        break;
    case "not-completed":
        screen.home.scope.get('properties').title = "Not Completed Tasks";
        screen.home.scope.set('tasks', Task.all().filter("done", '=', false));
        $("#screen_home").databind(true);
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
                updateScrollers();
            });
        }
    });
};

screen.home.editTask = function(t) {
    console.log(t)
    mobiworks.call("screen.edit", [t], function(shouldSave) {
        if(shouldSave) {
            persistence.flush();
        }
    });
};

screen.home.scope = new mobiworks.LinkedMap(null, {tasks: tasks, properties: new observable.ObservableObject({title: "All tasks"})});

screen.home.init = function (args, callback) {
    return screen.home.scope;
};