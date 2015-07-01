(function( global ) {
	var WebDB = (function() {

		var userName, dbName, dbSize, version, description, db;

		function WebDB(dbName, description, userName, dbSize, version) {
			this.userName = userName; 
			this.dbName = dbName; 
			this.version = version;
			this.dbSize = dbSize; 
			this.description = description;
		}

		WebDB.prototype.open = function () {
	        this.db = openDatabase(this.dbName, this.version, this.description, this.size);
	    };

	    WebDB.prototype.createTableIfNotExists = function (tableName, fields) {
	        var fieldsPairs = [];
	        for (var key in fields) {
	            fieldsPairs.push(key + (fields[key]!=''?' '+fields[key]:''));
	        }
	        var createStatement = "CREATE TABLE IF NOT EXISTS " + tableName + " (" + fieldsPairs.join(',') + ")";
	        this.db.transaction(function (t) {
	            t.executeSql(createStatement);
	        });
	    };

	    WebDB.prototype.insertItem = function (tableName, fields, onSuccessCallback) {
	        var fieldsArr = [];
	        var valuesArr = [];
	        var qArr = [];
	        for (var key in fields) {
	            fieldsArr.push(key);
	            valuesArr.push(fields[key]);
	            qArr.push('?');
	        }

	        var insertStatement = "INSERT INTO " + tableName + " (" + fieldsArr.toString() + ") values(" + qArr.toString() + ")";
	        this.db.transaction(function (t) {
	            t.executeSql(insertStatement, valuesArr, function(tx, results){return results}, onError);
	        });
	    };

	    WebDB.prototype.deleteItem = function (tableName, fields, onSuccessCallback) {
	        var arr = [];
	        var values = [];
	        for (var key in fields) {
	            arr.push(key + " = ?");
	            values.push(fields[key]);
	        }
	        var whereStatement = arr.join(' and ');
	        var deleteStatement = "DELETE FROM " + tableName + " WHERE " + whereStatement;
	        this.db.transaction(function (t) {
	            t.executeSql(deleteStatement, values, function(tx, results){return results}, onError);
	        });
	    };

	    WebDB.prototype.getAllItems = function (tableName, callback) {
	    	var selectStatement = "SELECT * FROM " + tableName;
	        var r = this.db.transaction(function (t) {
	            t.executeSql(
	            	selectStatement, 
	            	[], 
	            	function(tx, r){
		            	callback(r.rows);
		            }, 
		            onError
		        );
	        });
	    };

	    WebDB.prototype.getAllItemsBy = function (tableName, field, value, callback) {
	    	var selectStatement = "SELECT * FROM " + tableName + " WHERE " + field + " = '" + value + "'";
	        this.db.transaction(function (t) {
	            t.executeSql(
	            	selectStatement, 
	            	[], 
	            	function(tx, r){
		            	callback(r.rows);
		            }, 
		            onError)
	            ;
	        });
	    };

	    var onError = function (tx, e) {
	        alert("An error has occured! Please send next data to fedes.sh@gmail.com: " + e.message);
	    };

	    var onSuccess = function (t, r) {
	        return r;
	    };

		return WebDB;
	}());

 	global.WebDB = WebDB;
})( window );