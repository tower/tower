
Tower.Model.Cursor.Persistence = {
  build: function(callback) {
    return this._build(callback);
  },
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
  insert: function(callback) {
    return this._insert(callback);
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
        Tower.cb(error, records);
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
          }
          if (!returnArray) {
            records = records[0];
          }
          return callback(error, records);
        }
      });
    } else {
      this.store.insert(this, callback);
    }
    return this;
  },
  update: function(callback) {
    return this._update(callback);
  },
  _update: function(callback) {
    var iterator, updates,
      _this = this;
    updates = this.data[0];
    if (this.instantiate) {
      iterator = function(record, next) {
        return record.updateAttributes(updates, next);
      };
      this._each(this, iterator, callback);
    } else {
      this.store.update(updates, this, callback);
    }
    return this;
  },
  destroy: function(callback) {
    return this._destroy(callback);
  },
  _destroy: function(callback) {
    var iterator;
    if (this.instantiate) {
      iterator = function(record, next) {
        return record.destroy(next);
      };
      this._each(this, iterator, callback);
    } else {
      this.store.destroy(this, callback);
    }
    return this;
  },
  add: function(callback) {},
  remove: function(callback) {}
};

module.exports = Tower.Model.Cursor.Persistence;
