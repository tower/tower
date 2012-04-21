var specialProperties,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods'];

Tower.Support.Object = {
  modules: function(object) {
    var args, key, node, value, _i, _len;
    args = _.args(arguments, 1);
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      node = args[_i];
      for (key in node) {
        value = node[key];
        if (__indexOf.call(specialProperties, key) < 0) {
          object[key] = value;
        }
      }
    }
    return object;
  },
  cloneHash: function(options) {
    var key, result, value;
    result = {};
    for (key in options) {
      value = options[key];
      if (_.isArray(value)) {
        result[key] = this.cloneArray(value);
      } else if (this.isHash(value)) {
        result[key] = this.cloneHash(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  },
  cloneArray: function(value) {
    var i, item, result, _i, _len;
    result = value.concat();
    for (i = _i = 0, _len = result.length; _i < _len; i = ++_i) {
      item = result[i];
      if (_.isArray(item)) {
        result[i] = this.cloneArray(item);
      } else if (this.isHash(item)) {
        result[i] = this.cloneHash(item);
      }
    }
    return result;
  },
  deepMerge: function(object) {
    var args, key, node, value, _i, _len;
    args = _.args(arguments, 1);
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      node = args[_i];
      for (key in node) {
        value = node[key];
        if (__indexOf.call(specialProperties, key) < 0) {
          if (object[key] && typeof value === 'object') {
            object[key] = Tower.Support.Object.deepMerge(object[key], value);
          } else {
            object[key] = value;
          }
        }
      }
    }
    return object;
  },
  deepMergeWithArrays: function(object) {
    var args, key, node, oldValue, value, _i, _len;
    args = _.args(arguments, 1);
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      node = args[_i];
      for (key in node) {
        value = node[key];
        if (!(__indexOf.call(specialProperties, key) < 0)) {
          continue;
        }
        oldValue = object[key];
        if (oldValue) {
          if (_.isArray(oldValue)) {
            object[key] = oldValue.concat(value);
          } else if (typeof oldValue === "object" && typeof value === "object") {
            object[key] = Tower.Support.Object.deepMergeWithArrays(object[key], value);
          } else {
            object[key] = value;
          }
        } else {
          object[key] = value;
        }
      }
    }
    return object;
  },
  defineProperty: function(object, key, options) {
    if (options == null) {
      options = {};
    }
    return Object.defineProperty(object, key, options);
  },
  functionName: function(fn) {
    var _ref;
    if (fn.__name__) {
      return fn.__name__;
    }
    if (fn.name) {
      return fn.name;
    }
    return (_ref = fn.toString().match(/\W*function\s+([\w\$]+)\(/)) != null ? _ref[1] : void 0;
  },
  castArray: function(object) {
    if (_.isArray(object)) {
      return object;
    } else {
      return [object];
    }
  },
  isA: function(object, isa) {},
  isHash: function(object) {
    return this.isObject(object) && !(this.isFunction(object) || this.isArray(object) || _.isDate(object) || _.isRegExp(object));
  },
  isBaseObject: function(object) {
    return object && object.constructor && object.constructor.name === "Object";
  },
  kind: function(object) {
    var type;
    type = typeof object;
    switch (type) {
      case "object":
        if (_.isArray(object)) {
          return "array";
        }
        if (_.isArguments(object)) {
          return "arguments";
        }
        if (_.isBoolean(object)) {
          return "boolean";
        }
        if (_.isDate(object)) {
          return "date";
        }
        if (_.isRegExp(object)) {
          return "regex";
        }
        if (_.isNaN(object)) {
          return "NaN";
        }
        if (_.isNull(object)) {
          return "null";
        }
        if (_.isUndefined(object)) {
          return "undefined";
        }
        return "object";
      case "number":
        if (object === +object && object === (object | 0)) {
          return "integer";
        }
        if (object === +object && object !== (object | 0)) {
          return "float";
        }
        return "number";
      case "function":
        if (_.isRegExp(object)) {
          return "regex";
        }
        return "function";
      default:
        return type;
    }
  },
  isObject: function(object) {
    return object === Object(object);
  },
  isPresent: function(object) {
    return !this.isBlank(object);
  },
  isBlank: function(object) {
    var key, value;
    switch (_.kind(object)) {
      case "object":
        for (key in object) {
          value = object[key];
          return false;
        }
        return true;
      case "string":
        return object === "";
      case "array":
        return object.length === 0;
      case "null":
      case "undefined":
        return true;
      default:
        return false;
    }
  },
  none: function(value) {
    return value === null || value === void 0;
  },
  has: function(object, key) {
    return object.hasOwnProperty(key);
  },
  oneOrMany: function() {
    var args, binding, key, method, value, _key, _results;
    binding = arguments[0], method = arguments[1], key = arguments[2], value = arguments[3], args = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
    if (typeof key === "object") {
      _results = [];
      for (_key in key) {
        value = key[_key];
        _results.push(method.call.apply(method, [binding, _key, value].concat(__slice.call(args))));
      }
      return _results;
    } else {
      return method.call.apply(method, [binding, key, value].concat(__slice.call(args)));
    }
  },
  error: function(error, callback) {
    if (error) {
      if (callback) {
        return callback(error);
      } else {
        throw error;
      }
    }
  },
  teardown: function() {
    var object, variable, variables, _i, _len;
    object = arguments[0], variables = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    variables = _.flatten(variables);
    for (_i = 0, _len = variables.length; _i < _len; _i++) {
      variable = variables[_i];
      object[variable] = null;
      delete object[variable];
    }
    return object;
  },
  copyProperties: function(to, from) {
    var properties, property, _i, _len;
    properties = _.args(arguments, 2);
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      property = properties[_i];
      if (from[property] !== void 0) {
        to[property] = from[property];
      }
    }
    return to;
  },
  moveProperties: function(to, from) {
    var properties, property, _i, _len;
    properties = _.args(arguments, 2);
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      property = properties[_i];
      if (from[property] !== void 0) {
        to[property] = from[property];
      }
      delete from[property];
    }
    return to;
  },
  isEmptyObject: function(object) {
    var name;
    for (name in object) {
      if (object.hasOwnProperty(name)) {
        return false;
      }
    }
    return true;
  },
  hasDefinedProperties: function(object) {
    var name;
    for (name in object) {
      if (object.hasOwnProperty(name) && object[name]) {
        return true;
      }
    }
    return false;
  }
};

module.exports = Tower.Support.Object;
