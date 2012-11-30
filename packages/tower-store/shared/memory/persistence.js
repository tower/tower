var _;

_ = Tower._;

Tower.StoreMemoryPersistence = {
  load: function(data, action) {
    var record, records, _i, _len;
    records = this._load(data);
    if (action === 'update') {
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        record.reload();
      }
    }
    Tower.notifyConnections('load', records);
    return records;
  },
  _load: function(data) {
    var i, record, records, _i, _len;
    records = _.castArray(data);
    Ember.beginPropertyChanges();
    for (i = _i = 0, _len = records.length; _i < _len; i = ++_i) {
      record = records[i];
      records[i] = this.loadOne(this.serializeModel(record, true));
    }
    Ember.endPropertyChanges();
    return records;
  },
  loadOne: function(record) {
    var cid, originalRecord, records;
    records = this.records;
    cid = record.get('_cid');
    if (cid != null) {
      originalRecord = records.get(cid);
    }
    if (originalRecord) {
      originalRecord.set('data', record.get('data'));
      records.replaceKey(cid, record.get('id'));
      record = originalRecord;
    } else {
      records.set(record.get('id'), record);
    }
    record.set('isNew', false);
    return record;
  },
  unload: function(records) {
    records = this._unload(records);
    Tower.notifyConnections('unload', records);
    return records;
  },
  _unload: function(data) {
    var i, record, records, _i, _len;
    records = _.castArray(data);
    Ember.beginPropertyChanges();
    for (i = _i = 0, _len = records.length; _i < _len; i = ++_i) {
      record = records[i];
      records[i] = this.unloadOne(this.serializeModel(record));
    }
    Ember.endPropertyChanges();
    return records;
  },
  unloadOne: function(record) {
    var records;
    records = this.records;
    records.remove(record.get('id'));
    record.set('isNew', false);
    record.set('isDeleted', true);
    record.notifyRelations();
    return record;
  },
  insert: function(cursor, callback) {
    var object, result, _i, _len, _ref;
    result = [];
    _ref = cursor.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      object = _ref[_i];
      result.push(this.insertOne(object));
    }
    result = cursor["export"](result);
    if (callback) {
      callback.call(this, null, result);
    }
    return result;
  },
  insertOne: function(record) {
    var attributes;
    if (record.get('_id') == null) {
      if (Tower.isClient) {
        if (record.get('_cid') == null) {
          record.set('_cid', this.generateId());
        }
      } else {
        record.set('id', this.generateId());
      }
    }
    attributes = this.deserializeModel(record);
    return this.loadOne(this.serializeModel(record));
  },
  update: function(updates, cursor, callback) {
    var _this = this;
    return this.find(cursor, function(error, records) {
      if (error) {
        return _.error(error, callback);
      }
      if (callback) {
        callback.call(_this, error, records);
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
  destroy: function(cursor, callback) {
    return this.find(cursor, function(error, records) {
      var record, _i, _len;
      if (error) {
        return _.error(error, callback);
      }
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        this.destroyOne(record);
      }
      if (callback) {
        callback.call(this, error, records);
      }
      return records;
    });
  },
  destroyOne: function(record) {
    return this.records.remove(record.get('id'));
  }
};

module.exports = Tower.StoreMemoryPersistence;
