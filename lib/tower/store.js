var __defineStaticProperty = function(clazz, key, value) {
  if (typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Store = (function(_super) {
  var Store;

  function Store() {
    return Store.__super__.constructor.apply(this, arguments);
  }

  Store = __extends(Store, _super);

  Store.include(Tower.Support.Callbacks);

  __defineStaticProperty(Store,  "defaultLimit", 100);

  __defineStaticProperty(Store,  "isKeyword", function(key) {
    return this.queryOperators.hasOwnProperty(key) || this.atomicModifiers.hasOwnProperty(key);
  });

  __defineStaticProperty(Store,  "hasKeyword", function(object) {
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
  });

  __defineStaticProperty(Store,  "atomicModifiers", {
    "$set": "$set",
    "$unset": "$unset",
    "$push": "$push",
    "$pushAll": "$pushAll",
    "$pull": "$pull",
    "$pullAll": "$pullAll",
    "$inc": "$inc",
    "$pop": "$pop",
    "$addToSet": "$addToSet"
  });

  __defineStaticProperty(Store,  "queryOperators", {
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
  });

  __defineStaticProperty(Store,  "booleans", {
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
  });

  __defineStaticProperty(Store,  "configure", function(options) {
    return this.config = options;
  });

  __defineStaticProperty(Store,  "initialize", function(callback) {
    if (callback) {
      return callback();
    }
  });

  __defineStaticProperty(Store,  "env", function() {
    return this.config;
  });

  __defineProperty(Store,  "supports", {});

  __defineProperty(Store,  "addIndex", function(name, options) {});

  __defineProperty(Store,  "serialize", function(data, saved) {
    var i, item, _i, _len;
    if (saved == null) {
      saved = false;
    }
    for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
      item = data[i];
      data[i] = this.serializeModel(item, saved);
    }
    return data;
  });

  __defineProperty(Store,  "deserialize", function(models) {
    var i, model, _i, _len;
    for (i = _i = 0, _len = models.length; _i < _len; i = ++_i) {
      model = models[i];
      models[i] = this.deserializeModel(model);
    }
    return models;
  });

  __defineProperty(Store,  "serializeModel", function(attributes) {
    var klass, model;
    if (attributes instanceof Tower.Model) {
      return attributes;
    }
    klass = Tower.constant(this.className);
    model = klass["new"]();
    model.setProperties(attributes);
    return model;
  });

  __defineProperty(Store,  "deserializeModel", function(data) {
    if (data instanceof Tower.Model) {
      return data.get('changes');
    } else {
      return data;
    }
  });

  __defineProperty(Store,  "init", function(options) {
    if (options == null) {
      options = {};
    }
    this._super.apply(this, arguments);
    this.name = options.name;
    return this.className = options.type || Tower.namespaced(Tower.Support.String.camelize(Tower.Support.String.singularize(this.name)));
  });

  __defineProperty(Store,  "_defaultOptions", function(options) {
    return options;
  });

  __defineProperty(Store,  "load", function(records) {});

  __defineProperty(Store,  "fetch", function() {});

  __defineProperty(Store,  "schema", function() {
    return Tower.constant(this.className).fields();
  });

  __defineProperty(Store,  "supports", function(key) {
    return this.constructor.supports[key] === true;
  });

  __defineProperty(Store,  "hashWasUpdated", function(type, clientId, record) {
    if (Ember.get(record, 'isDeleted')) {
      return;
    }
    return this.updateCursors(type, clientId, record);
  });

  __defineProperty(Store,  "cursors", Ember.computed(function() {
    return [];
  }).cacheable());

  __defineProperty(Store,  "updateCursors", function(type, clientId, record) {});

  __defineProperty(Store,  "removeFromCursors", function(record) {});

  __defineProperty(Store,  "_mapKeys", function(key, records) {
    return _.map(records, function(record) {
      return record.get(key);
    });
  });

  return Store;

})(Tower.Class);

require('./store/callbacks');

require('./store/batch');

require('./store/memory');

require('./store/modifiers');

require('./store/operators');

require('./store/serializer');

require('./store/transaction');

Tower.Store.include(Tower.Store.Callbacks);

module.exports = Tower.Store;
