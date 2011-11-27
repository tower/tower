
  Metro.Store = {
    defaultLimit: 100,
    reservedOperators: {
      "_sort": "_sort",
      "_limit": "_limit"
    },
    queryOperators: {
      ">=": "gte",
      "gte": "gte",
      ">": "gt",
      "gt": "gt",
      "<=": "lte",
      "lte": "lte",
      "<": "lt",
      "lt": "lt",
      "in": "in",
      "nin": "nin",
      "any": "any",
      "all": "all",
      "=~": "m",
      "m": "m",
      "!~": "nm",
      "nm": "nm",
      "=": "eq",
      "eq": "eq",
      "!=": "neq",
      "neq": "neq",
      "null": "null",
      "notNull": "notNull"
    }
  };

  Metro.Store.Memory = (function() {

    function Memory() {
      this.records = {};
      this.lastId = 0;
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
      if (Metro.Support.Object.isPresent(query)) {
        sort = query._sort;
        limit = query._limit || Metro.Store.defaultLimit;
        for (key in records) {
          record = records[key];
          if (this.matches(record, query)) result.push(record);
        }
        if (sort) result = this.sort(result, query._sort);
        if (limit) result = result.slice(0, (limit - 1) + 1 || 9e9);
      } else {
        for (key in records) {
          record = records[key];
          result.push(record);
        }
      }
      if (callback) callback(result);
      return result;
    };

    Memory.alias("select", "find");

    Memory.prototype.first = function(query, callback) {
      var result;
      result = this.find(query, function(records) {
        if (callback) return callback(records[0]);
      });
      return result[0];
    };

    Memory.prototype.last = function(query, callback) {
      var result;
      result = this.find(query, function(records) {
        if (callback) return callback(records[records.length - 1]);
      });
      return result[result.length - 1];
    };

    Memory.prototype.all = function(query, callback) {
      return this.find(query, callback);
    };

    Memory.prototype.length = function(query, callback) {
      return this.find(query, function(records) {
        if (callback) return callback(records.length);
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
        if (callback) return callback(records);
      });
    };

    Memory.prototype.clear = function() {
      return this.records = [];
    };

    Memory.prototype.toArray = function() {
      return this.records;
    };

    Memory.prototype.create = function(record) {
      var _ref;
      if (!record.id) {
        Metro.raise("errors.store.missingAttribute", "id", "Store#create", record);
      }
      if ((_ref = record.id) == null) record.id = this.generateId();
      return this.records[record.id] = record;
    };

    Memory.prototype.update = function(record) {
      if (!record.id) {
        Metro.raise("errors.store.missingAttribute", "id", "Store#update", record);
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
      var key, recordValue, self, success, value;
      self = this;
      success = true;
      for (key in query) {
        value = query[key];
        if (!!Metro.Store.reservedOperators[key]) continue;
        recordValue = record[key];
        if (typeof value === 'object') {
          success = self._matchesOperators(record, recordValue, value);
        } else {
          if (typeof value === "function") value = value.call(record);
          success = recordValue === value;
        }
        if (!success) return false;
      }
      return true;
    };

    Memory.prototype.generateId = function() {
      return this.lastId++;
    };

    Memory.prototype._matchesOperators = function(record, recordValue, operators) {
      var key, operator, self, success, value;
      success = true;
      self = this;
      for (key in operators) {
        value = operators[key];
        if (operator = Metro.Store.queryOperators[key]) {
          if (typeof value === "function") value = value.call(record);
          switch (operator) {
            case "gt":
              success = self._isGreaterThan(recordValue, value);
              break;
            case "gte":
              success = self._isGreaterThanOrEqualTo(recordValue, value);
              break;
            case "lt":
              success = self._isLessThan(recordValue, value);
              break;
            case "lte":
              success = self._isLessThanOrEqualTo(recordValue, value);
              break;
            case "eq":
              success = self._isEqualTo(recordValue, value);
              break;
            case "neq":
              success = self._isNotEqualTo(recordValue, value);
              break;
            case "m":
              success = self._isMatchOf(recordValue, value);
              break;
            case "nm":
              success = self._isNotMatchOf(recordValue, value);
              break;
            case "any":
              success = self._anyIn(recordValue, value);
              break;
            case "all":
              success = self._allIn(recordValue, value);
          }
          if (!success) return false;
        } else {
          return recordValue === operators;
        }
      }
      return true;
    };

    Memory.prototype._isGreaterThan = function(recordValue, value) {
      return recordValue && recordValue > value;
    };

    Memory.prototype._isGreaterThanOrEqualTo = function(recordValue, value) {
      return recordValue && recordValue >= value;
    };

    Memory.prototype._isLessThan = function(recordValue, value) {
      return recordValue && recordValue < value;
    };

    Memory.prototype._isLessThanOrEqualTo = function(recordValue, value) {
      return recordValue && recordValue <= value;
    };

    Memory.prototype._isEqualTo = function(recordValue, value) {
      return recordValue === value;
    };

    Memory.prototype._isNotEqualTo = function(recordValue, value) {
      return recordValue !== value;
    };

    Memory.prototype._isMatchOf = function(recordValue, value) {
      return !!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
    };

    Memory.prototype._isNotMatchOf = function(recordValue, value) {
      return !!!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
    };

    Memory.prototype._anyIn = function(recordValue, array) {
      var value, _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) > -1) return true;
      }
      return false;
    };

    Memory.prototype._allIn = function(recordValue, value) {
      var _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) === -1) return false;
      }
      return true;
    };

    Memory.prototype.toString = function() {
      return this.constructor.name;
    };

    return Memory;

  })();
