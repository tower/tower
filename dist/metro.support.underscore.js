var __slice = Array.prototype.slice;

_.mixin({
  camelize_rx: /(?:^|_|\-)(.)/g,
  capitalize_rx: /(^|\s)([a-z])/g,
  underscore_rx1: /([A-Z]+)([A-Z][a-z])/g,
  underscore_rx2: /([a-z\d])([A-Z])/g,
  constantize: function(string, scope) {
    if (scope == null) scope = global;
    return scope[this.camelize(string)];
  },
  camelize: function(string, firstLetterLower) {
    string = string.replace(camelize_rx, function(str, p1) {
      return p1.toUpperCase();
    });
    if (firstLetterLower) {
      return string.substr(0, 1).toLowerCase() + string.substr(1);
    } else {
      return string;
    }
  },
  underscore: function(string) {
    return string.replace(underscore_rx1, '$1_$2').replace(underscore_rx2, '$1_$2').replace('-', '_').toLowerCase();
  },
  singularize: function(string) {
    var len;
    len = string.length;
    if (string.substr(len - 3) === 'ies') {
      return string.substr(0, len - 3) + 'y';
    } else if (string.substr(len - 1) === 's') {
      return string.substr(0, len - 1);
    } else {
      return string;
    }
  },
  pluralize: function(count, string) {
    var lastLetter, len;
    if (string) {
      if (count === 1) return string;
    } else {
      string = count;
    }
    len = string.length;
    lastLetter = string.substr(len - 1);
    if (lastLetter === 'y') {
      return "" + (string.substr(0, len - 1)) + "ies";
    } else if (lastLetter === 's') {
      return string;
    } else {
      return "" + string + "s";
    }
  },
  capitalize: function(string) {
    return string.replace(capitalize_rx, function(m, p1, p2) {
      return p1 + p2.toUpperCase();
    });
  },
  trim: function(string) {
    if (string) {
      return string.trim();
    } else {
      return "";
    }
  },
  interpolate: function(stringOrObject, keys) {
    var key, string, value;
    if (typeof stringOrObject === 'object') {
      string = stringOrObject[keys.count];
      if (!string) string = stringOrObject['other'];
    } else {
      string = stringOrObject;
    }
    for (key in keys) {
      value = keys[key];
      string = string.replace(new RegExp("%\\{" + key + "\\}", "g"), value);
    }
    return string;
  }
});

module.exports = _({
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
    return from;
  },
  isFunction: function(object) {
    return !!(object && object.constructor && object.call && object.apply);
  },
  isA: function(object, isa) {},
  isHash: function() {
    var object;
    object = arguments[0] || this;
    return _.isObject(object) && !(_.isFunction(object) || _.isArray(object));
  },
  isPresent: function(object) {
    return !this.isBlank(object);
  },
  isBlank: function(object) {
    var key, value;
    for (key in object) {
      value = object[key];
      return false;
    }
    return true;
  },
  has: function(object, key) {
    return object.hasOwnProperty(key);
  },
  isInt: function(n) {
    return n === +n && n === (n | 0);
  },
  isFloat: function(n) {
    return n === +n && n !== (n | 0);
  }
});

module.exports = Metro.Support.Number({
  args: function(args, index, withCallback, withOptions) {
    if (index == null) index = 0;
    if (withCallback == null) withCallback = false;
    if (withOptions == null) withOptions = false;
    args = Array.prototype.slice.call(args, index, args.length);
    if (withCallback && !(args.length >= 2 && typeof args[args.length - 1] === "function")) {
      throw new Error("You must pass a callback to the render method");
    }
    return args;
  },
  sortBy: function(objects) {
    var arrayComparator, callbacks, sortings, valueComparator;
    sortings = this.args(arguments, 1);
    callbacks = sortings[sortings.length - 1] instanceof Array ? {} : sortings.pop();
    valueComparator = function(x, y) {
      if (x > y) {
        return 1;
      } else {
        if (x < y) {
          return -1;
        } else {
          return 0;
        }
      }
    };
    arrayComparator = function(a, b) {
      var x, y;
      x = [];
      y = [];
      sortings.forEach(function(sorting) {
        var aValue, attribute, bValue, direction;
        attribute = sorting[0];
        direction = sorting[1];
        aValue = a[attribute];
        bValue = b[attribute];
        if (typeof callbacks[attribute] !== "undefined") {
          aValue = callbacks[attribute](aValue);
          bValue = callbacks[attribute](bValue);
        }
        x.push(direction * valueComparator(aValue, bValue));
        return y.push(direction * valueComparator(bValue, aValue));
      });
      if (x < y) {
        return -1;
      } else {
        return 1;
      }
    };
    sortings = sortings.map(function(sorting) {
      if (!(sorting instanceof Array)) sorting = [sorting, "asc"];
      if (sorting[1] === "desc") {
        sorting[1] = -1;
      } else {
        sorting[1] = 1;
      }
      return sorting;
    });
    return objects.sort(function(a, b) {
      return arrayComparator(a, b);
    });
  },
  regexpEscape: function(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
});

module.exports = Metro.Support.RegExp;
