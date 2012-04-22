
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
        _.extend(item.attributes, attributes, item.attributes);
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
  create: function(callback) {
    return this._create(callback);
  },
  _create: function(callback) {
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
          }
          if (!returnArray) {
            records = records[0];
          }
          return callback(error, records);
        }
      });
    } else {
      this.store.create(this, callback);
    }
    return records;
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
      return this._each(this, iterator, callback);
    } else {
      return this.store.update(updates, this, callback);
    }
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
      return this._each(this, iterator, callback);
    } else {
      return this.store.destroy(this, callback);
    }
  },
  add: function(callback) {},
  remove: function(callback) {}
};

module.exports = Tower.Model.Cursor.Persistence;
