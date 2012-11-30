var _;

_ = Tower._;

Tower.ModelCursorPersistence = Ember.Mixin.create({
  build: function(callback) {
    return this._build(callback);
  },
  insert: function(callback) {
    return this._insert(callback);
  },
  update: function(callback) {
    return this._update(callback);
  },
  destroy: function(callback) {
    return this._destroy(callback);
  },
  findOrCreate: function(callback) {},
  add: function(callback) {},
  remove: function(callback) {},
  _build: function(callback) {
    var attributes, data, item, result, store, _i, _len;
    store = this.store;
    attributes = this.attributes();
    data = this.data || (this.data = []);
    if (!data.length) {
      data.push({});
    }
    result = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      item = data[_i];
      if (item instanceof Tower.Model) {
        item.setProperties(attributes);
      } else {
        item = store.serializeModel(_.extend({}, attributes, item));
      }
      result.push(item);
    }
    result = this.returnArray ? result : result[0];
    if (callback) {
      callback.call(this, null, result);
    }
    return result;
  },
  _insert: function(callback) {
    var iterator, records, returnArray,
      _this = this;
    records = void 0;
    if (this.instantiate) {
      returnArray = this.returnArray;
      this.returnArray = true;
      records = this.build();
      this.returnArray = returnArray;
      iterator = function(record, next) {
        if (record) {
          return record.save(next);
        } else {
          return next();
        }
      };
      Tower.async(records, iterator, function(error) {
        if (!callback) {
          if (error) {
            throw error;
          }
          if (!returnArray) {
            return records = records[0];
          }
        } else {
          if (error) {
            return callback(error);
          } else {
            if (!returnArray) {
              records = records[0];
            }
            return callback(error, records);
          }
        }
      });
    } else {
      this.store.insert(this, function(error, result) {
        records = result;
        if (!error) {
          Tower.notifyConnections('create', records);
        }
        if (callback) {
          return callback.call(_this, error, records);
        }
      });
    }
    if (Tower.isClient) {
      return records;
    } else {
      return this;
    }
  },
  _update: function(callback) {
    var iterator, records, updates,
      _this = this;
    updates = this.data[0];
    records = void 0;
    if (this.instantiate) {
      this.returnArray = true;
      iterator = function(record, next) {
        return record.updateAttributes(updates, next);
      };
      this._each(this, iterator, function(error, result) {
        records = result;
        if (callback) {
          callback.call(_this, error, records);
        }
        return records;
      });
    } else {
      this.store.update(updates, this, function(error, result) {
        records = _this.data[0];
        if (!error) {
          Tower.notifyConnections('update', _this.data);
        }
        if (callback) {
          return callback.call(_this, error, records);
        }
      });
    }
    return records;
  },
  _destroy: function(callback) {
    var iterator, records,
      _this = this;
    records = void 0;
    if (this.instantiate) {
      this.returnArray = true;
      iterator = function(record, next) {
        Tower.notifyConnections('destroy', [record]);
        return record.destroy(next);
      };
      this._each(this, iterator, function(error, result) {
        records = result;
        if (callback) {
          callback.call(_this, error, records);
        }
        return records;
      });
    } else {
      this.model.where({
        id: {
          $in: this.ids
        }
      }).select('id').all(function(error, recordsWithOnlyIds) {
        return _this.store.destroy(_this, function(error, records) {
          if (!error) {
            Tower.notifyConnections('destroy', recordsWithOnlyIds);
          }
          if (callback) {
            return callback.call(_this, error, records);
          }
        });
      });
    }
    return this;
  }
});

module.exports = Tower.ModelCursorPersistence;
