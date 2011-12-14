(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  Metro.Store = (function() {

    __extends(Store, Metro.Object);

    Store.defaultLimit = 100;

    Store.atomicModifiers = {
      "$set": "$set",
      "$unset": "$unset",
      "$push": "$push",
      "$pushAll": "$pushAll",
      "$pull": "$pull",
      "$pullAll": "$pullAll"
    };

    Store.reservedOperators = {
      "_sort": "_sort",
      "_limit": "_limit"
    };

    Store.queryOperators = {
      ">=": "$gte",
      "$gte": "$gte",
      ">": "$gt",
      "$gt": "$gt",
      "<=": "$lte",
      "$lte": "$lte",
      "<": "$lt",
      "$lt": "$lt",
      "$in": "$in",
      "$nin": "$nin",
      "$any": "$any",
      "$all": "$all",
      "=~": "$m",
      "$m": "$m",
      "!~": "$nm",
      "$nm": "$nm",
      "=": "$eq",
      "$eq": "$eq",
      "!=": "$neq",
      "$neq": "$neq",
      "$null": "$null",
      "$notNull": "$notNull"
    };

    Store.booleans = {
      "true": true,
      "true": true,
      "TRUE": true,
      "1": true,
      1: true,
      1.0: true,
      "false": false,
      "false": false,
      "FALSE": false,
      "0": false,
      0: false,
      0.0: false
    };

    Store.prototype.serialize = function(data) {
      var i, item, _len;
      if (!this.serializeAttributes) return data;
      for (i = 0, _len = data.length; i < _len; i++) {
        item = data[i];
        data[i] = this.serializeAttributes(item);
      }
      return data;
    };

    Store.prototype.deserialize = function(models) {
      var i, model, _len;
      if (!this.deserializeAttributes) return models;
      for (i = 0, _len = models.length; i < _len; i++) {
        model = models[i];
        models[i] = this.deserializeAttributes(model);
      }
      return models;
    };

    Store.prototype.serializeAttributes = function(attributes) {
      var klass;
      klass = Metro.constant(this.className);
      return new klass(attributes);
    };

    Store.prototype.deserializeAttributes = function(model) {
      return model.attributes;
    };

    function Store(options) {
      if (options == null) options = {};
      this.name = options.name;
      this.className = options.className || Metro.namespaced(Metro.Support.String.camelize(Metro.Support.String.singularize(this.name)));
      this.model = Metro.constant(this.className);
    }

    Store.prototype.find = function() {
      var callback, ids, options, query, _i;
      ids = 4 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 3) : (_i = 0, []), query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      if (ids.length === 1) {
        query.id = ids[0];
        return this.findOne(query, options, callback);
      } else {
        query.id = {
          $in: ids
        };
        return this.all(query, options, callback);
      }
    };

    Store.prototype.first = function(query, options, callback) {
      return this.findOne(query, options, callback);
    };

    Store.prototype.last = function(query, options, callback) {
      return this.findOne(query, options, callback);
    };

    Store.prototype.build = function(attributes, options, callback) {
      var record;
      record = this.serializeAttributes(attributes);
      if (callback) callback.call(this, null, record);
      return record;
    };

    Store.prototype.update = function() {
      var callback, ids, options, query, updates, _i;
      ids = 5 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 4) : (_i = 0, []), updates = arguments[_i++], query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      query.id = {
        $in: ids
      };
      return this.updateAll(updates, query, options, callback);
    };

    Store.prototype["delete"] = function() {
      var callback, ids, options, query, _i;
      ids = 4 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 3) : (_i = 0, []), query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      query.id = {
        $in: ids
      };
      return this.deleteAll(query, options, callback);
    };

    Store.prototype.schema = function() {
      return this.model.schema();
    };

    return Store;

  })();

  require('./store/cassandra');

  require('./store/couchdb');

  require('./store/fileSystem');

  require('./store/local');

  require('./store/memory');

  require('./store/mongodb');

  require('./store/postgresql');

  require('./store/redis');

  module.exports = Metro.Store;

}).call(this);
