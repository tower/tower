var __slice = [].slice;

Tower.Store.Memory.Finders = {
  find: function(criteria, callback) {
    var conditions, endIndex, key, limit, options, record, records, result, sort, startIndex;
    result = [];
    records = this.records;
    conditions = criteria.conditions();
    options = criteria;
    if (_.isPresent(conditions)) {
      for (key in records) {
        record = records[key];
        if (Tower.Store.Operators.test(record, conditions)) {
          result.push(record);
        }
      }
    } else {
      for (key in records) {
        record = records[key];
        result.push(record);
      }
    }
    sort = options.get('order');
    limit = options.get('limit');
    startIndex = options.get('offset') || 0;
    if (sort.length) {
      result = this.sort(result, sort);
    }
    endIndex = startIndex + (limit || result.length) - 1;
    result = result.slice(startIndex, endIndex + 1 || 9e9);
    if (callback) {
      result = callback.call(this, null, result);
    }
    return result;
  },
  findOne: function(criteria, callback) {
    var record,
      _this = this;
    record = void 0;
    criteria.limit(1);
    this.find(criteria, function(error, records) {
      record = records[0] || null;
      if (callback) {
        return callback.call(_this, error, record);
      }
    });
    return record;
  },
  count: function(criteria, callback) {
    var result,
      _this = this;
    result = void 0;
    this.find(criteria, function(error, records) {
      result = records.length;
      if (callback) {
        return callback.call(_this, error, result);
      }
    });
    return result;
  },
  exists: function(criteria, callback) {
    var result,
      _this = this;
    result = void 0;
    this.count(criteria, function(error, record) {
      result = !!record;
      if (callback) {
        return callback.call(_this, error, result);
      }
    });
    return result;
  },
  sort: function(records, sortings) {
    return _.sortBy.apply(_, [records].concat(__slice.call(sortings)));
  }
};

module.exports = Tower.Store.Memory.Finders;
