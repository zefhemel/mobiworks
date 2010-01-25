var myapp = window.myapp || {};
myapp.screen = myapp.screen || {};

myapp.screen.home = {};

myapp.tasks = observable.list();

myapp.screen.home.showLinks = function() {
    $("#optionpanel").slideDown("fast");    
}

myapp.screen.home.hideLinks = function() {
    $("#optionpanel").slideUp("fast");    
}

myapp.screen.home.addTask = function() {
    mobiworks.call("add", null, function(name) {
        if(name) {
            tasks.add(observable.object({"name": name}));
        }
    });    
}

myapp.screen.home.init = function(args, callback) {
    myapp.tasks.add(observable.object({name: "Task 1"}));
    myapp.tasks.add(observable.object({name: "Task 2"}));
    mobiworks.databind($("#home"), myapp);
    mobiworks.initEventing($("#home"));
}