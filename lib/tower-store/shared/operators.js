var _;

_ = Tower._;

Tower.StoreOperators = {
  MAP: {
    '>=': '$gte',
    '$gte': '$gte',
    '>': '$gt',
    '$gt': '$gt',
    '<=': '$lte',
    '$lte': '$lte',
    '<': '$lt',
    '$lt': '$lt',
    '$in': '$anyIn',
    '$any': '$anyIn',
    '$anyIn': '$anyIn',
    '$nin': '$notInAll',
    '$notIn': '$notInAll',
    '$notInAny': '$notInAny',
    '$all': '$allIn',
    '=~': '$match',
    '$m': '$match',
    '$regex': '$match',
    '$match': '$match',
    '$notMatch': '$notMatch',
    '!~': '$notMatch',
    '$nm': '$nm',
    '==': '$eq',
    '=': '$eq',
    '$eq': '$eq',
    '!=': '$ne',
    '$neq': '$ne',
    '$ne': '$ne',
    '$null': '$null',
    '$notNull': '$notNull',
    '$exists': '$exists',
    '$size': '$size',
    '$elemMatch': '$matchIn',
    '$matchIn': '$matchIn',
    '$maxDistance': '$maxDistance'
  },
  select: function(records, conditions) {
    var _this = this;
    return _.select(records, function(record) {
      return _this.test(record, conditions);
    });
  },
  matching: function(records, conditions) {
    var _this = this;
    return _.select(records, function(record) {
      return _this.test(record, conditions);
    });
  },
  notMatching: function(records, conditions) {
    var _this = this;
    return _.select(records, function(record) {
      return !_this.test(record, conditions);
    });
  },
  test: function(record, conditions) {
    var key, success, value;
    success = true;
    for (key in conditions) {
      value = conditions[key];
      if (key === '$or') {
        success = this.or(record, value);
      } else if (key === '$nor') {
        success = this.nor(record, value);
      } else {
        success = this.testValue(this._getValue(record, key), value, record);
      }
      if (!success) {
        return false;
      }
    }
    return success;
  },
  testEach: function(records, conditions, callback) {
    var record, _i, _len;
    for (_i = 0, _len = records.length; _i < _len; _i++) {
      record = records[_i];
      callback.call(record, this.test(record, conditions), record);
    }
    return void 0;
  },
  testValue: function(recordValue, operators, record) {
    var key, operator, success, value;
    success = true;
    switch (_.kind(operators)) {
      case 'number':
      case 'string':
      case 'float':
      case 'NaN':
        success = recordValue === operators;
        break;
      case 'undefined':
      case 'null':
        success = recordValue === null || recordValue === void 0;
        break;
      case 'date':
        success = recordValue.getTime() === operators.getTime();
        break;
      case 'array':
        success = _.isEqual(recordValue, operators);
        break;
      case 'regex':
        success = this.match(recordValue, operators);
        break;
      default:
        if (_.isHash(operators)) {
          for (key in operators) {
            value = operators[key];
            if (operator = Tower.StoreOperators.MAP[key]) {
              success = this[operator.replace('$', '')](recordValue, value, record);
            } else {
              success = recordValue === operators;
            }
            if (!success) {
              return false;
            }
          }
        } else {
          success = _.isEqual(recordValue, operators);
        }
    }
    return success;
  },
  gt: function(recordValue, value) {
    return (value != null) && (recordValue != null) && recordValue > value;
  },
  gte: function(recordValue, value) {
    return (value != null) && (recordValue != null) && recordValue >= value;
  },
  lt: function(recordValue, value) {
    return (value != null) && (recordValue != null) && recordValue < value;
  },
  lte: function(recordValue, value) {
    return (value != null) && (recordValue != null) && recordValue <= value;
  },
  eq: function(recordValue, value) {
    return this._comparable(recordValue) === this._comparable(value);
  },
  ne: function(recordValue, value) {
    return this._comparable(recordValue) !== this._comparable(value);
  },
  match: function(recordValue, value) {
    return !!((recordValue != null) && (value != null) && (typeof recordValue === 'string' ? recordValue.match(value) : recordValue.exec(value)));
  },
  notMatch: function(recordValue, value) {
    return !this.match(recordValue, value);
  },
  anyIn: function(recordValue, array) {
    var value, _i, _j, _len, _len1;
    array = _.castArray(array);
    if (_.isArray(recordValue)) {
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (_.include(recordValue, value)) {
          return true;
        }
      }
    } else {
      for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
        value = array[_j];
        if (_.isEqual(recordValue, value)) {
          return true;
        }
      }
    }
    return false;
  },
  allIn: function(recordValue, array) {
    var value, _i, _j, _len, _len1;
    array = _.castArray(array);
    if (_.isArray(recordValue)) {
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (!_.include(recordValue, value)) {
          return false;
        }
      }
    } else {
      for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
        value = array[_j];
        if (!_.isEqual(recordValue, value)) {
          return false;
        }
      }
    }
    return true;
  },
  notInAny: function(recordValue, array) {
    var value, _i, _j, _len, _len1;
    array = _.castArray(array);
    if (_.isArray(recordValue)) {
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (_.include(recordValue, value)) {
          return true;
        }
      }
    } else {
      for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
        value = array[_j];
        if (_.isEqual(recordValue, value)) {
          return true;
        }
      }
    }
    return false;
  },
  notInAll: function(recordValue, array) {
    var value, _i, _j, _len, _len1;
    array = _.castArray(array);
    if (_.isArray(recordValue)) {
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (_.indexOf(recordValue, value) !== -1) {
          return false;
        }
      }
    } else {
      for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
        value = array[_j];
        if (recordValue === value) {
          return false;
        }
      }
    }
    return true;
  },
  matchIn: function(recordValue, value) {
    var item, _i, _len;
    if (!_.isArray(recordValue)) {
      return false;
    }
    for (_i = 0, _len = recordValue.length; _i < _len; _i++) {
      item = recordValue[_i];
      if (this.test(item, value)) {
        return true;
      }
    }
    return false;
  },
  maxDistance: function(recordValue, distance, record) {
    return (distance != null) && (record != null) && (record.__distance != null) && record.__distance <= distance;
  },
  exists: function(recordValue) {
    return recordValue !== void 0;
  },
  size: function(recordValue, value) {
    return _.isArray(recordValue) && recordValue.length === value;
  },
  or: function(record, array) {
    var conditions, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      conditions = array[_i];
      if (this.test(record, conditions)) {
        return true;
      }
    }
    return false;
  },
  nor: function(record, array) {
    var conditions, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      conditions = array[_i];
      if (this.test(record, conditions)) {
        return false;
      }
    }
    return true;
  },
  _comparable: function(value) {
    if (_.isDate(value)) {
      return value.getTime();
    } else if (_.isRegExp(value)) {
      return value.toString();
    } else {
      return value;
    }
  },
  _getValue: function(recordOrObject, key) {
    if (typeof recordOrObject.get === 'function') {
      return recordOrObject.get(key);
    } else {
      return _.getNestedAttribute(recordOrObject, key);
    }
  }
};

Tower.StoreOperators.notIn = Tower.StoreOperators.notInAny;

module.exports = Tower.StoreOperators;
