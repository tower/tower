
Tower.Store.Memory.Persistence = {
  load: function(data) {
    var record, records, _i, _len;
    records = Tower.Support.Object.toArray(data);
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      this.loadOne(this.serializeModel(record));
    }
    return records;
  },
  loadOne: function(record) {
    return this.records[record.get("id")] = record;
  },
  create: function(data, options, callback) {
    var attributes, result, _i, _len;
    result = null;
    if (Tower.Support.Object.isArray(data)) {
      result = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        attributes = data[_i];
        result.push(this.createOne(attributes));
      }
    } else {
      result = this.createOne(data);
    }
    if (callback) callback.call(this, null, result);
    return result;
  },
  createOne: function(record) {
    var attributes;
    attributes = this.deserializeModel(record);
    if (attributes.id == null) attributes.id = this.generateId();
    return this.loadOne(this.serializeModel(record));
  },
  update: function(updates, query, options, callback) {
    var _this = this;
    return this.find(query, options, function(error, records) {
      var record, _i, _len;
      if (error) return callback(error);
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        _this.updateOne(record, updates);
      }
      return records;
    });
  },
  updateOne: function(record, updates) {
    var key, value;
    for (key in updates) {
      value = updates[key];
      this._updateAttribute(record.attributes, key, value);
    }
    return record;
  },
  destroy: function(query, options, callback) {
    return this.find(query, options, function(error, records) {
      var record, _i, _len;
      if (error) return callback(error);
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        this.destroyOne(record);
      }
      if (callback) callback.call(this, error, records);
      return records;
    });
  },
  destroyOne: function(record) {
    return delete this.records[record.get("id")];
  }
};

module.exports = Tower.Store.Memory.Persistence;
