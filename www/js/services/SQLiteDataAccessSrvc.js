/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SQLiteDataAccessSrvc = function ($cordovaSQLite, $http) {

    var TAG = 'SQLiteDataAccessSrvc';
    var DB_CONFIG = {
        name: "eBrochure.db",
        version: "1.0"
    };

    var database;

    this.initializeDatabase = function () {

        try {
            if (window.cordova) {
                console.log('Cordova is available');
                database = $cordovaSQLite.openDB(DB_CONFIG.name);
            } else {
                console.log('Cordova is not available');
                database = window.openDatabase(DB_CONFIG.name, DB_CONFIG.version, 'Web SQL', -1);
            }

            $http.get('assets/create_tables.sql').then(function (response) {

                database.transaction(function (tx) {
                    var splittedCreateStatements = response.data.split(';');
                    for (var i in splittedCreateStatements) {
                        var statement = splittedCreateStatements[i].trim()
                        if (statement || statement != '') {
                            tx.executeSql(statement, [], function (tx, result) {
                                console.log(response.data);
                            }, function (error) {
                                console.error(error);
                                console.error(statement);
                            });
                        }
                    }
                });
            }, function (response) {
                console.error(TAG, response);
            });
        } catch (e) {
            console.error(TAG, 'Failed to open database ' + DB_CONFIG.name + ': ' + e);
        }

    };

    this.getDatabase = function () {
        if (database) {
            return database;
        } else {
            throw "Database not yet initialized!";
        }

    };

    this.insertOrReplaceInTx = function (table, data, callbacks) {
        var db = this.getDatabase();
        var _this = this;
        return db.transaction(function (tx) {
            try {
                for (var i in data) {
                    _this.insertOrReplace(table, data[i], tx);
                }

                callbacks.success(data);
            } catch (e) {
                callbacks.error(e);
            }
        });
    };

    this.insertOrReplace = function (table, data, tx, callbacks) {

        var query = "INSERT OR REPLACE INTO " + table + " (";
        var columns = [];
        var values = [];

        for (var key in data) {
            columns.push(key);
            values.push("'" + data[key] + "'");
        }

        query += columns.join();
        query += ") VALUES (";
        query += values.join();
        query += ")";

        if (tx) {
            tx.executeSql(query, [], function (tx, result) {
                console.log(result);
                if (callbacks) {
                    callbacks.success(result);
                }
            }, function (tx, err) {
                console.error(TAG, err);
                console.error(TAG, query);
                if (callbacks) {
                    callbacks.success(err);
                }
                return true;    //  rollback on query error
            });
        } else {
            var db = this.getDatabase();
            return $cordovaSQLite.execute(db, query, []);
        }

    };

};