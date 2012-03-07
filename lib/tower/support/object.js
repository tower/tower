var specialProperties;
var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; }, __slice = Array.prototype.slice;

specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods'];

Tower.Support.Object = {
  extend: function(object) {
    var args, key, node, value, _i, _len;
    args = Tower.Support.Array.args(arguments, 1);
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      node = args[_i];
      for (key in node) {
        value = node[key];
        if (__indexOf.call(specialProperties, key) < 0) object[key] = value;
      }
    }
    return object;
  },
  cloneHash: function(options) {
    var key, result, value;
    result = {};
    for (key in options) {
      value = options[key];
      if (this.isArray(value)) {
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
    var i, item, result, _len;
    result = value.concat();
    for (i = 0, _len = result.length; i < _len; i++) {
      item = result[i];
      if (this.isArray(item)) {
        result[i] = this.cloneArray(item);
      } else if (this.isHash(item)) {
        result[i] = this.cloneHash(item);
      }
    }
    return result;
  },
  deepMerge: function(object) {
    var args, key, node, value, _i, _len;
    args = Tower.Support.Array.args(arguments, 1);
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
    args = Tower.Support.Array.args(arguments, 1);
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      node = args[_i];
      for (key in node) {
        value = node[key];
        if (!(__indexOf.call(specialProperties, key) < 0)) continue;
        oldValue = object[key];
        if (oldValue) {
          if (this.isArray(oldValue)) {
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
    if (options == null) options = {};
    return Object.defineProperty(object, key, options);
  },
  functionName: function(fn) {
    var _ref;
    if (fn.__name__) return fn.__name__;
    if (fn.name) return fn.name;
    return (_ref = fn.toString().match(/\W*function\s+([\w\$]+)\(/)) != null ? _ref[1] : void 0;
  },
  alias: function(object, to, from) {
    return object[to] = object[from];
  },
  accessor: function(object, key, callback) {
    object._accessors || (object._accessors = []);
    object._accessors.push(key);
    this.getter(key, object, callback);
    this.setter(key, object);
    return this;
  },
  setter: function(object, key) {
    if (!object.hasOwnProperty("_setAttribute")) {
      this.defineProperty(object, "_setAttribute", {
        enumerable: false,
        configurable: true,
        value: function(key, value) {
          return this["_" + key] = value;
        }
      });
    }
    object._setters || (object._setters = []);
    object._setters.push(key);
    this.defineProperty(object, key, {
      enumerable: true,
      configurable: true,
      set: function(value) {
        return this["_setAttribute"](key, value);
      }
    });
    return this;
  },
  getter: function(object, key, callback) {
    if (!object.hasOwnProperty("_getAttribute")) {
      this.defineProperty(object, "_getAttribute", {
        enumerable: false,
        configurable: true,
        value: function(key) {
          return this["_" + key];
        }
      });
    }
    object._getters || (object._getters = []);
    object._getters.push(key);
    this.defineProperty(object, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        return this["_getAttribute"](key) || (callback ? this["_" + key] = callback.apply(this) : void 0);
      }
    });
    return this;
  },
  variables: function(object) {},
  accessors: function(object) {},
  methods: function(object) {
    var key, result, value;
    result = [];
    for (key in object) {
      value = object[key];
      if (this.isFunction(value)) result.push(key);
    }
    return result;
  },
  delegate: function() {
    var isFunction, key, keys, object, options, to, _i, _j, _len;
    object = arguments[0], keys = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), options = arguments[_i++];
    if (options == null) options = {};
    to = options.to;
    isFunction = this.isFunction(object);
    for (_j = 0, _len = keys.length; _j < _len; _j++) {
      key = keys[_j];
      if (isFunction) {
        object[key] = function() {
          var _ref;
          return (_ref = this[to]())[key].apply(_ref, arguments);
        };
      } else {
        this.defineProperty(object, key, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this[to]()[key];
          }
        });
      }
    }
    return object;
  },
  isFunction: function(object) {
    return !!(object && object.constructor && object.call && object.apply);
  },
  toArray: function(object) {
    if (this.isArray(object)) {
      return object;
    } else {
      return [object];
    }
  },
  keys: function(object) {
    return Object.keys(object);
  },
  isA: function(object, isa) {},
  isRegExp: function(object) {
    return !!(object && object.test && object.exec && (object.ignoreCase || object.ignoreCase === false));
  },
  isHash: function(object) {
    return this.isObject(object) && !(this.isFunction(object) || this.isArray(object) || _.isDate(object) || _.isRegExp(object));
  },
  isBaseObject: function(object) {
    return object && object.constructor && object.constructor.name === "Object";
  },
  isArray: Array.isArray || function(object) {
    return toString.call(object) === '[object Array]';
  },
  kind: function(object) {
    var type;
    type = typeof object;
    switch (type) {
      case "object":
        if (_.isArray(object)) return "array";
        if (_.isArguments(object)) return "arguments";
        if (_.isBoolean(object)) return "boolean";
        if (_.isDate(object)) return "date";
        if (_.isRegExp(object)) return "regex";
        if (_.isNaN(object)) return "NaN";
        if (_.isNull(object)) return "null";
        if (_.isUndefined(object)) return "undefined";
        return "object";
      case "number":
        if (object === +object && object === (object | 0)) return "integer";
        if (object === +object && object !== (object | 0)) return "float";
        return "number";
      case "function":
        if (_.isRegExp(object)) return "regex";
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
    if (typeof object === "string") return object === "";
    for (key in object) {
      value = object[key];
      return false;
    }
    return true;
  },
  has: function(object, key) {
    return object.hasOwnProperty(key);
  }
};

module.exports = Tower.Support.Object;
