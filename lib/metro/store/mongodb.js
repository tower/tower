(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Store.MongoDB = (function() {

    __extends(MongoDB, Metro.Object);

    MongoDB.config = {
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

    MongoDB.configure = function(options) {
      return Metro.Support.Object.mixin(this.config, options);
    };

    MongoDB.env = function() {
      return this.config[Metro.env];
    };

    MongoDB.lib = function() {
      return require('mongodb');
    };

    MongoDB.initialize = function(callback) {
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

    function MongoDB(collectionName, options) {
      if (options == null) options = {};
      this.collectionName = collectionName;
    }

    MongoDB.prototype.collection = function() {
      var _ref;
      return (_ref = this._collection) != null ? _ref : this._collection = new this.lib().Collection(this.database, this.collectionName);
    };

    MongoDB.prototype.find = function(query, callback) {};

    MongoDB.alias("select", "find");

    MongoDB.prototype.first = function(query, callback) {};

    MongoDB.prototype.last = function(query, callback) {};

    MongoDB.prototype.all = function(query, callback) {};

    MongoDB.prototype.length = function(query, callback) {};

    MongoDB.alias("count", "length");

    MongoDB.prototype.remove = function(query, callback) {};

    MongoDB.prototype.clear = function() {};

    MongoDB.prototype.toArray = function() {};

    MongoDB.prototype.create = function(record, callback) {
      return this.collection().insert(record, callback);
    };

    MongoDB.prototype.update = function(record) {};

    MongoDB.prototype.destroy = function(record) {};

    MongoDB.prototype.sort = function() {};

    return MongoDB;

  })();

  module.exports = Metro.Store.MongoDB;

}).call(this);
