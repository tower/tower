
Tower.Store.Memory.Persistence = {
  load: function(records) {
    var record, _i, _len;
    records = Tower.Support.Object.toArray(records);
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      record = this.serializeModel(record);
      this._setRecord(record);
    }
    return records;
  },
  create: function(attributes, options, callback) {
    var object, result, _i, _len, _ref, _ref2;
    result = null;
    if (Tower.Support.Object.isArray(attributes)) {
      result = [];
      for (_i = 0, _len = attributes.length; _i < _len; _i++) {
        object = attributes[_i];
        if ((_ref = object.id) == null) object.id = this.generateId();
        result.push(object);
      }
      result;
    } else {
      if ((_ref2 = attributes.id) == null) attributes.id = this.generateId();
      result = attributes;
    }
    if (callback) callback.call(this, null, result);
    return result;
  },
  update: function(updates, query, options, callback) {
    var _this = this;
    return this.find(query, options, function(error, records) {
      var i, key, record, value, _len;
      if (error) return callback(error);
      for (i = 0, _len = records.length; i < _len; i++) {
        record = records[i];
        for (key in updates) {
          value = updates[key];
          _this._updateAttribute(record.attributes, key, value);
        }
      }
      if (callback) callback.call(_this, error, records);
      return records;
    });
  },
  destroy: function(query, options, callback) {
    if (Tower.Support.Object.isBlank(query)) {
      return this.clear(callback);
    } else {
      return this.find(query, options, function(error, records) {
        var record, _i, _len;
        if (error) return callback(error);
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          this._removeRecord(record);
        }
        if (callback) callback.call(this, error, records);
        return records;
      });
    }
  },
  clear: function(callback) {
    this.records = {};
    if (callback) callback.call(this, null);
    return null;
  },
  _setRecord: function(record) {
    return this.records[record.get("id")] = record;
  },
  _getRecord: function(key) {},
  _removeRecord: function(record) {
    return delete this.records[record.id];
  }
};

module.exports = Tower.Store.Memory.Persistence;
