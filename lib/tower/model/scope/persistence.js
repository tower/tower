
Tower.Model.Scope.Persistence = {
  ClassMethods: {
    persistenceMethods: ["create", "update", "destroy"]
  },
  build: function(attributes, options) {
    var conditions, _ref;
    _ref = this.toCreate(), conditions = _ref.conditions, options = _ref.options;
    return this._build(attributes, conditions, options);
  },
  create: function() {
    var callback, criteria, data, options, _ref;
    _ref = this._extractArgs(arguments, {
      data: true
    }), criteria = _ref.criteria, data = _ref.data, options = _ref.options, callback = _ref.callback;
    criteria.mergeOptions(options);
    return this._create(criteria, data, options, callback);
  },
  update: function() {
    var callback, criteria, data, options, _ref;
    _ref = this._extractArgs(arguments, {
      ids: true,
      data: true
    }), criteria = _ref.criteria, data = _ref.data, options = _ref.options, callback = _ref.callback;
    criteria.mergeOptions(options);
    return this._update(criteria, data, options, callback);
  },
  destroy: function() {
    var callback, criteria, options, _ref;
    _ref = this._extractArgs(arguments, {
      ids: true
    }), criteria = _ref.criteria, options = _ref.options, callback = _ref.callback;
    criteria.mergeOptions(options);
    return this._destroy(criteria, options, callback);
  },
  sync: function() {},
  transaction: function() {},
  _build: function(attributes, conditions, options) {
    var object, result, _i, _len;
    if (Tower.Support.Object.isArray(attributes)) {
      result = [];
      for (_i = 0, _len = attributes.length; _i < _len; _i++) {
        object = attributes[_i];
        result.push(this.store.serializeModel(Tower.Support.Object.extend({}, conditions, object)));
      }
      return result;
    } else {
      return this.store.serializeModel(Tower.Support.Object.extend({}, conditions, attributes));
    }
  },
  _create: function(criteria, data, opts, callback) {
    var isArray, iterator, records;
    var _this = this;
    if (opts.instantiate) {
      isArray = Tower.Support.Object.isArray(data);
      records = Tower.Support.Object.toArray(this.build(data));
      iterator = function(record, next) {
        if (record) {
          return record.save(next);
        } else {
          return next();
        }
      };
      return Tower.async(records, iterator, function(error) {
        if (!callback) {
          if (error) throw error;
        } else {
          if (error) return callback(error);
          if (isArray) {
            return callback(error, records);
          } else {
            return callback(error, records[0]);
          }
        }
      });
    } else {
      return this.store.create(data, opts, callback);
    }
  },
  _update: function(criteria, data, opts, callback) {
    var conditions, iterator, options, _ref;
    _ref = criteria.toQuery(), conditions = _ref.conditions, options = _ref.options;
    if (opts.instantiate) {
      iterator = function(record, next) {
        return record.updateAttributes(data, next);
      };
      return this._each(conditions, options, iterator, callback);
    } else {
      return this.store.update(data, conditions, options, callback);
    }
  },
  _destroy: function(criteria, opts, callback) {
    var conditions, iterator, options, _ref;
    _ref = criteria.toQuery(), conditions = _ref.conditions, options = _ref.options;
    if (opts.instantiate) {
      iterator = function(record, next) {
        return record.destroy(next);
      };
      return this._each(conditions, options, iterator, callback);
    } else {
      return this.store.destroy(conditions, options, callback);
    }
  },
  _each: function(conditions, options, iterator, callback) {
    var _this = this;
    return this.store.find(conditions, options, function(error, records) {
      if (error) {
        return callback.call(_this, error, records);
      } else {
        return Tower.async(records, iterator, function(error) {
          if (!callback) {
            if (error) throw error;
          } else {
            if (callback) return callback.call(_this, error, records);
          }
        });
      }
    });
  }
};

module.exports = Tower.Model.Scope.Persistence;
