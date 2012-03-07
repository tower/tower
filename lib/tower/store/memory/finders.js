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
    var _this = this;
    record = null;
    options.limit = 1;
    this.find(conditions, options, function(error, records) {
      record = records[0] || null;
      if (callback) return callback.call(_this, error, record);
    });
    return record;
  },
  count: function(conditions, options, callback) {
    var result;
    var _this = this;
    result = 0;
    this.find(conditions, options, function(error, records) {
      result = records.length;
      if (callback) return callback.call(_this, error, result);
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
  },
  matches: function(record, query) {
    var key, recordValue, schema, self, success, value;
    self = this;
    success = true;
    schema = this.schema();
    for (key in query) {
      value = query[key];
      recordValue = record.get(key);
      if (Tower.Support.Object.isRegExp(value)) {
        success = recordValue.match(value);
      } else if (typeof value === "object") {
        success = self._matchesOperators(record, recordValue, value);
      } else {
        if (typeof value === "function") value = value.call(record);
        success = recordValue === value;
      }
      if (!success) return false;
    }
    return true;
  },
  _matchesOperators: function(record, recordValue, operators) {
    var key, operator, self, success, value;
    success = true;
    self = this;
    for (key in operators) {
      value = operators[key];
      if (operator = Tower.Store.queryOperators[key]) {
        if (_.isFunction(value)) value = value.call(record);
        switch (operator) {
          case "$in":
          case "$any":
            success = self._anyIn(recordValue, value);
            break;
          case "$nin":
            success = self._notIn(recordValue, value);
            break;
          case "$gt":
            success = self._isGreaterThan(recordValue, value);
            break;
          case "$gte":
            success = self._isGreaterThanOrEqualTo(recordValue, value);
            break;
          case "$lt":
            success = self._isLessThan(recordValue, value);
            break;
          case "$lte":
            success = self._isLessThanOrEqualTo(recordValue, value);
            break;
          case "$eq":
            success = self._isEqualTo(recordValue, value);
            break;
          case "$neq":
            success = self._isNotEqualTo(recordValue, value);
            break;
          case "$regex":
          case "$match":
            success = self._isMatchOf(recordValue, value);
            break;
          case "$notMatch":
            success = self._isNotMatchOf(recordValue, value);
            break;
          case "$all":
            success = self._allIn(recordValue, value);
        }
        if (!success) return false;
      } else {
        return recordValue === operators;
      }
    }
    return true;
  },
  _isGreaterThan: function(recordValue, value) {
    return recordValue && recordValue > value;
  },
  _isGreaterThanOrEqualTo: function(recordValue, value) {
    return recordValue && recordValue >= value;
  },
  _isLessThan: function(recordValue, value) {
    return recordValue && recordValue < value;
  },
  _isLessThanOrEqualTo: function(recordValue, value) {
    return recordValue && recordValue <= value;
  },
  _isEqualTo: function(recordValue, value) {
    return recordValue === value;
  },
  _isNotEqualTo: function(recordValue, value) {
    return recordValue !== value;
  },
  _isMatchOf: function(recordValue, value) {
    return !!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
  },
  _isNotMatchOf: function(recordValue, value) {
    return !!!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
  },
  _anyIn: function(recordValue, array) {
    var value, _i, _j, _len, _len2;
    if (_.isArray(recordValue)) {
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) > -1) return true;
      }
    } else {
      for (_j = 0, _len2 = array.length; _j < _len2; _j++) {
        value = array[_j];
        if (recordValue === value) return true;
      }
    }
    return false;
  },
  _notIn: function(recordValue, array) {
    var value, _i, _j, _len, _len2;
    if (_.isArray(recordValue)) {
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) > -1) return false;
      }
    } else {
      for (_j = 0, _len2 = array.length; _j < _len2; _j++) {
        value = array[_j];
        if (recordValue === value) return false;
      }
    }
    return true;
  },
  _allIn: function(recordValue, array) {
    var value, _i, _j, _len, _len2;
    if (_.isArray(recordValue)) {
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) === -1) return false;
      }
    } else {
      for (_j = 0, _len2 = array.length; _j < _len2; _j++) {
        value = array[_j];
        if (recordValue !== value) return false;
      }
    }
    return true;
  }
};

module.exports = Tower.Store.Memory.Finders;
