persistence.connect('task', 'My task database', 5 * 1024 * 1024);

var Task = persistence.define('Task', {
    name: "TEXT",
    description: "TEXT",
    done: "BOOL"
});

persistence.schemaSync();