var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store = (function(_super) {

  __extends(Store, _super);

  Store.include(Tower.Support.Callbacks);

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
    "$pop": "$pop",
    "$addToSet": "$addToSet"
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
    "$any": "$in",
    "$nin": "$nin",
    "$all": "$all",
    "=~": "$regex",
    "$m": "$regex",
    "$regex": "$regex",
    "$match": "$regex",
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

  Store.prototype.supports = {};

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

  Store.prototype.supports = function(key) {
    return this.constructor.supports[key] === true;
  };

  Store.prototype._mapKeys = function(key, records) {
    return _.map(records, function(record) {
      return record.get(key);
    });
  };

  Store.prototype.runBeforeCreate = function(criteria, callback) {
    return callback();
  };

  Store.prototype.runAfterCreate = function(criteria, callback) {
    return callback();
  };

  Store.prototype.runBeforeUpdate = function(criteria, callback) {
    if (criteria.throughRelation) {
      return criteria.appendThroughConditions(callback);
    } else {
      return callback();
    }
  };

  Store.prototype.runAfterUpdate = function(criteria, callback) {
    return callback();
  };

  Store.prototype.runBeforeDestroy = function(criteria, callback) {
    if (criteria.throughRelation) {
      return criteria.appendThroughConditions(callback);
    } else {
      return callback();
    }
  };

  Store.prototype.runAfterDestroy = function(criteria, callback) {
    return callback();
  };

  Store.prototype.runBeforeFind = function(criteria, callback) {
    if (criteria.throughRelation) {
      return criteria.appendThroughConditions(callback);
    } else {
      return callback();
    }
  };

  Store.prototype.runAfterFind = function(criteria, callback) {
    return callback();
  };

  return Store;

})(Tower.Class);

require('./store/memory');

module.exports = Tower.Store;
