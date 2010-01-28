$(function () {
    mobiworks.orm.conn = mobiworks.db.connect("tasks", "Task database",
            5 * 1024 * 1024);
    if(!mobiworks.orm.conn) {
        alert("No supported database found, either install Google Gears, or use a modern webkit browser.");
    }
    mobiworks.orm.ensureTables( {
        Task: {
            name: "TEXT",
            description: "TEXT",
            done: "BOOLEAN"
        }
    }, function() {
        // Create some dummy data
        /*var t = mobiworks.orm.create('Task');
        t.name = "Task 1";
        t.done = false;
        t.save();
        var t = mobiworks.orm.create('Task');
        t.name = "Task 2";
        t.done = true;
        t.save();*/
    });
});