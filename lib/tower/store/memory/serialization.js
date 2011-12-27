
Tower.Store.Memory.Serialization = {
  matches: function(record, query) {
    var key, recordValue, schema, self, success, value;
    self = this;
    success = true;
    schema = this.schema();
    for (key in query) {
      value = query[key];
      if (!!Tower.Store.reservedOperators[key]) continue;
      recordValue = record[key];
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
  generateId: function() {
    return this.lastId++;
  },
  _updateAttribute: function(attributes, key, value) {
    var field;
    field = this.schema()[key];
    if (field && field.type === "Array" && !Tower.Support.Object.isArray(value)) {
      attributes[key] || (attributes[key] = []);
      return attributes[key].push(value);
    } else if (this._atomicModifier(key)) {
      return this["_" + (key.replace("$", "")) + "AtomicUpdate"](attributes, value);
    } else {
      return attributes[key] = value;
    }
  },
  _atomicModifier: function(key) {
    return !!this.constructor.atomicModifiers[key];
  },
  _pushAtomicUpdate: function(attributes, value) {
    var _key, _value;
    for (_key in value) {
      _value = value[_key];
      attributes[_key] || (attributes[_key] = []);
      attributes[_key].push(_value);
    }
    return attributes;
  },
  _pullAtomicUpdate: function(attributes, value) {
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
  },
  _matchesOperators: function(record, recordValue, operators) {
    var key, operator, self, success, value;
    success = true;
    self = this;
    for (key in operators) {
      value = operators[key];
      if (operator = Tower.Store.queryOperators[key]) {
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
          case "$regex":
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
    var value, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      value = array[_i];
      if (recordValue.indexOf(value) > -1) return true;
    }
    return false;
  },
  _allIn: function(recordValue, value) {
    var _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      value = array[_i];
      if (recordValue.indexOf(value) === -1) return false;
    }
    return true;
  }
};

module.exports = Tower.Store.Memory.Serialization;
