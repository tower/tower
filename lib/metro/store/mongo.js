var Mongo;
Mongo = (function() {
  Mongo.config = {
    development: {
      name: "metro-development",
      port: 27017,
      host: "127.0.0.1"
    },
    test: {
      name: "metro-test",
      port: 27017,
      host: "127.0.0.1"
    },
    staging: {
      name: "metro-staging",
      port: 27017,
      host: "127.0.0.1"
    },
    production: {
      name: "metro-production",
      port: 27017,
      host: "127.0.0.1"
    }
  };
  Mongo.configure = function(options) {
    return _.extend(this.config, options);
  };
  Mongo.env = function() {
    return this.config[Metro.env];
  };
  Mongo.lib = function() {
    return require('mongodb');
  };
  Mongo.initialize = function(callback) {
    var env, mongo, self;
    self = this;
    if (!this.database) {
      env = this.env();
      mongo = this.lib();
      new mongo.Db(env.name, new mongo.Server(env.host, env.port, {})).open(function(error, client) {
        return self.database = client;
      });
    }
    return this.database;
  };
  function Mongo(collectionName, options) {
    if (options == null) {
      options = {};
    }
    this.collectionName = collectionName;
  }
  Mongo.prototype.collection = function() {
    var _ref;
    return (_ref = this._collection) != null ? _ref : this._collection = new this.lib().Collection(this.database, this.collectionName);
  };
  Mongo.prototype.find = function(query, callback) {};
  Mongo.alias("select", "find");
  Mongo.prototype.first = function(query, callback) {};
  Mongo.prototype.last = function(query, callback) {};
  Mongo.prototype.all = function(query, callback) {};
  Mongo.prototype.length = function(query, callback) {};
  Mongo.alias("count", "length");
  Mongo.prototype.remove = function(query, callback) {};
  Mongo.prototype.clear = function() {};
  Mongo.prototype.toArray = function() {};
  Mongo.prototype.create = function(record, callback) {
    return this.collection().insert(record, callback);
  };
  Mongo.prototype.update = function(record) {};
  Mongo.prototype.destroy = function(record) {};
  Mongo.prototype.sort = function() {};
  return Mongo;
})();
module.exports = Mongo;