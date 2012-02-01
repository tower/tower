var __slice = Array.prototype.slice;

Tower.Store.Memory.Finders = {
  find: function(conditions, options, callback) {
    var key, limit, record, records, result, sort;
    result = [];
    records = this.records;
    if (Tower.Support.Object.isPresent(conditions)) {
      sort = options.sort;
      limit = options.limit || Tower.Store.defaultLimit;
      for (key in records) {
        record = records[key];
        if (this.matches(record, conditions)) result.push(record);
      }
      if (sort) result = this.sort(result, sort);
      if (limit) result = result.slice(0, (limit - 1) + 1 || 9e9);
    } else {
      for (key in records) {
        record = records[key];
        result.push(record);
      }
    }
    if (callback) callback.call(this, null, result);
    return result;
  },
  findOne: function(conditions, options, callback) {
    var record;
    record = null;
    options.limit = 1;
    this.find(conditions, options, function(error, records) {
      record = records[0];
      if (callback) return callback.call(this, error, record);
    });
    return record;
  },
  count: function(conditions, options, callback) {
    var result;
    result = 0;
    this.find(conditions, options, function(error, records) {
      result = records.length;
      if (callback) return callback.call(this, error, result);
    });
    return result;
  },
  exists: function(conditions, options, callback) {
    var result;
    var _this = this;
    result = false;
    this.count(conditions, options, function(error, record) {
      result = !!record;
      if (callback) return callback.call(_this, error, result);
    });
    return result;
  },
  sort: function(records, sortings) {
    var _ref;
    return (_ref = Tower.Support.Array).sortBy.apply(_ref, [records].concat(__slice.call(sortings)));
  }
};

module.exports = Tower.Store.Memory.Finders;
