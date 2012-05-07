
Tower.Store.Operators = {
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
    '!~': '$nm',
    '$nm': '$nm',
    '==': '$eq',
    '$eq': '$eq',
    '!=': '$neq',
    '$neq': '$neq',
    '$null': '$null',
    '$notNull': '$notNull',
    '$exists': '$exists',
    '$size': '$size',
    '$elemMatch': '$matchIn',
    '$matchIn': '$matchIn'
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
        success = this.testValue(this._getValue(record, key), value);
      }
      if (!success) {
        return false;
      }
    }
    return success;
  },
  testValue: function(recordValue, operators) {
    var key, operator, self, success, value;
    success = true;
    self = this;
    switch (typeof operators) {
      case 'number':
      case 'string':
      case 'undefined':
      case 'null':
      case 'NaN':
        success = recordValue === operators;
        break;
      default:
        if (_.isRegExp(operators)) {
          success = this.match(recordValue, operators);
        } else {
          for (key in operators) {
            value = operators[key];
            if (operator = Tower.Store.Operators.MAP[key]) {
              success = this[operator.replace('$', '')](recordValue, value);
            } else {
              success = recordValue === operators;
            }
            if (!success) {
              return false;
            }
          }
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
  neq: function(recordValue, value) {
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
        if (recordValue.indexOf(value) !== -1) {
          return true;
        }
      }
    } else {
      for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
        value = array[_j];
        if (recordValue === value) {
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
        if (_.indexOf(recordValue, value) === -1) {
          return false;
        }
      }
    } else {
      for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
        value = array[_j];
        if (recordValue !== value) {
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
        if (_.indexOf(recordValue, value) !== -1) {
          return true;
        }
      }
    } else {
      for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
        value = array[_j];
        if (recordValue === value) {
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

Tower.Store.Operators.notIn = Tower.Store.Operators.notInAny;

module.exports = Tower.Store.Operators;
