var myapp = window.myapp || {};
myapp.screen = myapp.screen || {};

myapp.screen.add = {};
myapp.screen.add.init = function(args, callback) {
    var task = observable.object({name: ""});
    mobiworks.databind($("#add"), {newTask: task});
    $("#add #back-button").bind('click', function() {
        callback(false);
    });
    $("#add #add-button").click(function() {
        callback(task.name);
    });
}

