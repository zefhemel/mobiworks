var screen = window.screen || {};

screen.add = {};

screen.add.init = function(args, callback) {
    var task = new observable.ObservableObject({name: ""});
    $("#screen_add #back-button").bind('click', function() {
        callback(false);
    });
    $("#screen_add #add-button").click(function() {
        callback(task.name);
    });
    return new mobiworks.LinkedMap(null, {newTask: task});
};

