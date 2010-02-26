var screen = window.screen || {};

screen.edit = {};

screen.edit.init = function(args, callback) {
    $("#screen_edit #back-button").bind('click', function() {
        callback(false);
    });
    $("#screen_edit #save-button").click(function() {
        callback(true);
    });
    return new mobiworks.LinkedMap(null, {task: args[0]});
};

