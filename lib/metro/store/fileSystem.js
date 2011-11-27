
  Metro.Store.FileSystem = (function() {

    function FileSystem() {}

    FileSystem.prototype.find = function(query, callback) {};

    FileSystem.alias("select", "find");

    FileSystem.prototype.first = function(query, callback) {};

    FileSystem.prototype.last = function(query, callback) {};

    FileSystem.prototype.all = function(query, callback) {};

    FileSystem.prototype.length = function(query, callback) {};

    FileSystem.alias("count", "length");

    FileSystem.prototype.remove = function(query, callback) {};

    FileSystem.prototype.clear = function() {};

    FileSystem.prototype.toArray = function() {};

    FileSystem.prototype.create = function(record, callback) {
      return this.collection().insert(record, callback);
    };

    FileSystem.prototype.update = function(record) {};

    FileSystem.prototype.destroy = function(record) {};

    FileSystem.prototype.sort = function() {};

    return FileSystem;

  })();

  module.exports = Metro.Store.FileSystem;
