
Tower.Model.Scope.Persistence = {
  ClassMethods: {
    persistenceMethods: ["create", "update", "destroy"]
  },
  build: function() {
    return this._build.apply(this, this.toCriteria(arguments, {
      data: true
    }));
  },
  create: function() {
    return this._create.apply(this, this.toCriteria(arguments, {
      data: true
    }));
  },
  update: function() {
    return this._update.apply(this, this.toCriteria(arguments, {
      ids: true,
      data: true
    }));
  },
  destroy: function() {
    return this._destroy.apply(this, this.toCriteria(arguments, {
      ids: true
    }));
  },
  _build: function(attributes, conditions, options) {
    var object, result, store, _i, _len;
    store = this.store;
    if (Tower.Support.Object.isArray(attributes)) {
      result = [];
      for (_i = 0, _len = attributes.length; _i < _len; _i++) {
        object = attributes[_i];
        if (object instanceof Tower.Model) {
          Tower.Support.Object.extend(object.attributes, conditions, object.attributes);
        } else {
          object = this.store.serializeModel(Tower.Support.Object.extend({}, conditions, object));
        }
        result.push(object);
      }
      return result;
    } else {
      if (attributes instanceof Tower.Model) {
        Tower.Support.Object.extend(attributes.attributes, conditions, attributes.attributes);
      } else {
        attributes = this.store.serializeModel(Tower.Support.Object.extend({}, conditions, attributes));
      }
      return attributes;
    }
  },
  _create: function(criteria, callback) {
    var iterator, records,
      _this = this;
    if (criteria.instantiate) {
      records = Tower.Support.Object.toArray(this.build(criteria.records));
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
      return this.store.create(criteria);
    }
  },
  _update: function(criteria, callback) {
    var iterator;
    if (criteria.instantiate) {
      iterator = function(record, next) {
        return record.updateAttributes(criteria.args, next);
      };
      return this._each(criteria, iterator, callback);
    } else {
      return this.store.update(criteria, callback);
    }
  },
  _destroy: function(criteria) {
    var iterator;
    if (criteria.instantiate) {
      iterator = function(record, next) {
        return record.destroy(next);
      };
      return this._each(criteria, iterator, callback);
    } else {
      return this.store.destroy(criteria, callback);
    }
  },
  _each: function(criteria, iterator, callback) {
    var _this = this;
    return this.store.find(criteria, function(error, records) {
      if (error) {
        return callback.call(_this, error, records);
      } else {
        return Tower.parallel(records, iterator, function(error) {
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
