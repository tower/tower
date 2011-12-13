(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

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
      var env, mongo, self, url;
      self = this;
      if (!this.database) {
        env = this.env();
        mongo = this.lib();
        if (env.url) {
          url = new Metro.Net.Url(env.url);
          env.name = url.segments[0] || url.user;
          env.host = url.hostname;
          env.port = url.port;
          env.username = url.user;
          env.password = url.password;
        }
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

    MongoDB.alias("deleteAll", "deleteAll");

    MongoDB.prototype.update = function(query, attributes, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else if (!options) {
        options = {};
      }
      options.safe = false;
      options.upsert = false;
      this.collection().update(this._translateQuery(query), {
        "$set": attributes
      }, options, function(error, docs) {
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

    MongoDB.prototype._serializeAttributes = function(attributes) {
      var key, set, value;
      set = {};
      for (key in attributes) {
        value = attributes[key];
        if (this._atomicOperator(key)) {
          attributes[key] = this._serializeAttributes(value);
        } else {
          set[key] = this._serializeAttribute(key, value);
        }
      }
      attributes["$set"] = Metro.Support.Object.extend(attributes["$set"], set);
      return attributes;
    };

    MongoDB.prototype._serializeAttribute = function(key, value) {
      switch (this.owner.attributeType(key)) {
        case "string":
          return value.toString();
        case "integer":
          return parseInt(value);
        case "float":
          return parseFloat(value);
        case "date":
        case "time":
          return value;
        case "array":
          return value;
        case "id":
          return this.serializeId(value);
        default:
          return value;
      }
    };

    MongoDB.prototype._serializeAssociation = function() {};

    MongoDB.prototype.serializeId = function(value) {
      return this.constructor.database.bson_serializer.ObjectID(value.toString());
    };

    MongoDB.prototype.deserializeId = function(value) {
      return value.toString();
    };

    MongoDB.prototype.serializeDate = function(value) {
      return value;
    };

    MongoDB.prototype.deserializeDate = function(value) {
      return value;
    };

    MongoDB.prototype.serializeArray = function(value) {};

    MongoDB.prototype.deserializeArray = function(value) {};

    MongoDB.prototype.serializeQueryAttributes = function(query) {
      var key, result, schema, value;
      result = {};
      schema = this.schema();
      for (key in query) {
        value = query[key];
        result[key] = this.serializeQueryAttribute(key, value, schema);
      }
      return result;
    };

    MongoDB.prototype.serializeQueryAttribute = function(key, value, schema) {
      var encoder;
      if (schema[key]) encoder = this["encode" + schema[key].type];
      if (this.hasQueryOperators(value)) {} else {
        if (encoder) return encoder(value);
      }
    };

    MongoDB.prototype.findOne = function(query, options, callback) {
      options.limit = 1;
      this.collection().findOne(this._translateQuery(query), options, function(error, doc) {
        if (!error) doc = self.serializeAttributes(doc);
        return callback.call(this, error, doc);
      });
      return this;
    };

    MongoDB.prototype.all = function(query, options, callback) {
      var self;
      self = this;
      this.collection().find(this._translateQuery(query), options).toArray(function(error, docs) {
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

    MongoDB.prototype.create = function(attributes, query, options, callback) {
      var record, self;
      self = this;
      record = this.serializeAttributes(attributes);
      this.collection().insert(attributes, function(error, docs) {
        var doc;
        doc = docs[0];
        record.id = doc["_id"];
        if (callback) return callback.call(this, error, record);
      });
      record.id = attributes["_id"];
      delete attributes["_id"];
      return record;
    };

    MongoDB.prototype.update = function() {
      var callback, ids, options, query, updates, _i, _ref;
      ids = 5 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 4) : (_i = 0, []), updates = arguments[_i++], query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      return (_ref = this.store()).update.apply(_ref, __slice.call(ids).concat([updates], [callback]));
    };

    MongoDB.prototype.updateAll = function(updates, query, options, callback) {
      return this.store().updateAll(updates, callback);
    };

    MongoDB.prototype["delete"] = function() {
      var callback, ids, options, query, _i, _ref;
      ids = 4 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 3) : (_i = 0, []), query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      return (_ref = this.store())["delete"].apply(_ref, __slice.call(ids).concat([callback]));
    };

    MongoDB.prototype.deleteAll = function(query, options, callback) {
      var _ref;
      return (_ref = this.store()).deleteAll.apply(_ref, __slice.call(ids).concat([callback]));
    };

    MongoDB.prototype.destroy = function() {
      var callback, ids, options, query, _i, _ref;
      ids = 4 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 3) : (_i = 0, []), query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      return (_ref = this.store()).destroy.apply(_ref, __slice.call(ids).concat([callback]));
    };

    MongoDB.prototype.destroyAll = function(query, options, callback) {
      var _ref;
      return (_ref = this.store()).destroy.apply(_ref, __slice.call(ids).concat([callback]));
    };

    MongoDB.prototype.encodeString = function(value) {};

    MongoDB.prototype.decodeString = function(value) {};

    MongoDB.prototype.encodeOrder = function(value) {};

    MongoDB.prototype.decodeOrder = function(value) {};

    MongoDB.prototype.encodeDate = function(value) {};

    MongoDB.prototype.decodeDate = function(value) {};

    return MongoDB;

  })();

  module.exports = Metro.Store.MongoDB;

}).call(this);
