
Tower.Store.Memory.Finders = {
  find: function(query, options, callback) {
    var key, limit, record, records, result, self, sort;
    result = [];
    records = this.records;
    self = this;
    if (Tower.Support.Object.isPresent(query)) {
      sort = options.sort;
      limit = options.limit || Tower.Store.defaultLimit;
      for (key in records) {
        record = records[key];
        if (this.matches(record, query)) result.push(record);
      }
      if (sort) result = this.sort(result, sort);
      if (limit) result = result.slice(0, (limit - 1) + 1 || 9e9);
    } else {
      for (key in records) {
        record = records[key];
        result.push(record);
      }
    }
    if (callback) callback.call(self, null, result);
    return result;
  },
  first: function(query, options, callback) {
    var record;
    record = null;
    this.find(query, options, function(error, records) {
      record = records[0];
      if (callback) return callback.call(this, error, record);
    });
    return record;
  },
  last: function(query, options, callback) {
    var record;
    record = null;
    this.find(query, options, function(error, records) {
      record = records[records.length - 1];
      if (callback) return callback.call(this, error, record);
    });
    return record;
  },
  count: function(query, options, callback) {
    var result;
    result = 0;
    this.find(query, options, function(error, records) {
      result = records.length;
      if (callback) return callback.call(this, error, result);
    });
    return result;
  },
  sort: function() {
    var _ref;
    return (_ref = Tower.Support.Array).sortBy.apply(_ref, arguments);
  }
};

module.exports = Tower.Store.Memory.Finders;
