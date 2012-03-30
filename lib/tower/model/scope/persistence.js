
Tower.Model.Scope.Persistence = {
  ClassMethods: {
    persistenceMethods: ["create", "update", "destroy"]
  },
  build: function() {
    return this._build.apply(this, this._extractArgsForBuild(arguments, {
      data: true
    }));
  },
  create: function() {
    return this._create.apply(this, this._extractArgsForCreate(arguments));
  },
  update: function() {
    return this._update.apply(this, this._extractArgsForUpdate(arguments));
  },
  destroy: function() {
    return this._destroy.apply(this, this._extractArgsForDestroy(arguments));
  },
  _build: function(criteria, callback) {
    var attributes, data, item, object, result, store, _i, _len;
    store = this.store;
    attributes = criteria.build();
    data = criteria.data;
    result = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      item = data[_i];
      if (item instanceof Tower.Model) {
        _.extend(item.attributes, attributes, item.attributes);
      } else {
        object = store.serializeModel(_.extend({}, attributes, item));
      }
      result.push(object);
    }
    if (criteria.returnArray) {
      return result;
    } else {
      return result[0];
    }
  },
  _create: function(criteria, callback) {
    var iterator, records, returnArray,
      _this = this;
    if (criteria.instantiate) {
      returnArray = criteria.returnArray;
      criteria.returnArray = true;
      records = this.build(criteria);
      criteria.returnArray = returnArray;
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
          if (returnArray) {
            return callback(error, records);
          } else {
            return callback(error, records[0]);
          }
        }
      });
    } else {
      return this.store.create(criteria, callback);
    }
  },
  _update: function(criteria, callback) {
    var iterator;
    if (criteria.instantiate) {
      iterator = function(record, next) {
        return record.updateAttributes(criteria.data, next);
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
