(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Store = (function() {

    __extends(Store, Metro.Object);

    Store.defaultLimit = 100;

    Store.atomicModifiers = {
      "$set": "$set",
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
      ">=": "gte",
      "gte": "gte",
      ">": "gt",
      "gt": "gt",
      "<=": "lte",
      "lte": "lte",
      "<": "lt",
      "lt": "lt",
      "in": "in",
      "nin": "nin",
      "any": "any",
      "all": "all",
      "=~": "m",
      "m": "m",
      "!~": "nm",
      "nm": "nm",
      "=": "eq",
      "eq": "eq",
      "!=": "neq",
      "neq": "neq",
      "null": "null",
      "notNull": "notNull"
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
    }

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
