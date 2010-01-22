jQuery.fn.bindtemplate = function(obsList, animate) {
	var resultLength = this.length;
	var that = this;
	animate = animate || false;
	for ( var i = 0; i < resultLength; i++) {
		(function() {
			var r = that.eq(i);
			r.data("list", obsList);
			r.data("template", $.template(r.html()));
			r.empty();
			obsList.subscribe("add", function(_, elt) {
				var node = $(r.data("template").apply(elt));
				node.data("object", elt);
				if(animate) {
					node.hide().appendTo(r).slideDown();
				} else {
					node.appendTo(r);
				}
			});
			obsList.subscribe("remove", function(_, elt) {
				var clength = r.length;
				for(var i = 0; i < clength; i++) {
					console.log(r.eq(i));
					if(r.eq(i).data("object") == elt) {
						console.log("Got it!");
						r.eq(i).remove();
						return;
					}
				}
			});
		}());
	}
	return this;
};

$(function() {
    window.db = mobidsl.db.connect("tasks", "Tasks database", 5*1024*1024);
    var allTasks = observable.list();
    $("#tasks").bindtemplate(allTasks, true);
    db.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS Task ( name TEXT, done INT )", null, function() {
            t.executeSql("SELECT * FROM Task", null, function(_, tasks) {
                for(var i = 0; i < tasks.length; i++) {
                    allTasks.add(tasks[i]);
                }
            });
        });
    });

	$("#add-task").click(function() {
	    var task_name = $("#task-name");
	    var task = {name: task_name.val(), done: false};
        task_name.val("");
        allTasks.add(task);
        jQT.goBack("#home");
	    db.transaction(function(t) {
	        t.executeSql("INSERT INTO Task (name, done) VALUES (?, ?)", [task.name, task.done ? 1 : 0]);
	    });
	});
	/*$.getJSON("http://twitter.com/status/user_timeline/zef.json?count=10&callback=?", function(updates) {
		for(var i = 0; i < updates.length; i++) {
			mycoll.add({name: updates[i].text});
		}
	});*/
	/*var task1 = {name: "Do this!"};
	setTimeout(function() {
		mycoll.add(task1);
		setTimeout(function() {
			mycoll.remove(task1);
			mycoll.add({name: "Do this too!"});
		}, 1000);
	}, 1000);*/
	
});
