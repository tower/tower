
Tower.Store.Memory.Persistence = {
  load: function(records) {
    var record, _i, _len;
    records = Tower.Support.Object.toArray(records);
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      record = this._buildOne(record);
      this.records[record.get("id")] = record;
    }
    return records;
  },
  _create: function(attributes, options, callback) {
    var object, result, _i, _len;
    result = null;
    if (Tower.Support.Object.isArray(attributes)) {
      result = [];
      for (_i = 0, _len = attributes.length; _i < _len; _i++) {
        object = attributes[_i];
        result.push(this._createOne(object, options));
      }
      result;
    } else {
      result = this._createOne(attributes, options);
    }
    if (callback) callback.call(this, null, result);
    return result;
  },
  _createOne: function(attributes, options) {
    var _ref;
    if ((_ref = attributes.id) == null) attributes.id = this.generateId();
    return attributes;
  },
  _build: function(attributes, options, callback) {
    var object, result, _i, _len;
    result = null;
    if (Tower.Support.Object.isArray(attributes)) {
      result = [];
      for (_i = 0, _len = attributes.length; _i < _len; _i++) {
        object = attributes[_i];
        result.push(this._buildOne(object, options));
      }
      result;
    } else {
      result = this._buildOne(attributes, options);
    }
    if (callback) callback.call(this, null, result);
    return result;
  },
  _buildOne: function(attributes, options) {
    return this.serializeModel(attributes);
  },
  _update: function(updates, query, options, callback) {
    var _this = this;
    return this.find(query, options, function(error, records) {
      var i, record, _len;
      if (error) return callback(error);
      for (i = 0, _len = records.length; i < _len; i++) {
        record = records[i];
        _this._updateOne(record, updates);
      }
      if (callback) callback.call(_this, error, records);
      return records;
    });
  },
  _updateOne: function(record, updates) {
    var key, value, _results;
    _results = [];
    for (key in updates) {
      value = updates[key];
      _results.push(this._updateAttribute(record.attributes, key, value));
    }
    return _results;
  },
  _destroy: function(query, options, callback) {
    var _records;
    _records = this.records;
    if (Tower.Support.Object.isBlank(query)) {
      return this._clear(callback);
    } else {
      return this.find(query, options, function(error, records) {
        var record, _i, _len;
        if (error) return callback(error);
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          delete _records[record.id];
        }
        if (callback) callback.call(this, error, records);
        return records;
      });
    }
  },
  _clear: function(callback) {
    this.records = {};
    if (callback) callback.call(this, null);
    return null;
  }
};

module.exports = Tower.Store.Memory.Persistence;
