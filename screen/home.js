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
        screen.home.scope.tasks = Task.all().order('done', false);
        screen.home.scope.properties.title = "All Tasks";
        $("#screen_home").databind(true);
        break;
    case "completed":
        screen.home.scope.properties.title = "Completed Tasks";
        screen.home.scope.tasks = Task.all().filter("done", '=', true);
        $("#screen_home").databind(true);
        break;
    case "not-completed":
        screen.home.scope.properties.title = "Not Completed Tasks";
        screen.home.scope.tasks = Task.all().filter("done", '=', false);
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

screen.home.scope = {tasks: tasks};
screen.home.scope.properties = new observable.ObservableObject({title: "All tasks"});


screen.home.init = function (args, callback) {
    return screen.home.scope;
}