var myapp = window.myapp || {};
myapp.screen = myapp.screen || {};

myapp.screen.add = {};
myapp.screen.add.init = function(args, callback) {
    $("#add #back-button").bind('click', function() {
        callback(false);
    });
    $("#add #add-button").click(function() {
        callback($("#add input[name=name]").val());
    });
}

