(function() {

  Tower.Store.Memory.Persistence = {
    load: function(data) {
      var record, records, _i, _len;
      records = _.castArray(data);
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        this.loadOne(this.serializeModel(record));
      }
      return records;
    },
    loadOne: function(record) {
      record.persistent = true;
      return this.records[record.get("id").toString()] = record;
    },
    create: function(criteria, callback) {
      var object, result, _i, _len, _ref;
      result = [];
      _ref = criteria.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        result.push(this.createOne(object));
      }
      result = criteria["export"](result);
      if (callback) callback.call(this, null, result);
      return result;
    },
    createOne: function(record) {
      var attributes;
      attributes = this.deserializeModel(record);
      if (attributes.id == null) attributes.id = this.generateId();
      attributes.id = attributes.id.toString();
      return this.loadOne(this.serializeModel(record));
    },
    update: function(updates, criteria, callback) {
      var _this = this;
      return this.find(criteria, function(error, records) {
        var record, _i, _len;
        if (error) return _.error(error, callback);
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          _this.updateOne(record, updates);
        }
        if (callback) callback.call(_this, error, records);
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
    destroy: function(criteria, callback) {
      return this.find(criteria, function(error, records) {
        var record, _i, _len;
        if (error) return _.error(error, callback);
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          this.destroyOne(record);
        }
        if (callback) callback.call(this, error, records);
        return records;
      });
    },
    destroyOne: function(record) {
      return delete this.records[record.get("id").toString()];
    }
  };

  module.exports = Tower.Store.Memory.Persistence;

}).call(this);
