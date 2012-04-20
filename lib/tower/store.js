var __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend();
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Store = (function(_super) {
  var Store;

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

  __defineProperty(Store,  "supports", {});

  __defineProperty(Store,  "addIndex", function(name, options) {});

  __defineProperty(Store,  "serialize", function(data) {
    var i, item, _i, _len;
    for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
      item = data[i];
      data[i] = this.serializeModel(item);
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
    var klass;
    if (attributes instanceof Tower.Model) {
      return attributes;
    }
    klass = Tower.constant(this.className);
    return new klass(attributes);
  });

  __defineProperty(Store,  "deserializeModel", function(data) {
    if (data instanceof Tower.Model) {
      return data.attributes;
    } else {
      return data;
    }
  });

  function Store(options) {
    if (options == null) {
      options = {};
    }
    this.name = options.name;
    this.className = options.type || Tower.namespaced(Tower.Support.String.camelize(Tower.Support.String.singularize(this.name)));
  }

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

  __defineProperty(Store,  "_mapKeys", function(key, records) {
    return _.map(records, function(record) {
      return record.get(key);
    });
  });

  __defineProperty(Store,  "runBeforeCreate", function(criteria, callback) {
    return callback();
  });

  __defineProperty(Store,  "runAfterCreate", function(criteria, callback) {
    return callback();
  });

  __defineProperty(Store,  "runBeforeUpdate", function(criteria, callback) {
    if (criteria.throughRelation) {
      return criteria.appendThroughConditions(callback);
    } else {
      return callback();
    }
  });

  __defineProperty(Store,  "runAfterUpdate", function(criteria, callback) {
    return callback();
  });

  __defineProperty(Store,  "runBeforeDestroy", function(criteria, callback) {
    if (criteria.throughRelation) {
      return criteria.appendThroughConditions(callback);
    } else {
      return callback();
    }
  });

  __defineProperty(Store,  "runAfterDestroy", function(criteria, callback) {
    return callback();
  });

  __defineProperty(Store,  "runBeforeFind", function(criteria, callback) {
    if (criteria.throughRelation) {
      return criteria.appendThroughConditions(callback);
    } else {
      return callback();
    }
  });

  __defineProperty(Store,  "runAfterFind", function(criteria, callback) {
    return callback();
  });

  return Store;

})(Tower.Class);

require('./store/memory');

module.exports = Tower.Store;
