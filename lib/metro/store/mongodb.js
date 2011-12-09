(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Store.MongoDB = (function() {

    __extends(MongoDB, Metro.Store);

    function MongoDB() {
      MongoDB.__super__.constructor.apply(this, arguments);
    }

    MongoDB.Serializer = (function() {

      function Serializer() {}

      return Serializer;

    })();

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
          if (env.username && env.password) {
            return client.authenticate(env.username, env.password, function(error) {
              if (error) throw error;
              self.database = client;
              if (callback) return callback();
            });
          } else {
            self.database = client;
            if (callback) return callback();
          }
        });
        process.on("exit", function() {
          if (self.database) return self.database.close();
        });
      }
      return this.database;
    };

    MongoDB.prototype.collection = function() {
      var lib;
      if (!this._collection) {
        lib = this.constructor.lib();
        this._collection = new lib.Collection(this.constructor.database, this.name);
      }
      return this._collection;
    };

    MongoDB.prototype.find = function(query, callback) {
      var self;
      self = this;
      this.collection().find().toArray(function(error, docs) {
        var doc, _i, _len;
        if (!error) {
          for (_i = 0, _len = docs.length; _i < _len; _i++) {
            doc = docs[_i];
            doc.id = doc["_id"];
            delete doc["_id"];
          }
          docs = self.serialize(docs);
        }
        return callback.call(this, error, docs);
      });
      return this;
    };

    MongoDB.alias("select", "find");

    MongoDB.prototype.first = function(query, callback) {};

    MongoDB.prototype.last = function(query, callback) {};

    MongoDB.prototype.all = function(callback) {
      return this.find({}, callback);
    };

    MongoDB.prototype.length = function(query, callback) {
      this.collection().count(function(error, result) {
        return callback.call(this, error, result);
      });
      return this;
    };

    MongoDB.alias("count", "length");

    MongoDB.prototype.remove = function(query, callback) {};

    MongoDB.prototype.removeAll = function(callback) {
      return this.collection().remove(function(error) {
        if (callback) return callback.call(this, error);
      });
    };

    MongoDB.alias("clear", "removeAll");

    MongoDB.prototype.create = function(attributes, callback) {
      var record, self;
      self = this;
      record = this.serializeAttributes(attributes);
      this.collection().insert(attributes, function(error, docs) {
        var doc;
        doc = docs[0];
        record.attributes.id = doc["_id"];
        if (callback) return callback.call(this, error, record);
      });
      attributes.id = attributes["_id"];
      delete attributes["_id"];
      return record;
    };

    MongoDB.prototype.update = function(query, attributes, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else if (!options) {
        options = {};
      }
      options.safe = false;
      options.upsert = false;
      this.collection().update(this._translateQuery(query), attributes, options, function(error, docs) {
        if (error) throw error;
        if (callback) return callback.call(this, error, docs);
      });
      return this;
    };

    MongoDB.prototype.destroy = function(query, callback) {
      this.collection().remove(this._translateQuery(query), function(error) {
        if (callback) return callback.call(this, error);
      });
      return this;
    };

    MongoDB.prototype.sort = function() {};

    MongoDB.prototype._translateQuery = function(query) {
      var key, result, value;
      result = {};
      if (query.id) result["_id"] = query.id;
      delete query.id;
      for (key in query) {
        value = query[key];
        result[key] = value;
      }
      return result;
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
