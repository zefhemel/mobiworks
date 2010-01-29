var screen = window.screen || {};

screen.add = {};

screen.add.init = function(args, callback) {
    var task = observable.object({name: ""});
    $("#screen_add").scope({newTask: task});
    $("#screen_add").databind();
    $("#screen_add #back-button").bind('click', function() {
        callback(false);
    });
    $("#screen_add #add-button").click(function() {
        callback(task.name);
    });
}

