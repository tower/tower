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
      return this._lib || (this._lib = require('mongodb'));
    };

    MongoDB.initialize = function(callback) {
      var env, mongo, self;
      self = this;
      if (!this.database) {
        env = this.env();
        mongo = this.lib();
        new mongo.Db(env.name, new mongo.Server(env.host, env.port, {})).open(function(error, client) {
          if (error) throw error;
          self.database = client;
          if (callback) return callback();
        });
        process.on("exit", function() {
          if (self.database) return self.database.close();
        });
      }
      return this.database;
    };

    function MongoDB(collectionName, options) {
      if (options == null) options = {};
      this.collectionName = collectionName;
    }

    MongoDB.prototype.collection = function() {
      var lib;
      if (!this._collection) {
        lib = this.constructor.lib();
        this._collection = new lib.Collection(this.constructor.database, this.collectionName);
      }
      return this._collection;
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
      var self;
      self = this;
      this.collection().insert(record.attributes, function(error, docs) {
        if (error) throw error;
        record["_id"] = docs[0]["_id"];
        if (callback) return callback.call(self, error, docs);
      });
      return record;
    };

    MongoDB.prototype.update = function(record) {};

    MongoDB.prototype.destroy = function(record) {};

    MongoDB.prototype.sort = function() {};

    MongoDB.prototype._translateQuery = function(query) {
      var key, result, value, _results;
      result = {};
      if (query.id) result["_id"] = query.id;
      _results = [];
      for (key in query) {
        value = query[key];
        _results.push(this);
      }
      return _results;
    };

    MongoDB.prototype.matches = function(record, query) {
      var key, recordValue, self, success, value;
      self = this;
      success = true;
      for (key in query) {
        value = query[key];
        if (!!Metro.Store.reservedOperators[key]) continue;
        recordValue = record[key];
        if (typeof value === 'object') {
          success = self._matchesOperators(record, recordValue, value);
        } else {
          if (typeof value === "function") value = value.call(record);
          success = recordValue === value;
        }
        if (!success) return false;
      }
      return true;
    };

    MongoDB.prototype.generateId = function() {
      return this.lastId++;
    };

    MongoDB.prototype._matchesOperators = function(record, recordValue, operators) {
      var key, operator, self, success, value;
      success = true;
      self = this;
      for (key in operators) {
        value = operators[key];
        if (operator = Metro.Store.queryOperators[key]) {
          if (typeof value === "function") value = value.call(record);
          switch (operator) {
            case "gt":
              success = self._isGreaterThan(recordValue, value);
              break;
            case "gte":
              success = self._isGreaterThanOrEqualTo(recordValue, value);
              break;
            case "lt":
              success = self._isLessThan(recordValue, value);
              break;
            case "lte":
              success = self._isLessThanOrEqualTo(recordValue, value);
              break;
            case "eq":
              success = self._isEqualTo(recordValue, value);
              break;
            case "neq":
              success = self._isNotEqualTo(recordValue, value);
              break;
            case "m":
              success = self._isMatchOf(recordValue, value);
              break;
            case "nm":
              success = self._isNotMatchOf(recordValue, value);
              break;
            case "any":
              success = self._anyIn(recordValue, value);
              break;
            case "all":
              success = self._allIn(recordValue, value);
          }
          if (!success) return false;
        } else {
          return recordValue === operators;
        }
      }
      return true;
    };

    return MongoDB;

  })();

  module.exports = Metro.Store.MongoDB;

}).call(this);
