$(function() {
    console.log("Loaded!");
    var db = mobidsl.db.connect("testdb", "A test database", 5 * 1024 * 1024);
    db.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS Task ( name TEXT, done INT )", null, function() {
            console.log("Created table!");
            t.executeSql("INSERT INTO Task (name) VALUES (?)", ["Something"], function() {
                t.executeSql("INSERT INTO Task (name) VALUES (?)", ["Something else"], function() {
                    t.executeSql("SELECT * FROM Task", null, function(_, results) {
                        var items = $("#items");
                        for(var i = 0; i < results.length; i++) {
                            items.append($("<li>" + results[i].name + "</li>"));
                        }
                    });
                });
            });
        });
    });
    console.log("Done!");
});