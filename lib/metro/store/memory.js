(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Store.Memory = (function() {

    __extends(Memory, Metro.Store);

    function Memory(options) {
      Memory.__super__.constructor.call(this, options);
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

    Memory.prototype.all = function(query, options, callback) {
      var key, limit, record, records, result, self, sort;
      result = [];
      records = this.records;
      self = this;
      if (Metro.Support.Object.isPresent(query)) {
        sort = options.sort;
        limit = options.limit || Metro.Store.defaultLimit;
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
    };

    Memory.prototype.first = function(query, options, callback) {
      var record;
      record = null;
      this.all(query, options, function(error, records) {
        record = records[0];
        if (callback) return callback.call(this, error, record);
      });
      return record;
    };

    Memory.prototype.last = function(query, options, callback) {
      var record;
      record = null;
      this.all(query, options, function(error, records) {
        record = records[records.length - 1];
        if (callback) return callback.call(this, error, record);
      });
      return record;
    };

    Memory.prototype.count = function(query, options, callback) {
      var result;
      result = 0;
      this.all(query, function(error, records) {
        result = records.length;
        if (callback) return callback.call(this, error, result);
      });
      return result;
    };

    Memory.prototype.deleteAll = function(query, options, callback) {
      var _records;
      _records = this.records;
      return this.all(query, function(error, records) {
        var record, _i, _len;
        if (!error) {
          for (_i = 0, _len = records.length; _i < _len; _i++) {
            record = records[_i];
            _records.splice(_records.indexOf(record), 1);
          }
        }
        if (callback) return callback.call(this, error, records);
      });
    };

    Memory.prototype.clear = function() {
      return this.records = [];
    };

    Memory.prototype.create = function(attributes, options, callback) {
      var record, _ref;
      if ((_ref = attributes.id) == null) attributes.id = this.generateId();
      record = this.serializeAttributes(attributes);
      this.records[attributes.id] = record;
      if (callback) callback.call(this, null, record);
      return record;
    };

    Memory.prototype.update = function(updates, query, attributes, callback) {
      var self;
      self = this;
      return this.all(query, function(error, records) {
        var i, key, record, value, _len;
        if (!error) {
          for (i = 0, _len = records.length; i < _len; i++) {
            record = records[i];
            for (key in attributes) {
              value = attributes[key];
              self._updateAttribute(record.attributes, key, value);
            }
          }
        }
        if (callback) return callback.call(this, error, records);
      });
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
        if (typeof value === "object") {
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

    Memory.prototype._updateAttribute = function(attributes, key, value) {
      if (this._atomicModifier(key)) {
        return this["_" + (key.replace("$", "")) + "AtomicUpdate"](attributes, value);
      } else {
        return attributes[key] = value;
      }
    };

    Memory.prototype._atomicModifier = function(key) {
      return !!this.constructor.atomicModifiers[key];
    };

    Memory.prototype._pushAtomicUpdate = function(attributes, value) {
      var _key, _value;
      for (_key in value) {
        _value = value[_key];
        attributes[_key] || (attributes[_key] = []);
        attributes[_key].push(_value);
      }
      return attributes;
    };

    Memory.prototype._pullAtomicUpdate = function(attributes, value) {
      var item, _attributeValue, _i, _key, _len, _value;
      for (_key in value) {
        _value = value[_key];
        _attributeValue = attributes[_key];
        if (_attributeValue) {
          for (_i = 0, _len = _value.length; _i < _len; _i++) {
            item = _value[_i];
            _attributeValue.splice(_attributeValue.indexOf(item), 1);
          }
        }
      }
      return attributes;
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
            case "$m":
              success = self._isMatchOf(recordValue, value);
              break;
            case "$nm":
              success = self._isNotMatchOf(recordValue, value);
              break;
            case "$any":
              success = self._anyIn(recordValue, value);
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

    return Memory;

  })();

  module.exports = Metro.Store.Memory;

}).call(this);
