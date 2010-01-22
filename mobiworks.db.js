window.mobiworks = window.mobiworks || {};

mobiworks.db = mobiworks.db || {};

mobiworks.db.implementation = "unsupported";
mobiworks.db.conn = null;

if (window.google && google.gears) {
    mobiworks.db.implementation = "gears";
} else if (window.openDatabase) {
    mobiworks.db.implementation = "html5";
}

mobiworks.db.html5 = {};

mobiworks.db.html5.connect = function (dbname, description, size) {
    var that = {};
    var conn = openDatabase(dbname, '1.0', description, size);

    that.transaction = function (fn) {
        return conn.transaction(function (sqlt) {
            return fn(mobiworks.db.html5.transaction(sqlt));
        });
    };
    return that;
};

mobiworks.db.html5.transaction = function (t) {
    var that = {};
    that.executeSql = function (query, args, successFn, errorFn) {
        t.executeSql(query, args, function (_, result) {
            if (successFn) {
                var results = [];
                for ( var i = 0; i < result.rows.length; i++) {
                    results.push(result.rows.item(i));
                }
                successFn(that, results);
            }
        }, errorFn);
    };
    return that;
};

mobiworks.db.gears = {};

mobiworks.db.gears.connect = function (dbname) {
    var that = {};
    var conn = google.gears.factory.create('beta.database');
    conn.open(dbname);

    that.transaction = function (fn) {
        fn(mobiworks.db.gears.transaction(conn));
    };
    return that;
};

mobiworks.db.gears.transaction = function (conn) {
    var that = {};
    that.executeSql = function (query, args, successFn, errorFn) {
        var rs = conn.execute(query, args);
        if (successFn) {
            var results = [];
            while (rs.isValidRow()) {
                var result = {};
                for ( var i = 0; i < rs.fieldCount(); i++) {
                    result[rs.fieldName(i)] = rs.field(i);
                }
                results.push(result);
                rs.next();
            }
            successFn(that, results);
        }
    };
    return that;
};

mobiworks.db.connect = function (dbname, description, size) {
    if (mobiworks.db.implementation == "html5") {
        return mobiworks.db.html5.connect(dbname, description, size);
    } else if (mobiworks.db.implementation == "gears") {
        return mobiworks.db.gears.connect(dbname);
    }
};
