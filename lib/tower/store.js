var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store = (function(_super) {

  __extends(Store, _super);

  Store.defaultLimit = 100;

  Store.isKeyword = function(key) {
    return this.queryOperators.hasOwnProperty(key) || this.atomicModifiers.hasOwnProperty(key);
  };

  Store.hasKeyword = function(object) {
    var key, value;
    if ((function() {
      var _ref, _results;
      _ref = this.queryOperators;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(object.hasOwnProperty(key));
      }
      return _results;
    }).call(this)) {
      return true;
    }
    if ((function() {
      var _ref, _results;
      _ref = this.atomicModifiers;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(object.hasOwnProperty(key));
      }
      return _results;
    }).call(this)) {
      return true;
    }
    return false;
  };

  Store.atomicModifiers = {
    "$set": "$set",
    "$unset": "$unset",
    "$push": "$push",
    "$pushAll": "$pushAll",
    "$pull": "$pull",
    "$pullAll": "$pullAll",
    "$inc": "$inc",
    "$pop": "$pop"
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
    "=~": "$regex",
    "$m": "$regex",
    "$regex": "$regex",
    "$match": "$match",
    "$notMatch": "$notMatch",
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
    for (i = 0, _len = data.length; i < _len; i++) {
      item = data[i];
      data[i] = this.serializeModel(item);
    }
    return data;
  };

  Store.prototype.deserialize = function(models) {
    var i, model, _len;
    for (i = 0, _len = models.length; i < _len; i++) {
      model = models[i];
      models[i] = this.deserializeModel(model);
    }
    return models;
  };

  Store.prototype.serializeModel = function(attributes) {
    var klass;
    if (attributes instanceof Tower.Model) return attributes;
    klass = Tower.constant(this.className);
    return new klass(attributes);
  };

  Store.prototype.deserializeModel = function(data) {
    if (data instanceof Tower.Model) {
      return data.attributes;
    } else {
      return data;
    }
  };

  function Store(options) {
    if (options == null) options = {};
    this.name = options.name;
    this.className = options.type || Tower.namespaced(Tower.Support.String.camelize(Tower.Support.String.singularize(this.name)));
  }

  Store.prototype._defaultOptions = function(options) {
    return options;
  };

  Store.prototype.load = function(records) {};

  Store.prototype.fetch = function() {};

  Store.prototype.schema = function() {
    return Tower.constant(this.className).fields();
  };

  return Store;

})(Tower.Class);

Tower.Store.include(Tower.Support.Callbacks);

require('./store/cassandra');

require('./store/couchdb');

require('./store/fileSystem');

require('./store/memory');

require('./store/local');

require('./store/mongodb');

require('./store/neo4j');

require('./store/postgresql');

require('./store/riak');

require('./store/redis');

module.exports = Tower.Store;
