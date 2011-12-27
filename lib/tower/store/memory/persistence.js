
Tower.Store.Memory.Persistence = {
  create: function(attributes, options, callback) {
    var record, _ref;
    if ((_ref = attributes.id) == null) attributes.id = this.generateId();
    record = this.serializeModel(attributes);
    this.records[attributes.id] = record;
    if (callback) callback.call(this, null, record);
    return record;
  },
  updateAll: function(updates, query, options, callback) {
    var self;
    self = this;
    return this.all(query, options, function(error, records) {
      var i, key, record, value, _len;
      if (!error) {
        for (i = 0, _len = records.length; i < _len; i++) {
          record = records[i];
          for (key in updates) {
            value = updates[key];
            self._updateAttribute(record.attributes, key, value);
          }
        }
      }
      if (callback) return callback.call(this, error, records);
    });
  },
  deleteAll: function(query, options, callback) {
    var _records;
    _records = this.records;
    if (Tower.Support.Object.isBlank(query)) {
      return this.clear(callback);
    } else {
      return this.all(query, function(error, records) {
        var record, _i, _len;
        if (!error) {
          for (_i = 0, _len = records.length; _i < _len; _i++) {
            record = records[_i];
            _records.splice(_records.indexOf(record), 1);
          }
        }
        if (callback) return callback.call(this, error, records);
      });
    }
  },
  clear: function(callback) {
    this.records = {};
    if (callback) callback.call(this, error, records);
    return this.records;
  }
};

module.exports = Tower.Store.Memory.Persistence;
