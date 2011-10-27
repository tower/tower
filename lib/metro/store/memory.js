(function() {
  var Memory;
  Memory = (function() {
    function Memory() {
      this.records = {};
      this.index = {
        id: {}
      };
    }
    Memory.prototype.addIndex = function() {
      var attributes;
      attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
      this.index[attributes] = key;
      return this;
    };
    Memory.prototype.removeIndex = function() {
      var attributes;
      attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
      delete this.index[attributes];
      return this;
    };
    Memory.prototype.find = function(query, callback) {
      var key, limit, record, records, result, sort;
      result = [];
      records = this.records;
      if (query) {
        sort = query._sort;
        limit = query._limit || Metro.Store.defaultLimit;
        for (key in records) {
          record = records[key];
          if (this.matches(record, query)) {
            result.push(record);
          }
        }
        if (sort) {
          result = this.sort(result, query._sort);
        }
        if (limit) {
          result = result.slice(0, (limit - 1 + 1) || 9e9);
        }
      } else {
        for (key in records) {
          record = records[key];
          result.push(record);
        }
      }
      if (callback) {
        callback(result);
      }
      return result;
    };
    Memory.alias("select", "find");
    Memory.prototype.first = function(query, callback) {
      var result;
      result = this.find(query, function(records) {
        if (callback) {
          return callback(records[0]);
        }
      });
      return result[0];
    };
    Memory.prototype.last = function(query, callback) {
      var result;
      result = this.find(query, function(records) {
        if (callback) {
          return callback(records[records.length - 1]);
        }
      });
      return result[result.length - 1];
    };
    Memory.prototype.all = function(query, callback) {
      return this.find(query, callback);
    };
    Memory.prototype.length = function(query, callback) {
      return this.find(query, function(records) {
        if (callback) {
          return callback(records.length);
        }
      }).length;
    };
    Memory.alias("count", "length");
    Memory.prototype.remove = function(query, callback) {
      var _records;
      _records = this.records;
      return this.select(query, function(records) {
        var record, _i, _len;
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          _records.splice(_records.indexOf(record), 1);
        }
        if (callback) {
          return callback(records);
        }
      });
    };
    Memory.prototype.clear = function() {
      return this.records = [];
    };
    Memory.prototype.toArray = function() {
      return this.records;
    };
    Memory.prototype.create = function(record) {
      if (!record.id) {
        Metro.raise("errors.store.missing_attribute", "id", "Store#create", record);
      }
      return this.records[record.id] = record;
    };
    Memory.prototype.update = function(record) {
      if (!record.id) {
        Metro.raise("errors.store.missing_attribute", "id", "Store#update", record);
      }
      return this.records[record.id] = record;
    };
    Memory.prototype.destroy = function(record) {
      return this.find(id).destroy();
    };
    Memory.prototype.sort = function() {
      var _ref;
      return (_ref = Metro.Support.Array).sortBy.apply(_ref, arguments);
    };
    Memory.prototype.matches = function(record, query) {
      var key, self, success, value;
      self = this;
      success = true;
      for (key in query) {
        value = query[key];
        if (!!Metro.Store.reservedOperators[key]) {
          continue;
        }
        if (typeof value === 'object') {
          success = self._matchesOperators(record[key], value);
        } else {
          success = record[key] === value;
        }
        if (!success) {
          return false;
        }
      }
      return true;
    };
    Memory.prototype._matchesOperators = function(record_value, operators) {
      var key, operator, self, success, value;
      success = true;
      self = this;
      for (key in operators) {
        value = operators[key];
        if (operator = Metro.Store.queryOperators[key]) {
          switch (operator) {
            case "gt":
              success = self._isGreaterThan(record_value, value);
              break;
            case "gte":
              success = self._isGreaterThanOrEqualTo(record_value, value);
              break;
            case "lt":
              success = self._isLessThan(record_value, value);
              break;
            case "lte":
              success = self._isLessThanOrEqualTo(record_value, value);
              break;
            case "eq":
              success = self._isEqualTo(record_value, value);
              break;
            case "neq":
              success = self._isNotEqualTo(record_value, value);
              break;
            case "m":
              success = self._isMatchOf(record_value, value);
              break;
            case "nm":
              success = self._isNotMatchOf(record_value, value);
              break;
            case "any":
              success = self._anyIn(record_value, value);
              break;
            case "all":
              success = self._allIn(record_value, value);
          }
          if (!success) {
            return false;
          }
        } else {
          return record_value === operators;
        }
      }
      return true;
    };
    Memory.prototype._isGreaterThan = function(record_value, value) {
      return record_value > value;
    };
    Memory.prototype._isGreaterThanOrEqualTo = function(record_value, value) {
      return record_value >= value;
    };
    Memory.prototype._isLessThan = function(record_value, value) {
      return record_value < value;
    };
    Memory.prototype._isLessThanOrEqualTo = function(record_value, value) {
      return record_value <= value;
    };
    Memory.prototype._isEqualTo = function(record_value, value) {
      return record_value === value;
    };
    Memory.prototype._isNotEqualTo = function(record_value, value) {
      return record_value !== value;
    };
    Memory.prototype._isMatchOf = function(record_value, value) {
      return !!(typeof record_value === "string" ? record_value.match(value) : record_value.exec(value));
    };
    Memory.prototype._isNotMatchOf = function(record_value, value) {
      return !!!(typeof record_value === "string" ? record_value.match(value) : record_value.exec(value));
    };
    Memory.prototype._anyIn = function(record_value, array) {
      var value, _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (record_value.indexOf(value) > -1) {
          return true;
        }
      }
      return false;
    };
    Memory.prototype._allIn = function(record_value, value) {
      var _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (record_value.indexOf(value) === -1) {
          return false;
        }
      }
      return true;
    };
    return Memory;
  })();
  module.exports = Memory;
}).call(this);
