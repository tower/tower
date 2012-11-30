var _,
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

_ = Tower._;

Tower.Store = (function(_super) {
  var Store;

  function Store() {
    return Store.__super__.constructor.apply(this, arguments);
  }

  Store = __extends(Store, _super);

  Store.include(Tower.SupportCallbacks);

  Store.reopenClass({
    defaultLimit: 100,
    isKeyword: function(key) {
      return this.queryOperators.hasOwnProperty(key) || this.atomicModifiers.hasOwnProperty(key);
    },
    hasKeyword: function(object) {
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
    },
    atomicModifiers: {
      "$set": "$set",
      "$unset": "$unset",
      "$push": "$push",
      "$pushAll": "$pushAll",
      "$pull": "$pull",
      "$pullAll": "$pullAll",
      "$inc": "$inc",
      "$pop": "$pop",
      "$addToSet": "$addToSet"
    },
    queryOperators: {
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
    },
    booleans: {
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
    },
    configure: function(options) {
      return this.config = options;
    },
    initialize: function(callback) {
      if (callback) {
        return callback();
      }
    },
    env: function() {
      return this.config;
    },
    supports: {}
  });

  Store.reopen({
    addIndex: function(name, options) {},
    serialize: function(data, saved) {
      var i, item, _i, _len;
      if (saved == null) {
        saved = false;
      }
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        item = data[i];
        data[i] = this.serializeModel(item, saved);
      }
      return data;
    },
    deserialize: function(models) {
      var i, model, _i, _len;
      for (i = _i = 0, _len = models.length; _i < _len; i = ++_i) {
        model = models[i];
        models[i] = this.deserializeModel(model);
      }
      return models;
    },
    serializeModel: function(attributes, saved) {
      var klass, model;
      if (attributes instanceof Tower.Model) {
        return attributes;
      }
      if ((attributes.id != null) && this.records) {
        model = this.records.get(attributes.id);
      }
      if (!model) {
        klass = Tower.constant(this.className);
        model = klass["new"]();
      }
      model.initialize(attributes, {
        isNew: !saved
      });
      return model;
    },
    deserializeModel: function(data) {
      if (data instanceof Tower.Model) {
        return data.get('dirtyAttributes');
      } else {
        return data;
      }
    },
    init: function(options) {
      if (options == null) {
        options = {};
      }
      this._super.apply(this, arguments);
      if (options.name != null) {
        this.name = options.name;
      }
      if (this.name) {
        return this.className = options.type || Tower.namespaced(_.camelize(_.singularize(this.name)));
      }
    },
    _defaultOptions: function(options) {
      return options;
    },
    load: function(records) {},
    schema: function() {
      return Tower.constant(this.className).fields();
    },
    supports: function(key) {
      return this.constructor.supports[key] === true;
    },
    hashWasUpdated: function(type, clientId, record) {
      if (Ember.get(record, 'isDeleted')) {
        return;
      }
      return this.updateCursors(type, clientId, record);
    },
    cursors: Ember.computed(function() {
      return [];
    }).cacheable(),
    updateCursors: function(type, clientId, record) {},
    removeFromCursors: function(record) {},
    _mapKeys: function(key, records) {
      return _.map(records, function(record) {
        return record.get(key);
      });
    },
    refresh: function() {},
    fetch: function(cursor, callback) {
      if (cursor.returnArray === false) {
        return this.findOne(cursor, callback);
      } else {
        return this.find(cursor, callback);
      }
    },
    findWithCursor: function() {},
    createWithCursor: function() {},
    updateWithCursor: function() {},
    destroyWithCursor: function() {}
  });

  return Store;

})(Tower.Class);

module.exports = Tower.Store;
