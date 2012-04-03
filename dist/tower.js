/*!
 * Tower.js v0.3.9-11
 * http://towerjs.org/
 *
 * Copyright 2012, Lance Pollard
 * MIT License.
 * http://towerjs.org/license
 *
 * Date: Fri, 30 Mar 2012 00:19:39 GMT
 */
(function() {
  var Tower, key, module, specialProperties, _fn, _fn2, _fn3, _fn4, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4,
    __slice = Array.prototype.slice,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    _this = this;

  window.global || (window.global = window);

  module = global.module || {};

  global.Tower = Tower = {};

  Tower.version = "0.3.9-11";

  Tower.logger = console;

  Tower.Support = {};

  Tower.Support.Array = {
    extractOptions: function(args) {
      if (typeof args[args.length - 1] === "object") {
        return args.pop();
      } else {
        return {};
      }
    },
    extractBlock: function(args) {
      if (typeof args[args.length - 1] === "function") {
        return args.pop();
      } else {
        return null;
      }
    },
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
    }
  };

  Tower.Support.Callbacks = {
    ClassMethods: {
      before: function() {
        return this.appendCallback.apply(this, ["before"].concat(__slice.call(arguments)));
      },
      after: function() {
        return this.appendCallback.apply(this, ["after"].concat(__slice.call(arguments)));
      },
      callback: function() {
        var args;
        args = Tower.Support.Array.args(arguments);
        if (!args[0].match(/^(?:before|around|after)$/)) {
          args = ["after"].concat(args);
        }
        return this.appendCallback.apply(this, args);
      },
      removeCallback: function(action, phase, run) {
        return this;
      },
      appendCallback: function(phase) {
        var args, callback, callbacks, filter, method, options, _i, _len;
        args = Tower.Support.Array.args(arguments, 1);
        if (typeof args[args.length - 1] !== "object") method = args.pop();
        if (typeof args[args.length - 1] === "object") options = args.pop();
        method || (method = args.pop());
        options || (options = {});
        callbacks = this.callbacks();
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          filter = args[_i];
          callback = callbacks[filter] || (callbacks[filter] = new Tower.Support.Callbacks.Chain);
          callback.push(phase, method, options);
        }
        return this;
      },
      prependCallback: function(action, phase, run, options) {
        if (options == null) options = {};
        return this;
      },
      callbacks: function() {
        return this._callbacks || (this._callbacks = {});
      }
    },
    runCallbacks: function(kind, options, block, complete) {
      var chain;
      if (typeof options === "function") {
        complete = block;
        block = options;
        options = {};
      }
      options || (options = {});
      chain = this.constructor.callbacks()[kind];
      if (chain) {
        return chain.run(this, options, block, complete);
      } else {
        block.call(this);
        if (complete) return complete.call(this);
      }
    },
    _callback: function() {
      var callbacks,
        _this = this;
      callbacks = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return function(error) {
        var callback, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          if (callback) {
            _results.push(callback.call(_this, error));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
    }
  };

  Tower.Support.Callbacks.Chain = (function() {

    function Chain(options) {
      var key, value;
      if (options == null) options = {};
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.before || (this.before = []);
      this.after || (this.after = []);
    }

    Chain.prototype.run = function(binding, options, block, complete) {
      var runner,
        _this = this;
      runner = function(callback, next) {
        return callback.run(binding, options, next);
      };
      return Tower.async(this.before, runner, function(error) {
        if (!error) {
          if (block) {
            switch (block.length) {
              case 0:
                block.call(binding);
                return Tower.async(_this.after, runner, function(error) {
                  if (complete) complete.call(binding);
                  return binding;
                });
              default:
                return block.call(binding, function(error) {
                  if (!error) {
                    return Tower.async(_this.after, runner, function(error) {
                      if (complete) complete.call(binding);
                      return binding;
                    });
                  }
                });
            }
          } else {
            return Tower.async(_this.after, runner, function(error) {
              if (complete) complete.call(binding);
              return binding;
            });
          }
        }
      });
    };

    Chain.prototype.push = function(phase, method, filters, options) {
      return this[phase].push(new Tower.Support.Callback(method, filters, options));
    };

    return Chain;

  })();

  Tower.Support.Callback = (function() {

    function Callback(method, conditions) {
      if (conditions == null) conditions = {};
      this.method = method;
      this.conditions = conditions;
      if (conditions.hasOwnProperty("only")) {
        conditions.only = Tower.Support.Object.toArray(conditions.only);
      }
      if (conditions.hasOwnProperty("except")) {
        conditions.except = Tower.Support.Object.toArray(conditions.except);
      }
    }

    Callback.prototype.run = function(binding, options, next) {
      var conditions, method, result;
      conditions = this.conditions;
      if (options && options.hasOwnProperty("name")) {
        if (conditions.hasOwnProperty("only")) {
          if (_.indexOf(conditions.only, options.name) === -1) return next();
        } else if (conditions.hasOwnProperty("except")) {
          if (_.indexOf(conditions.except, options.name) !== -1) return next();
        }
      }
      method = this.method;
      if (typeof method === "string") {
        if (!binding[method]) {
          throw new Error("The method `" + method + "` doesn't exist");
        }
        method = binding[method];
      }
      switch (method.length) {
        case 0:
          result = method.call(binding);
          return next(!result ? new Error("Callback did not pass") : null);
        default:
          return method.call(binding, next);
      }
    };

    return Callback;

  })();

  specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods'];

  Tower.Class = (function() {

    Class.global = function(value) {
      if (value !== void 0) this._global = value;
      if (this._global === void 0) this._global = true;
      if (value === true) {
        global[this.name] = this;
      } else if (value === false) {
        delete global[this.name];
      }
      return this._global;
    };

    Class.alias = function(to, from) {
      return Tower.Support.Object.alias(this.prototype, to, from);
    };

    Class.accessor = function(key, callback) {
      Tower.Support.Object.accessor(this.prototype, key, callback);
      return this;
    };

    Class.getter = function(key, callback) {
      Tower.Support.Object.getter(this.prototype, key, callback);
      return this;
    };

    Class.setter = function(key) {
      Tower.Support.Object.setter(this.prototype, key);
      return this;
    };

    Class.classAlias = function(to, from) {
      Tower.Support.Object.alias(this, to, from);
      return this;
    };

    Class.classAccessor = function(key, callback) {
      Tower.Support.Object.accessor(this, key, callback);
      return this;
    };

    Class.classGetter = function(key, callback) {
      Tower.Support.Object.getter(this, key, callback);
      return this;
    };

    Class.classSetter = function(key) {
      Tower.Support.Object.setter(this, key);
      return this;
    };

    Class.classEval = function(block) {
      return block.call(this);
    };

    Class.delegate = function(key, options) {
      if (options == null) options = {};
      Tower.Support.Object.delegate(this.prototype, key, options);
      return this;
    };

    Class.mixin = function(self, object) {
      var key, value;
      for (key in object) {
        value = object[key];
        if (__indexOf.call(specialProperties, key) < 0) self[key] = value;
      }
      return object;
    };

    Class.extend = function(object) {
      var extended;
      this.mixin(this, object);
      extended = object.extended;
      if (extended) extended.apply(object);
      return object;
    };

    Class.self = Class.extend;

    Class.include = function(object) {
      var included;
      if (object.hasOwnProperty("ClassMethods")) this.extend(object.ClassMethods);
      if (object.hasOwnProperty("InstanceMethods")) {
        this.include(object.InstanceMethods);
      }
      this.mixin(this.prototype, object);
      included = object.included;
      if (included) included.apply(object);
      return object;
    };

    Class.className = function() {
      return Tower.Support.Object.functionName(this);
    };

    Class.prototype.className = function() {
      return this.constructor.className();
    };

    function Class() {
      this.initialize();
    }

    Class.prototype.initialize = function() {};

    return Class;

  })();

  Tower.Support.EventEmitter = {
    isEventEmitter: true,
    events: function() {
      return this._events || (this._events = {});
    },
    hasEventListener: function(key) {
      return Tower.Support.Object.isPresent(this.events(), key);
    },
    event: function(key) {
      var _base;
      return (_base = this.events())[key] || (_base[key] = new Tower.Event(this, key));
    },
    on: function() {
      var args, eventMap, eventType, handler, options, _results;
      args = Tower.Support.Array.args(arguments);
      if (typeof args[args.length - 1] === "object") {
        options = args.pop();
        if (args.length === 0) {
          eventMap = options;
          options = {};
        }
      } else {
        options = {};
      }
      if (typeof args[args.length - 1] === "object") {
        eventMap = args.pop();
      } else {
        eventMap = {};
        eventMap[args.shift()] = args.shift();
      }
      _results = [];
      for (eventType in eventMap) {
        handler = eventMap[eventType];
        _results.push(this.addEventHandler(eventType, handler, options));
      }
      return _results;
    },
    addEventHandler: function(type, handler, options) {
      return this.event(type).addHandler(handler);
    },
    mutation: function(wrappedFunction) {
      return function() {
        var result;
        result = wrappedFunction.apply(this, arguments);
        this.event('change').fire(this, this);
        return result;
      };
    },
    prevent: function(key) {
      this.event(key).prevent();
      return this;
    },
    allow: function(key) {
      this.event(key).allow();
      return this;
    },
    isPrevented: function(key) {
      return this.event(key).isPrevented();
    },
    fire: function(key) {
      var event;
      event = this.event(key);
      return event.fire.call(event, Tower.Support.Array.args(arguments, 1));
    },
    allowAndFire: function(key) {
      return this.event(key).allowAndFire(Tower.Support.Array.args(arguments, 1));
    }
  };

  Tower.Support.I18n = {
    PATTERN: /(?:%%|%\{(\w+)\}|%<(\w+)>(.*?\d*\.?\d*[bBdiouxXeEfgGcps]))/g,
    defaultLanguage: "en",
    load: function(pathOrObject, language) {
      var store;
      if (language == null) language = this.defaultLanguage;
      store = this.store();
      language = store[language] || (store[language] = {});
      Tower.Support.Object.deepMerge(language, typeof pathOrObject === "string" ? require(pathOrObject) : pathOrObject);
      return this;
    },
    translate: function(key, options) {
      if (options == null) options = {};
      if (options.hasOwnProperty("tense")) key += "." + options.tense;
      if (options.hasOwnProperty("count")) {
        switch (options.count) {
          case 0:
            key += ".none";
            break;
          case 1:
            key += ".one";
            break;
          default:
            key += ".other";
        }
      }
      return this.interpolate(this.lookup(key, options.language), options);
    },
    localize: function() {
      return this.translate.apply(this, arguments);
    },
    lookup: function(key, language) {
      var part, parts, result, _i, _len;
      if (language == null) language = this.defaultLanguage;
      parts = key.split(".");
      result = this.store()[language];
      try {
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          result = result[part];
        }
      } catch (error) {
        result = null;
      }
      if (result == null) {
        throw new Error("Translation doesn't exist for '" + key + "'");
      }
      return result;
    },
    store: function() {
      return this._store || (this._store = {});
    },
    interpolate: function(string, locals) {
      if (locals == null) locals = {};
      return string.replace(this.PATTERN, function(match, $1, $2, $3) {
        var key, value;
        if (match === '%%') {
          return '%';
        } else {
          key = $1 || $2;
          if (locals.hasOwnProperty(key)) {
            value = locals[key];
          } else {
            throw new Error("Missing interpolation argument " + key);
          }
          if (typeof value === 'function') value = value.call(locals);
          if ($3) {
            return sprintf("%" + $3, value);
          } else {
            return value;
          }
        }
      });
    }
  };

  Tower.Support.I18n.t = Tower.Support.I18n.translate;

  Tower.Support.Number = {
    isInt: function(n) {
      return n === +n && n === (n | 0);
    },
    isFloat: function(n) {
      return n === +n && n !== (n | 0);
    }
  };

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

  Tower.Support.RegExp = {
    regexpEscape: function(string) {
      return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
  };

  Tower.Support.String = {
    camelize_rx: /(?:^|_|\-)(.)/g,
    capitalize_rx: /(^|\s)([a-z])/g,
    underscore_rx1: /([A-Z]+)([A-Z][a-z])/g,
    underscore_rx2: /([a-z\d])([A-Z])/g,
    parameterize: function(string) {
      return Tower.Support.String.underscore(string).replace("_", "-");
    },
    constantize: function(string, scope) {
      if (scope == null) scope = global;
      return scope[this.camelize(string)];
    },
    camelize: function(string, firstLetterLower) {
      string = string.replace(this.camelize_rx, function(str, p1) {
        return p1.toUpperCase();
      });
      if (firstLetterLower) {
        return string.substr(0, 1).toLowerCase() + string.substr(1);
      } else {
        return string;
      }
    },
    underscore: function(string) {
      return string.replace(this.underscore_rx1, '$1_$2').replace(this.underscore_rx2, '$1_$2').replace('-', '_').toLowerCase();
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
      return string.replace(this.capitalize_rx, function(m, p1, p2) {
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
  };

  Tower.Support.String.toQueryValue = function(value, negate) {
    var item, items, result, _i, _len;
    if (negate == null) negate = "";
    if (Tower.Support.Object.isArray(value)) {
      items = [];
      for (_i = 0, _len = value.length; _i < _len; _i++) {
        item = value[_i];
        result = negate;
        result += item;
        items.push(result);
      }
      result = items.join(",");
    } else {
      result = negate;
      result += value.toString();
    }
    result = result.replace(" ", "+").replace(/[#%\"\|<>]/g, function(_) {
      return encodeURIComponent(_);
    });
    return result;
  };

  Tower.Support.String.toQuery = function(object, schema) {
    var data, key, negate, param, range, result, set, type, value;
    if (schema == null) schema = {};
    result = [];
    for (key in object) {
      value = object[key];
      param = "" + key + "=";
      type = schema[key] || "string";
      negate = type === "string" ? "-" : "^";
      if (Tower.Support.Object.isHash(value)) {
        data = {};
        if (value.hasOwnProperty(">=")) data.min = value[">="];
        if (value.hasOwnProperty(">")) data.min = value[">"];
        if (value.hasOwnProperty("<=")) data.max = value["<="];
        if (value.hasOwnProperty("<")) data.max = value["<"];
        if (value.hasOwnProperty("=~")) data.match = value["=~"];
        if (value.hasOwnProperty("!~")) data.notMatch = value["!~"];
        if (value.hasOwnProperty("==")) data.eq = value["=="];
        if (value.hasOwnProperty("!=")) data.neq = value["!="];
        data.range = data.hasOwnProperty("min") || data.hasOwnProperty("max");
        set = [];
        if (data.range && !(data.hasOwnProperty("eq") || data.hasOwnProperty("match"))) {
          range = "";
          if (data.hasOwnProperty("min")) {
            range += Tower.Support.String.toQueryValue(data.min);
          } else {
            range += "n";
          }
          range += "..";
          if (data.hasOwnProperty("max")) {
            range += Tower.Support.String.toQueryValue(data.max);
          } else {
            range += "n";
          }
          set.push(range);
        }
        if (data.hasOwnProperty("eq")) {
          set.push(Tower.Support.String.toQueryValue(data.eq));
        }
        if (data.hasOwnProperty("match")) {
          set.push(Tower.Support.String.toQueryValue(data.match));
        }
        if (data.hasOwnProperty("neq")) {
          set.push(Tower.Support.String.toQueryValue(data.neq, negate));
        }
        if (data.hasOwnProperty("notMatch")) {
          set.push(Tower.Support.String.toQueryValue(data.notMatch, negate));
        }
        param += set.join(",");
      } else {
        param += Tower.Support.String.toQueryValue(value);
      }
      result.push(param);
    }
    return result.sort().join("&");
  };

  Tower.Support.String.extractDomain = function(host, tldLength) {
    var parts;
    if (tldLength == null) tldLength = 1;
    if (!this.namedHost(host)) return null;
    parts = host.split('.');
    return parts.slice(0, (parts.length - 1 - 1 + tldLength) + 1 || 9e9).join(".");
  };

  Tower.Support.String.extractSubdomains = function(host, tldLength) {
    var parts;
    if (tldLength == null) tldLength = 1;
    if (!this.namedHost(host)) return [];
    parts = host.split('.');
    return parts.slice(0, -(tldLength + 2) + 1 || 9e9);
  };

  Tower.Support.String.extractSubdomain = function(host, tldLength) {
    if (tldLength == null) tldLength = 1;
    return this.extractSubdomains(host, tldLength).join('.');
  };

  Tower.Support.String.namedHost = function(host) {
    return !!!(host === null || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(host));
  };

  Tower.Support.String.rewriteAuthentication = function(options) {
    if (options.user && options.password) {
      return "" + (encodeURI(options.user)) + ":" + (encodeURI(options.password)) + "@";
    } else {
      return "";
    }
  };

  Tower.Support.String.hostOrSubdomainAndDomain = function(options) {
    var host, subdomain, tldLength;
    if (options.subdomain === null && options.domain === null) return options.host;
    tldLength = options.tldLength || 1;
    host = "";
    if (options.subdomain !== false) {
      subdomain = options.subdomain || this.extractSubdomain(options.host, tldLength);
      if (subdomain) host += "" + subdomain + ".";
    }
    host += options.domain || this.extractDomain(options.host, tldLength);
    return host;
  };

  Tower.Support.String.urlFor = function(options) {
    var params, path, port, result, schema;
    if (!(options.host || options.onlyPath)) {
      throw new Error('Missing host to link to! Please provide the :host parameter, set defaultUrlOptions[:host], or set :onlyPath to true');
    }
    result = "";
    params = options.params || {};
    path = (options.path || "").replace(/\/+/, "/");
    schema = options.schema || {};
    delete options.path;
    delete options.schema;
    if (!options.onlyPath) {
      port = options.port;
      delete options.port;
      if (options.protocol !== false) {
        result += options.protocol || "http";
        if (!result.match(Tower.Support.RegExp.regexpEscape(":|//"))) {
          result += ":";
        }
      }
      if (!result.match("//")) result += "//";
      result += this.rewriteAuthentication(options);
      result += this.hostOrSubdomainAndDomain(options);
      if (port) result += ":" + port;
    }
    if (options.trailingSlash) {
      result += path.replace(/\/$/, "/");
    } else {
      result += path;
    }
    if (!Tower.Support.Object.isBlank(params)) {
      result += "?" + (Tower.Support.String.toQuery(params, schema));
    }
    if (options.anchor) {
      result += "#" + (Tower.Support.String.toQuery(options.anchor));
    }
    return result;
  };

  Tower.urlFor = function() {
    var args, item, last, options, result, route, _i, _len;
    args = Tower.Support.Array.args(arguments);
    if (!args[0]) return null;
    if (args[0] instanceof Tower.Model || (typeof args[0]).match(/(string|function)/)) {
      last = args[args.length - 1];
      if (last instanceof Tower.Model || (typeof last).match(/(string|function)/)) {
        options = {};
      } else {
        options = args.pop();
      }
    }
    options || (options = args.pop());
    result = "";
    if (options.controller && options.action) {
      route = Tower.Route.find({
        name: Tower.Support.String.camelize(options.controller).replace(/(Controller)?$/, "Controller"),
        action: options.action
      });
      if (route) {
        result = "/" + Tower.Support.String.parameterize(options.controller);
      }
    } else {
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        item = args[_i];
        result += "/";
        if (typeof item === "string") {
          result += item;
        } else if (item instanceof Tower.Model) {
          result += item.toPath();
        } else if (typeof item === "function") {
          result += item.toParam();
        }
      }
    }
    result += (function() {
      switch (options.action) {
        case "new":
          return "/new";
        case "edit":
          return "/edit";
        default:
          return "";
      }
    })();
    if (!options.hasOwnProperty("onlyPath")) options.onlyPath = true;
    options.path = result;
    return Tower.Support.String.urlFor(options);
  };

  Tower.Support.String.parameterize = function(string) {
    return Tower.Support.String.underscore(string).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '');
  };

  Tower.Support.Url = {};

  Tower.Support.I18n.load({
    date: {
      formats: {
        "default": "%Y-%m-%d",
        short: "%b %d",
        long: "%B %d, %Y"
      },
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      abbrDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      monthNames: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      abbrMonthNames: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      order: ["year", "month", "day"]
    }
  });

  ({
    time: {
      formats: {
        "default": "%a, %d %b %Y %H:%M:%S %z",
        short: "%d %b %H:%M",
        long: "%B %d, %Y %H:%M"
      },
      am: "am",
      pm: "pm"
    },
    support: {
      array: {
        wordsConnector: ", ",
        twoWordsConnector: " and ",
        lastWordConnector: ", and "
      }
    }
  });

  Tower.Hook = (function(_super) {

    __extends(Hook, _super);

    function Hook() {
      Hook.__super__.constructor.apply(this, arguments);
    }

    Hook.include(Tower.Support.Callbacks);

    return Hook;

  })(Tower.Class);

  Tower.Engine = (function(_super) {

    __extends(Engine, _super);

    function Engine() {
      Engine.__super__.constructor.apply(this, arguments);
    }

    return Engine;

  })(Tower.Hook);

  Tower.Support.Object.extend(Tower, {
    env: "development",
    port: 3000,
    client: typeof window !== "undefined",
    root: "/",
    publicPath: "/",
    "case": "camelcase",
    namespace: null,
    accessors: typeof window === "undefined",
    logger: typeof _console !== 'undefined' ? _console : console,
    structure: "standard",
    config: {},
    namespaces: {},
    metadata: {},
    metadataFor: function(name) {
      var _base;
      return (_base = this.metadata)[name] || (_base[name] = {});
    },
    callback: function() {
      var _ref;
      return (_ref = Tower.Application).callback.apply(_ref, arguments);
    },
    runCallbacks: function() {
      var _ref;
      return (_ref = Tower.Application.instance()).runCallbacks.apply(_ref, arguments);
    },
    sync: function(method, records, callback) {
      if (callback) return callback(null, records);
    },
    get: function() {
      return Tower.request.apply(Tower, ["get"].concat(__slice.call(arguments)));
    },
    post: function() {
      return Tower.request.apply(Tower, ["post"].concat(__slice.call(arguments)));
    },
    put: function() {
      return Tower.request.apply(Tower, ["put"].concat(__slice.call(arguments)));
    },
    destroy: function() {
      return Tower.request.apply(Tower, ["delete"].concat(__slice.call(arguments)));
    },
    request: function(method, path, options, callback) {
      var location, request, response, url;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options || (options = {});
      url = path;
      location = new Tower.Dispatch.Url(url);
      request = new Tower.Dispatch.Request({
        url: url,
        location: location,
        method: method
      });
      response = new Tower.Dispatch.Response({
        url: url,
        location: location,
        method: method
      });
      request.query = location.params;
      return Tower.Application.instance().handle(request, response, function() {
        return callback.call(this, this.response);
      });
    },
    raise: function() {
      throw new Error(Tower.t.apply(Tower, arguments));
    },
    t: function() {
      var _ref;
      return (_ref = Tower.Support.I18n).translate.apply(_ref, arguments);
    },
    l: function() {
      var _ref;
      return (_ref = Tower.Support.I18n).localize.apply(_ref, arguments);
    },
    stringify: function() {
      var string;
      string = Tower.Support.Array.args(arguments).join("_");
      switch (Tower["case"]) {
        case "snakecase":
          return Tower.Support.String.underscore(string);
        default:
          return Tower.Support.String.camelcase(string);
      }
    },
    namespace: function() {
      return Tower.Application.instance().constructor.name;
    },
    module: function(namespace) {
      var node, part, parts, _i, _len;
      node = Tower.namespaces[namespace];
      if (node) return node;
      parts = namespace.split(".");
      node = Tower;
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        node = node[part] || (node[part] = {});
      }
      return Tower.namespaces[namespace] = node;
    },
    constant: function(string) {
      var namespace, node, part, parts, _i, _len;
      node = global;
      parts = string.split(".");
      try {
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          node = node[part];
        }
      } catch (error) {
        node = null;
      }
      if (!node) {
        namespace = Tower.namespace();
        if (namespace && parts[0] !== namespace) {
          node = Tower.constant("" + namespace + "." + string);
        } else {
          throw new Error("Constant '" + string + "' wasn't found");
        }
      }
      return node;
    },
    namespaced: function(string) {
      var namespace;
      namespace = Tower.namespace();
      if (namespace) {
        return "" + namespace + "." + string;
      } else {
        return string;
      }
    },
    async: function(array, iterator, callback) {
      return this.series(array, iterator, callback);
    },
    each: function(array, iterator) {
      var index, item, _len, _results;
      if (array.forEach) {
        return array.forEach(iterator);
      } else {
        _results = [];
        for (index = 0, _len = array.length; index < _len; index++) {
          item = array[index];
          _results.push(iterator(item, index, array));
        }
        return _results;
      }
    },
    series: function(array, iterator, callback) {
      var completed, iterate;
      if (callback == null) callback = function() {};
      if (!array.length) return callback();
      completed = 0;
      iterate = function() {
        return iterator(array[completed], function(error) {
          if (error) {
            callback(error);
            return callback = function() {};
          } else {
            completed += 1;
            if (completed === array.length) {
              return callback();
            } else {
              return iterate();
            }
          }
        });
      };
      return iterate();
    },
    parallel: function(array, iterator, callback) {
      var completed, iterate;
      if (callback == null) callback = function() {};
      if (!array.length) return callback();
      completed = 0;
      iterate = function() {};
      return Tower.each(array, function(x) {
        return iterator(x, function(error) {
          if (error) {
            callback(error);
            return callback = function() {};
          } else {
            completed += 1;
            if (completed === array.length) return callback();
          }
        });
      });
    },
    none: function(value) {
      return value === null || value === void 0;
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
    args: function(args) {
      return Tower.Support.Array.args(args);
    },
    clone: function(object) {
      return _.extend({}, object);
    }
  });

  if (Tower.client) {
    Tower.request = function(method, path, options, callback) {
      var url;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options || (options = {});
      url = path;
      return History.pushState(null, null, url);
    };
  }

  _.mixin(_.string.exports());

  Tower.Application = (function(_super) {

    __extends(Application, _super);

    Application.configure = function(block) {
      return this.initializers().push(block);
    };

    Application.initializers = function() {
      return this._initializers || (this._initializers = []);
    };

    Application.instance = function() {
      return this._instance;
    };

    Application.defaultStack = function() {
      this.use(Tower.Middleware.Location);
      this.use(Tower.Middleware.Router);
      return this.middleware;
    };

    Application.use = function() {
      this.middleware || (this.middleware = []);
      return this.middleware.push(arguments);
    };

    Application.prototype.use = function() {
      var _ref;
      return (_ref = this.constructor).use.apply(_ref, arguments);
    };

    function Application(middlewares) {
      var middleware, _base, _i, _len;
      if (middlewares == null) middlewares = [];
      if (Tower.Application._instance) {
        throw new Error("Already initialized application");
      }
      Tower.Application._instance = this;
      (_base = Tower.Application).middleware || (_base.middleware = []);
      this.io = global["io"];
      this.History = global["History"];
      this.stack = [];
      for (_i = 0, _len = middlewares.length; _i < _len; _i++) {
        middleware = middlewares[_i];
        this.use(middleware);
      }
    }

    Application.prototype.initialize = function() {
      this.extractAgent();
      this.applyMiddleware();
      return this;
    };

    Application.prototype.applyMiddleware = function() {
      var middleware, middlewares, _i, _len, _results;
      middlewares = this.constructor.middleware;
      if (!(middlewares && middlewares.length > 0)) {
        middlewares = this.constructor.defaultStack();
      }
      _results = [];
      for (_i = 0, _len = middlewares.length; _i < _len; _i++) {
        middleware = middlewares[_i];
        _results.push(this.middleware.apply(this, middleware));
      }
      return _results;
    };

    Application.prototype.middleware = function() {
      var args, handle, route;
      args = Tower.Support.Array.args(arguments);
      route = "/";
      handle = args.pop();
      if (typeof route !== "string") {
        handle = route;
        route = "/";
      }
      if ("/" === route[route.length - 1]) {
        route = route.substr(0, route.length - 1);
      }
      this.stack.push({
        route: route,
        handle: handle
      });
      return this;
    };

    Application.prototype.extractAgent = function() {
      Tower.cookies = Tower.Dispatch.Cookies.parse();
      return Tower.agent = new Tower.Dispatch.Agent(JSON.parse(Tower.cookies["user-agent"] || '{}'));
    };

    Application.prototype.listen = function() {
      var self;
      self = this;
      if (this.listening) return;
      this.listening = true;
      if (this.History && this.History.enabled) {
        this.History.Adapter.bind(global, "statechange", function() {
          var location, request, response, state;
          state = History.getState();
          location = new Tower.Dispatch.Url(state.url);
          request = new Tower.Dispatch.Request({
            url: state.url,
            location: location,
            params: Tower.Support.Object.extend({
              title: state.title
            }, state.data || {})
          });
          response = new Tower.Dispatch.Response({
            url: state.url,
            location: location
          });
          return self.handle(request, response);
        });
        return $(global).trigger("statechange");
      } else {
        return console.warn("History not enabled");
      }
    };

    Application.prototype.run = function() {
      return this.listen();
    };

    Application.prototype.handle = function(request, response, out) {
      var env, index, next, removed, stack, writeHead;
      env = Tower.env;
      next = function(err) {
        var arity, c, layer, msg, path, removed;
        layer = void 0;
        path = void 0;
        c = void 0;
        request.url = removed + request.url;
        request.originalUrl = request.originalUrl || request.url;
        removed = "";
        layer = stack[index++];
        if (!layer || response.headerSent) {
          if (out) return out(err);
          if (err) {
            msg = ("production" === env ? "Internal Server Error" : err.stack || err.toString());
            if ("test" !== env) console.error(err.stack || err.toString());
            if (response.headerSent) return request.socket.destroy();
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.end(msg);
          } else {
            response.statusCode = 404;
            response.setHeader("Content-Type", "text/plain");
            response.end("Cannot " + request.method + " " + request.url);
          }
          return;
        }
        try {
          path = request.location.path;
          if (undefined === path) path = "/";
          if (0 !== path.indexOf(layer.route)) return next(err);
          c = path[layer.route.length];
          if (c && "/" !== c && "." !== c) return next(err);
          removed = layer.route;
          request.url = request.url.substr(removed.length);
          if ("/" !== request.url[0]) request.url = "/" + request.url;
          arity = layer.handle.length;
          if (err) {
            if (arity === 4) {
              return layer.handle(err, request, response, next);
            } else {
              return next(err);
            }
          } else if (arity < 4) {
            return layer.handle(request, response, next);
          } else {
            return next();
          }
        } catch (e) {
          return next(e);
        }
      };
      writeHead = response.writeHead;
      stack = this.stack;
      removed = "";
      index = 0;
      return next();
    };

    return Application;

  })(Tower.Engine);

  Tower.Store = (function(_super) {

    __extends(Store, _super);

    Store.include(Tower.Support.Callbacks);

    Store.defaultLimit = 100;

    Store.isKeyword = function(key) {
      return this.queryOperators.hasOwnProperty(key) || this.atomicModifiers.hasOwnProperty(key);
    };

    Store.hasKeyword = function(object) {
      var key, value;
      if ((function() {
        var _ref, _results;
        _ref = this.queryOperators;
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          _results.push(object.hasOwnProperty(key));
        }
        return _results;
      }).call(this)) {
        return true;
      }
      if ((function() {
        var _ref, _results;
        _ref = this.atomicModifiers;
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          _results.push(object.hasOwnProperty(key));
        }
        return _results;
      }).call(this)) {
        return true;
      }
      return false;
    };

    Store.atomicModifiers = {
      "$set": "$set",
      "$unset": "$unset",
      "$push": "$push",
      "$pushAll": "$pushAll",
      "$pull": "$pull",
      "$pullAll": "$pullAll",
      "$inc": "$inc",
      "$pop": "$pop"
    };

    Store.queryOperators = {
      ">=": "$gte",
      "$gte": "$gte",
      ">": "$gt",
      "$gt": "$gt",
      "<=": "$lte",
      "$lte": "$lte",
      "<": "$lt",
      "$lt": "$lt",
      "$in": "$in",
      "$any": "$in",
      "$nin": "$nin",
      "$all": "$all",
      "=~": "$regex",
      "$m": "$regex",
      "$regex": "$regex",
      "$match": "$regex",
      "$notMatch": "$notMatch",
      "!~": "$nm",
      "$nm": "$nm",
      "=": "$eq",
      "$eq": "$eq",
      "!=": "$neq",
      "$neq": "$neq",
      "$null": "$null",
      "$notNull": "$notNull"
    };

    Store.booleans = {
      "true": true,
      "true": true,
      "TRUE": true,
      "1": true,
      1: true,
      1.0: true,
      "false": false,
      "false": false,
      "FALSE": false,
      "0": false,
      0: false,
      0.0: false
    };

    Store.prototype.supports = {};

    Store.prototype.serialize = function(data) {
      var i, item, _len;
      for (i = 0, _len = data.length; i < _len; i++) {
        item = data[i];
        data[i] = this.serializeModel(item);
      }
      return data;
    };

    Store.prototype.deserialize = function(models) {
      var i, model, _len;
      for (i = 0, _len = models.length; i < _len; i++) {
        model = models[i];
        models[i] = this.deserializeModel(model);
      }
      return models;
    };

    Store.prototype.serializeModel = function(attributes) {
      var klass;
      if (attributes instanceof Tower.Model) return attributes;
      klass = Tower.constant(this.className);
      return new klass(attributes);
    };

    Store.prototype.deserializeModel = function(data) {
      if (data instanceof Tower.Model) {
        return data.attributes;
      } else {
        return data;
      }
    };

    function Store(options) {
      if (options == null) options = {};
      this.name = options.name;
      this.className = options.type || Tower.namespaced(Tower.Support.String.camelize(Tower.Support.String.singularize(this.name)));
    }

    Store.prototype._defaultOptions = function(options) {
      return options;
    };

    Store.prototype.load = function(records) {};

    Store.prototype.fetch = function() {};

    Store.prototype.schema = function() {
      return Tower.constant(this.className).fields();
    };

    Store.prototype.supports = function(key) {
      return this.constructor.supports[key] === true;
    };

    Store.prototype._mapKeys = function(key, records) {
      return _.map(records, function(record) {
        return record.get(key);
      });
    };

    return Store;

  })(Tower.Class);

  Tower.Store.Memory = (function(_super) {

    __extends(Memory, _super);

    Memory.stores = function() {
      return this._stores || (this._stores = []);
    };

    Memory.clear = function() {
      var store, stores, _i, _len;
      stores = this.stores();
      for (_i = 0, _len = stores.length; _i < _len; _i++) {
        store = stores[_i];
        store.clear();
      }
      this._stores.length = 0;
      return this._stores;
    };

    function Memory(options) {
      Memory.__super__.constructor.call(this, options);
      this.initialize();
    }

    Memory.prototype.initialize = function() {
      this.constructor.stores().push(this);
      this.records = {};
      return this.lastId = 0;
    };

    return Memory;

  })(Tower.Store);

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
      var record,
        _this = this;
      record = null;
      options.limit = 1;
      this.find(conditions, options, function(error, records) {
        record = records[0] || null;
        if (callback) return callback.call(_this, error, record);
      });
      return record;
    },
    count: function(conditions, options, callback) {
      var result,
        _this = this;
      result = 0;
      this.find(conditions, options, function(error, records) {
        result = records.length;
        if (callback) return callback.call(_this, error, result);
      });
      return result;
    },
    exists: function(conditions, options, callback) {
      var result,
        _this = this;
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

  Tower.Store.Memory.Persistence = {
    load: function(data) {
      var record, records, _i, _len;
      records = Tower.Support.Object.toArray(data);
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        this.loadOne(this.serializeModel(record));
      }
      return records;
    },
    loadOne: function(record) {
      record.persistent = true;
      return this.records[record.get("id").toString()] = record;
    },
    create: function(data, options, callback) {
      var attributes, result, _i, _len;
      result = null;
      if (Tower.Support.Object.isArray(data)) {
        result = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          attributes = data[_i];
          result.push(this.createOne(attributes));
        }
      } else {
        result = this.createOne(data);
      }
      if (callback) callback.call(this, null, result);
      return result;
    },
    createOne: function(record) {
      var attributes;
      attributes = this.deserializeModel(record);
      if (attributes.id == null) attributes.id = this.generateId().toString();
      return this.loadOne(this.serializeModel(record));
    },
    update: function(updates, query, options, callback) {
      var _this = this;
      return this.find(query, options, function(error, records) {
        var record, _i, _len;
        if (error) return callback(error);
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          _this.updateOne(record, updates);
        }
        callback.call(_this, error, records);
        return records;
      });
    },
    updateOne: function(record, updates) {
      var key, value;
      for (key in updates) {
        value = updates[key];
        this._updateAttribute(record.attributes, key, value);
      }
      return record;
    },
    destroy: function(query, options, callback) {
      return this.find(query, options, function(error, records) {
        var record, _i, _len;
        if (error) return callback(error);
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          this.destroyOne(record);
        }
        if (callback) callback.call(this, error, records);
        return records;
      });
    },
    destroyOne: function(record) {
      return delete this.records[record.get("id").toString()];
    }
  };

  Tower.Store.Memory.Serialization = {
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
    _incAtomicUpdate: function(attributes, value) {
      var _key, _value;
      for (_key in value) {
        _value = value[_key];
        attributes[_key] || (attributes[_key] = 0);
        attributes[_key] += _value;
      }
      return attributes;
    }
  };

  Tower.Store.Memory.include(Tower.Store.Memory.Finders);

  Tower.Store.Memory.include(Tower.Store.Memory.Persistence);

  Tower.Store.Memory.include(Tower.Store.Memory.Serialization);

  Tower.Store.Ajax = (function(_super) {
    var sync;

    __extends(Ajax, _super);

    Ajax.requests = [];

    Ajax.enabled = true;

    Ajax.pending = false;

    function Ajax() {
      Ajax.__super__.constructor.apply(this, arguments);
      this.deleted = {};
    }

    Ajax.defaults = {
      contentType: 'application/json',
      dataType: 'json',
      processData: false,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    Ajax.ajax = function(params, defaults) {
      return $.ajax($.extend({}, this.defaults, defaults, params));
    };

    Ajax.toJSON = function(record, format, method) {
      var data;
      data = {};
      data[Tower.Support.String.camelize(record.constructor.name, true)] = record;
      data.format = format;
      data._method = method;
      return JSON.stringify(data);
    };

    Ajax.disable = function(callback) {
      if (this.enabled) {
        this.enabled = false;
        callback();
        return this.enabled = true;
      } else {
        return callback();
      }
    };

    Ajax.requestNext = function() {
      var next;
      next = this.requests.shift();
      if (next) {
        return this.request(next);
      } else {
        return this.pending = false;
      }
    };

    Ajax.request = function(callback) {
      var _this = this;
      return (callback()).complete(function() {
        return _this.requestNext();
      });
    };

    Ajax.queue = function(callback) {
      if (!this.enabled) return;
      if (this.pending) {
        this.requests.push(callback);
      } else {
        this.pending = true;
        this.request(callback);
      }
      return callback;
    };

    Ajax.prototype.success = function(record, options) {
      var _this = this;
      if (options == null) options = {};
      return function(data, status, xhr) {
        var _ref;
        Ajax.disable(function() {
          if (data && !Tower.Support.Object.isBlank(data)) {
            return record.updateAttributes(data, {
              sync: false
            });
          }
        });
        return (_ref = options.success) != null ? _ref.apply(_this.record) : void 0;
      };
    };

    Ajax.prototype.failure = function(record, options) {
      var _this = this;
      if (options == null) options = {};
      return function(xhr, statusText, error) {
        var _ref;
        return (_ref = options.error) != null ? _ref.apply(record) : void 0;
      };
    };

    Ajax.prototype.queue = function(callback) {
      return this.constructor.queue(callback);
    };

    Ajax.prototype.request = function() {
      var _ref;
      return (_ref = this.constructor).request.apply(_ref, arguments);
    };

    Ajax.prototype.ajax = function() {
      var _ref;
      return (_ref = this.constructor).ajax.apply(_ref, arguments);
    };

    Ajax.prototype.toJSON = function() {
      var _ref;
      return (_ref = this.constructor).toJSON.apply(_ref, arguments);
    };

    Ajax.prototype.create = function(data, options, callback) {
      var _this = this;
      if (options.sync !== false) {
        return Ajax.__super__.create.call(this, data, options, function(error, records) {
          if (callback) callback.call(_this, error, records);
          return _this.createRequest(records, options);
        });
      } else {
        return Ajax.__super__.create.apply(this, arguments);
      }
    };

    Ajax.prototype.update = function(updates, query, options, callback) {
      var _this = this;
      if (options.sync === true) {
        return Ajax.__super__.update.call(this, updates, query, options, function(error, result) {
          if (callback) callback.call(_this, error, result);
          return _this.updateRequest(result, options);
        });
      } else {
        return Ajax.__super__.update.apply(this, arguments);
      }
    };

    Ajax.prototype.destroy = function(query, options, callback) {
      var _this = this;
      if (options.sync !== false) {
        return Ajax.__super__.destroy.call(this, query, options, function(error, result) {
          return _this.destroyRequest(result, options);
        });
      } else {
        return Ajax.__super__.destroy.apply(this, arguments);
      }
    };

    Ajax.prototype.createRequest = function(records, options) {
      var json,
        _this = this;
      if (options == null) options = {};
      json = this.toJSON(records);
      Tower.urlFor(records.constructor);
      return this.queue(function() {
        var params;
        params = {
          url: url,
          type: "POST",
          data: json
        };
        return _this.ajax(options, params).success(_this.createSuccess(records)).error(_this.createFailure(records));
      });
    };

    Ajax.prototype.createSuccess = function(record) {
      var _this = this;
      return function(data, status, xhr) {
        var id;
        id = record.id;
        record = _this.find(id);
        _this.records[data.id] = record;
        delete _this.records[id];
        return record.updateAttributes(data);
      };
    };

    Ajax.prototype.createFailure = function(record) {
      return this.failure(record);
    };

    Ajax.prototype.updateRequest = function(record, options, callback) {
      var _this = this;
      return this.queue(function() {
        var params;
        params = {
          type: "PUT",
          data: _this.toJSON(record)
        };
        return _this.ajax({}, params).success(_this.updateSuccess(record)).error(_this.updateFailure(record));
      });
    };

    Ajax.prototype.updateSuccess = function(record) {
      var _this = this;
      return function(data, status, xhr) {
        record = Tower.constant(_this.className).find(record.id);
        return record.updateAttributes(data);
      };
    };

    Ajax.prototype.updateFailure = function(record) {
      var _this = this;
      return function(xhr, statusText, error) {};
    };

    Ajax.prototype.destroyRequest = function(record, options, callback) {
      var _this = this;
      return this.queue(function() {
        var params;
        params = {
          type: "DELETE",
          data: _this.toJSON(record)
        };
        return _this.ajax({}, params).success(_this.destroySuccess(record)).error(_this.destroyFailure(record));
      });
    };

    Ajax.prototype.destroySuccess = function(data) {
      var _this = this;
      return function(data, status, xhr) {
        return delete _this.deleted[data.id];
      };
    };

    Ajax.prototype.destroyFailure = function(record) {
      var _this = this;
      return function(xhr, statusText, error) {};
    };

    Ajax.prototype.findRequest = function(options) {
      var _this = this;
      return this.queue(function() {
        var params;
        params = {
          type: "GET",
          data: _this.toJSON(record)
        };
        return _this.ajax({}, params).success(_this.findSuccess(options)).error(_this.findFailure(options));
      });
    };

    Ajax.prototype.findSuccess = function(options) {
      var _this = this;
      return function(data, status, xhr) {
        if (Tower.Support.Object.isPresent(data)) return _this.load(data);
      };
    };

    Ajax.prototype.findFailure = function(record) {
      var _this = this;
      return function(xhr, statusText, error) {};
    };

    Ajax.prototype.findOneRequest = function(options, callback) {
      var _this = this;
      return this.queue(function() {
        var params;
        params = {
          type: "GET",
          data: _this.toJSON(record)
        };
        return _this.ajax({}, params).success(_this.findSuccess(options)).error(_this.findFailure(options));
      });
    };

    Ajax.prototype.findOneSuccess = function(options) {
      var _this = this;
      return function(data, status, xhr) {};
    };

    Ajax.prototype.findOneFailure = function(options) {
      var _this = this;
      return function(xhr, statusText, error) {};
    };

    sync = function() {
      var _this = this;
      return this.all(function(error, records) {
        var changes, record, _i, _len;
        changes = {
          create: [],
          update: [],
          destroy: []
        };
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          if (record.syncAction) changes[record.syncAction].push(record);
        }
        if (changes.create != null) _this.createRequest(changes.create);
        if (changes.update != null) _this.updateRequest(changes.update);
        if (changes.destroy != null) _this.destroyRequest(changes.destroy);
        return true;
      });
    };

    Ajax.prototype.refresh = function() {};

    Ajax.prototype.fetch = function() {};

    return Ajax;

  })(Tower.Store.Memory);

  Tower.Store.Local = (function(_super) {

    __extends(Local, _super);

    function Local() {
      Local.__super__.constructor.apply(this, arguments);
    }

    Local.prototype.initialize = function() {
      return this.lastId = 0;
    };

    Local.prototype._setRecord = function(record) {};

    Local.prototype._getRecord = function(key) {
      return this;
    };

    Local.prototype._removeRecord = function(key) {
      return delete this.records[record.id];
    };

    return Local;

  })(Tower.Store.Memory);

  Tower.Model = (function(_super) {

    __extends(Model, _super);

    Model._relationship = false;

    Model.relationship = function(value) {
      if (value == null) value = true;
      return this._relationship = value;
    };

    Model.configure = function(object) {
      this.config || (this.config = {});
      if (typeof object === "function") object = object.call(this);
      _.extend(this.config, object);
      return this;
    };

    Model.defaults = function(object) {
      var key, value;
      for (key in object) {
        value = object[key];
        this["default"](key, value);
      }
      return this._defaults;
    };

    Model["default"] = function(key, value) {
      this._defaults || (this._defaults = {});
      return this._defaults[key] = value;
    };

    function Model(attrs, options) {
      this.initialize(attrs, options);
    }

    Model.prototype.initialize = function(attrs, options) {
      var attributes, definition, definitions, key, name, value, _results;
      if (attrs == null) attrs = {};
      if (options == null) options = {};
      definitions = this.constructor.fields();
      attributes = {};
      for (name in definitions) {
        definition = definitions[name];
        if (!attrs.hasOwnProperty(name)) {
          attributes[name] = definition.defaultValue(this);
        }
      }
      this.attributes = attributes;
      this.relations = {};
      this.changes = {
        before: {},
        after: {}
      };
      this.errors = {};
      this.operations = [];
      this.operationIndex = -1;
      this.readOnly = options.hasOwnProperty("readOnly") ? options.readOnly : false;
      this.persistent = options.hasOwnProperty("persistent") ? options.persisted : false;
      _results = [];
      for (key in attrs) {
        value = attrs[key];
        _results.push(this.attributes[key] = value);
      }
      return _results;
    };

    return Model;

  })(Tower.Class);

  Tower.Model.Scope = (function(_super) {

    __extends(Scope, _super);

    function Scope(options) {
      if (options == null) options = {};
      this.model = options.model;
      this.criteria = options.criteria || new Tower.Model.Criteria;
      this.store = this.model.store();
    }

    Scope.prototype.toQuery = function(sortDirection) {
      return this.toCriteria(sortDirection).toQuery();
    };

    Scope.prototype.compile = function(sortDirection) {
      var criteria, sort;
      criteria = this.criteria.clone();
      if (sortDirection || !criteria._order.length > 0) {
        sort = this.model.defaultSort();
        if (sort) criteria[sortDirection || sort.direction](sort.name);
      }
      return criteria;
    };

    Scope.prototype.toCriteria = Scope.prototype.compile;

    Scope.prototype.merge = function(scope) {
      return this.criteria.merge(scope.criteria);
    };

    Scope.prototype.clone = function() {
      return new this.constructor({
        model: this.model,
        criteria: this.criteria.clone()
      });
    };

    Scope.prototype._extractArgsForBuild = function(args) {
      var callback, criteria;
      criteria = this.criteria.clone();
      args = Tower.Support.Array.args(args);
      callback = Tower.Support.Array.extractBlock(args);
      criteria.addData(args);
      return [criteria, callback];
    };

    Scope.prototype._extractArgsForCreate = function(args) {
      return this._extractArgsForBuild(args);
    };

    Scope.prototype._extractArgsForUpdate = function(args) {
      var callback, criteria, ids, object, updates, _i, _len;
      criteria = this.criteria.clone();
      args = _.flatten(Tower.Support.Array.args(args));
      callback = Tower.Support.Array.extractBlock(args);
      updates = args.pop();
      if (!(updates && typeof updates === "object")) {
        throw new Error("Must pass in updates hash");
      }
      if (args.length) {
        ids = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          object = args[_i];
          if (object == null) continue;
          ids.push(object instanceof Tower.Model ? object.get('id') : object);
        }
        criteria.where({
          id: {
            $in: ids
          }
        });
      }
      return [criteria, callback];
    };

    Scope.prototype._extractArgsForDestroy = function(args) {
      return this._extractArgsForFind(args);
    };

    Scope.prototype._extractArgsForFind = function(args) {
      var callback, criteria, ids, object, _i, _len;
      criteria = this.criteria.clone();
      args = _.flatten(Tower.Support.Array.args(args));
      callback = Tower.Support.Array.extractBlock(args);
      if (args.length) {
        ids = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          object = args[_i];
          if (object == null) continue;
          ids.push(object instanceof Tower.Model ? object.get('id') : object);
        }
        criteria.where({
          id: {
            $in: ids
          }
        });
      }
      return [criteria, callback];
    };

    return Scope;

  })(Tower.Class);

  Tower.Model.Scope.Finders = {
    ClassMethods: {
      finderMethods: ["find", "all", "first", "last", "count", "exists"]
    },
    find: function() {
      return this._find.apply(this, this._extractArgsForFind(arguments));
    },
    first: function(callback) {
      var criteria;
      criteria = this.compile();
      criteria.defaultSort("asc");
      return this.store.findOne(criteria, callback);
    },
    last: function(callback) {
      var criteria;
      criteria = this.compile();
      criteria.defaultSort("desc");
      return this.store.findOne(conditions, options, callback);
    },
    all: function(callback) {
      return this.store.find(this.compile(), callback);
    },
    count: function(callback) {
      return this.store.count(this.compile(), callback);
    },
    exists: function(callback) {
      return this.store.exists(this.compile(), callback);
    },
    batch: function() {
      return this;
    },
    fetch: function() {},
    _find: function(criteria, callback) {
      if (criteria.options.findOne) {
        return this.store.findOne(criteria, callback);
      } else {
        return this.store.find(criteria, callback);
      }
    }
  };

  Tower.Model.Scope.Persistence = {
    ClassMethods: {
      persistenceMethods: ["create", "update", "destroy"]
    },
    build: function() {
      return this._build.apply(this, this.toCriteria(arguments, {
        data: true
      }));
    },
    create: function() {
      return this._create.apply(this, this._extractArgsForCreate(arguments));
    },
    update: function() {
      return this._update.apply(this, this._extractArgsForUpdate(arguments));
    },
    destroy: function() {
      return this._destroy.apply(this, this._extractArgsForDestroy(arguments));
    },
    _build: function(criteria, callback) {
      var attributes, data, item, object, result, store, _i, _len;
      store = this.store;
      attributes = criteria.build();
      data = criteria.data;
      result = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        if (item instanceof Tower.Model) {
          _.extend(item.attributes, attributes, item.attributes);
        } else {
          object = store.serializeModel(_.extend({}, attributes, item));
        }
        result.push(object);
      }
      if (criteria.returnArray) {
        return result;
      } else {
        return result[0];
      }
    },
    _create: function(criteria, callback) {
      var iterator, records, returnArray,
        _this = this;
      if (criteria.instantiate) {
        returnArray = criteria.returnArray;
        criteria.returnArray = true;
        records = this.build(criteria);
        criteria.returnArray = returnArray;
        iterator = function(record, next) {
          if (record) {
            return record.save(next);
          } else {
            return next();
          }
        };
        return Tower.async(records, iterator, function(error) {
          if (!callback) {
            if (error) throw error;
          } else {
            if (error) return callback(error);
            if (returnArray) {
              return callback(error, records);
            } else {
              return callback(error, records[0]);
            }
          }
        });
      } else {
        return this.store.create(criteria, callback);
      }
    },
    _update: function(criteria, callback) {
      var iterator;
      if (criteria.instantiate) {
        iterator = function(record, next) {
          return record.updateAttributes(criteria.data, next);
        };
        return this._each(criteria, iterator, callback);
      } else {
        return this.store.update(criteria, callback);
      }
    },
    _destroy: function(criteria) {
      var iterator;
      if (criteria.instantiate) {
        iterator = function(record, next) {
          return record.destroy(next);
        };
        return this._each(criteria, iterator, callback);
      } else {
        return this.store.destroy(criteria, callback);
      }
    },
    _each: function(criteria, iterator, callback) {
      var _this = this;
      return this.store.find(criteria, function(error, records) {
        if (error) {
          return callback.call(_this, error, records);
        } else {
          return Tower.parallel(records, iterator, function(error) {
            if (!callback) {
              if (error) throw error;
            } else {
              if (callback) return callback.call(_this, error, records);
            }
          });
        }
      });
    }
  };

  Tower.Model.Scope.Queries = {
    ClassMethods: {
      queryMethods: ["where", "order", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within", "allIn", "allOf", "alsoIn", "anyIn", "anyOf", "near", "notIn"],
      queryOperators: {
        ">=": "$gte",
        "$gte": "$gte",
        ">": "$gt",
        "$gt": "$gt",
        "<=": "$lte",
        "$lte": "$lte",
        "<": "$lt",
        "$lt": "$lt",
        "$in": "$in",
        "$nin": "$nin",
        "$any": "$any",
        "$all": "$all",
        "=~": "$regex",
        "$m": "$regex",
        "$regex": "$regex",
        "$match": "$match",
        "$notMatch": "$notMatch",
        "!~": "$nm",
        "$nm": "$nm",
        "=": "$eq",
        "$eq": "$eq",
        "!=": "$neq",
        "$neq": "$neq",
        "$null": "$null",
        "$notNull": "$notNull"
      }
    }
  };

  Tower.Model.Scope.include(Tower.Model.Scope.Finders);

  Tower.Model.Scope.include(Tower.Model.Scope.Persistence);

  Tower.Model.Scope.include(Tower.Model.Scope.Queries);

  _ref = Tower.Model.Scope.queryMethods;
  _fn = function(key) {
    return Tower.Model.Scope.prototype[key] = function() {
      var clone, _ref2;
      clone = this.clone();
      (_ref2 = clone.criteria)[key].apply(_ref2, arguments);
      return clone;
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    _fn(key);
  }

  Tower.Model.Criteria = (function() {

    function Criteria(args) {
      if (args == null) args = {};
      args.where || (args.where = []);
      args.joins || (args.joins = {});
      args.order || (args.order = []);
      args.data || (args.data = []);
      args.options || (args.options = {});
      if (!args.options.hasOwnProperty("instantiate")) {
        args.options.instantiate = true;
      }
      this.values = args;
    }

    Criteria.prototype.addData = function(args) {
      if (args.length > 1 || _.isArray(args[0])) {
        this.values.data = _.flatten(args);
        return this.values.returnArray = true;
      } else {
        this.values.data = [args[0]];
        return this.values.returnArray = false;
      }
    };

    Criteria.prototype.options = function(options) {
      return this.values.options = _.extend(this.values.options, options);
    };

    Criteria.prototype.joins = function(object) {
      var joins, key, _base, _j, _len2;
      joins = (_base = this.values).joins || (_base.joins = {});
      if (Tower.Support.Object.isArray(object)) {
        for (_j = 0, _len2 = object.length; _j < _len2; _j++) {
          key = object[_j];
          joins[key] = true;
        }
      } else if (typeof object === "string") {
        joins[object] = true;
      } else {
        Tower.Support.Object.extend(joins, object);
      }
      return this;
    };

    Criteria.prototype.except = function() {
      var keys;
      keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.values.except = keys;
    };

    Criteria.prototype.where = function(conditions) {
      if (conditions instanceof Tower.Model.Criteria) {
        return this.merge(conditions);
      } else {
        return this.values.where.push(conditions);
      }
    };

    Criteria.prototype.order = function(attribute, direction) {
      var _base;
      if (direction == null) direction = "asc";
      (_base = this.values).order || (_base.order = []);
      return this.values.order.push([attribute, direction]);
    };

    Criteria.prototype.sort = Criteria.prototype.order;

    Criteria.prototype.defaultSort = function(direction) {
      return this;
    };

    Criteria.prototype.asc = function() {
      var attribute, attributes, _j, _len2, _results;
      attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_j = 0, _len2 = attributes.length; _j < _len2; _j++) {
        attribute = attributes[_j];
        _results.push(this.order(attribute));
      }
      return _results;
    };

    Criteria.prototype.desc = function() {
      var attribute, attributes, _j, _len2, _results;
      attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_j = 0, _len2 = attributes.length; _j < _len2; _j++) {
        attribute = attributes[_j];
        _results.push(this.order(attribute, "desc"));
      }
      return _results;
    };

    Criteria.prototype.allIn = function(attributes) {
      return this.values.whereOperator("$all", attributes);
    };

    Criteria.prototype.anyIn = function(attributes) {
      return this.values.whereOperator("$any", attributes);
    };

    Criteria.prototype.notIn = function(attributes) {
      return this.values.whereOperator("$nin", attributes);
    };

    Criteria.prototype.offset = function(number) {
      return this.values.offset = number;
    };

    Criteria.prototype.limit = function(number) {
      return this.values.limit = number;
    };

    Criteria.prototype.select = function() {
      return this.values.fields = Tower.Support.Array.args(arguments);
    };

    Criteria.prototype.includes = function() {
      return this.values.includes = Tower.Support.Array.args(arguments);
    };

    Criteria.prototype.uniq = function(value) {
      return this.values.uniq = value;
    };

    Criteria.prototype.page = function(page) {
      return this.offset((page - 1) * this.values.limit || 20);
    };

    Criteria.prototype.paginate = function(options) {
      var limit, page;
      limit = options.perPage || options.limit;
      page = options.page || 1;
      this.limit(limit);
      return this.offset((page - 1) * limit);
    };

    Criteria.prototype.clone = function() {
      return new this.constructor(this.attributes());
    };

    Criteria.prototype.merge = function(criteria) {
      var attributes, values;
      attributes = criteria.attributes();
      values = this.values;
      if (attributes._where.length > 0) {
        values.where = values.where.concat(attributes._where);
      }
      if (attributes._order.length > 0) {
        values.order = values.order.concat(attributes._order);
      }
      if (attributes._offset != null) values.offset = attributes._offset;
      if (attributes._limit != null) values.limit = attributes._limit;
      if (attributes._fields) values.fields = attributes._fields;
      if (attributes._offset != null) values.offset = attributes._offset;
      if (attributes._joins != null) values.joins = attributes._joins;
      if (attributes._through != null) values.through = attributes._through;
      return this;
    };

    Criteria.prototype.conditions = function() {
      var conditions, result, _j, _len2, _ref2;
      result = {};
      _ref2 = this.values.where;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        conditions = _ref2[_j];
        Tower.Support.Object.deepMergeWithArrays(result, conditions);
      }
      return result;
    };

    Criteria.prototype.attributes = function(to) {
      var values;
      if (to == null) to = {};
      values = this.values;
      to.where = values.where.concat();
      to.order = values.order.concat();
      if (this.values.offset != null) to.offset = values.offset;
      if (this.values.limit != null) to.limit = values.limit;
      if (this.values.fields) to.fields = values.fields;
      if (this.values.includes) to.includes = values.includes;
      if (this.values.joins != null) to.joins = values.joins;
      if (this.values.through != null) to.through = values.through;
      return to;
    };

    Criteria.prototype.build = function() {
      var attributes, conditions, key, value, _j, _key, _len2, _ref2, _value;
      attributes = {};
      _ref2 = this.values.where;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        conditions = _ref2[_j];
        for (key in conditions) {
          value = conditions[key];
          if (Tower.Store.isKeyword(key)) {
            for (_key in value) {
              _value = value[_key];
              attributes[_key] = _value;
            }
          } else if (Tower.Support.Object.isHash(value) && value.constructor.name === "Object" && Tower.Store.hasKeyword(value)) {
            for (_key in value) {
              _value = value[_key];
              attributes[key] = _value;
            }
          } else {
            attributes[key] = value;
          }
        }
      }
      for (key in attributes) {
        value = attributes[key];
        if (value === void 0) delete attributes[key];
      }
      return attributes;
    };

    Criteria.prototype.mergeOptions = function(options) {
      return options;
    };

    Criteria.prototype._whereOperator = function(operator, attributes) {
      var key, query, value;
      query = {};
      for (key in attributes) {
        value = attributes[key];
        query[key] = {};
        query[key][operator] = value;
      }
      return this.where(query);
    };

    return Criteria;

  })();

  Tower.Model.Dirty = {
    operation: function(block) {
      var completeOperation,
        _this = this;
      if (this._currentOperation) return block();
      if (this.operationIndex !== this.operations.length) {
        this.operations.splice(this.operationIndex, this.operations.length);
      }
      this._currentOperation = {};
      completeOperation = function() {
        _this.operations.push(_this._currentOperation);
        delete _this._currentOperation;
        return _this.operationIndex = _this.operations.length;
      };
      switch (block.length) {
        case 0:
          block.call(this);
          return completeOperation();
        default:
          return block.call(this, function() {
            return completeOperation();
          });
      }
    },
    undo: function(amount) {
      var key, nextIndex, operation, operations, prevIndex, value, _j, _len2, _ref2;
      if (amount == null) amount = 1;
      prevIndex = this.operationIndex;
      nextIndex = this.operationIndex = Math.max(this.operationIndex - amount, -1);
      if (prevIndex === nextIndex) return;
      operations = this.operations.slice(nextIndex, prevIndex).reverse();
      for (_j = 0, _len2 = operations.length; _j < _len2; _j++) {
        operation = operations[_j];
        _ref2 = operation.$before;
        for (key in _ref2) {
          value = _ref2[key];
          this.attributes[key] = value;
        }
      }
      return this;
    },
    redo: function(amount) {
      var key, nextIndex, operation, operations, prevIndex, value, _j, _len2, _ref2;
      if (amount == null) amount = 1;
      prevIndex = this.operationIndex;
      nextIndex = this.operationIndex = Math.min(this.operationIndex + amount, this.operations.length);
      if (prevIndex === nextIndex) return;
      operations = this.operations.slice(prevIndex, nextIndex);
      for (_j = 0, _len2 = operations.length; _j < _len2; _j++) {
        operation = operations[_j];
        _ref2 = operation.$after;
        for (key in _ref2) {
          value = _ref2[key];
          this.attributes[key] = value;
        }
      }
      return this;
    },
    isDirty: function() {
      return Tower.Support.Object.isPresent(this.changes);
    },
    attributeChanged: function(name) {
      var after, before, key, value, _ref2;
      _ref2 = this.changes, before = _ref2.before, after = _ref2.after;
      if (Tower.Support.Object.isBlank(before)) return false;
      before = before[name];
      for (key in after) {
        value = after[key];
        if (value.hasOwnProperty(name)) {
          after = value;
          break;
        }
      }
      if (!after) return false;
      return before !== after;
    },
    attributeChange: function(name) {
      var change;
      change = this.changes[name];
      if (!change) return;
      return change[1];
    },
    attributeWas: function(name) {
      var change;
      change = this.changes.before[name];
      if (change === void 0) return;
      return change;
    },
    resetAttribute: function(name) {
      var array;
      array = this.changes[name];
      if (array) this.set(name, array[0]);
      return this;
    },
    toUpdates: function() {
      var array, attributes, key, result, _ref2;
      result = {};
      attributes = this.attributes;
      _ref2 = this.changes;
      for (key in _ref2) {
        array = _ref2[key];
        result[key] = attributes[key];
      }
      result.updatedAt || (result.updatedAt = new Date);
      return result;
    },
    _attributeChange: function(attribute, value) {
      var array, beforeValue, _base;
      array = (_base = this.changes)[attribute] || (_base[attribute] = []);
      beforeValue = array[0] || (array[0] = this.attributes[attribute]);
      array[1] = value;
      if (array[0] === array[1]) array = null;
      if (array) {
        this.changes[attribute] = array;
      } else {
        delete this.changes[attribute];
      }
      return beforeValue;
    },
    _resetChanges: function() {
      return this.changes = {
        before: {},
        after: {}
      };
    }
  };

  Tower.Model.Conversion = {
    ClassMethods: {
      baseClass: function() {
        if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Model) {
          return this.__super__.constructor.baseClass();
        } else {
          return this;
        }
      },
      toParam: function() {
        if (this === Tower.Model) return;
        return this.metadata().paramNamePlural;
      },
      toKey: function() {
        return this.metadata().paramName;
      },
      url: function(options) {
        var url;
        return this._url = (function() {
          switch (typeof options) {
            case "object":
              if (options.parent) {
                return url = "/" + (Tower.Support.String.parameterize(Tower.Support.String.pluralize(options.parent))) + "/:" + (Tower.Support.String.camelize(options.parent, true)) + "/" + (this.toParam());
              }
              break;
            default:
              return options;
          }
        }).call(this);
      },
      collectionName: function() {
        return Tower.Support.String.camelize(Tower.Support.String.pluralize(this.name), true);
      },
      resourceName: function() {
        return Tower.Support.String.camelize(this.name, true);
      },
      metadata: function() {
        var className, classNamePlural, controllerName, metadata, modelName, name, namePlural, namespace, paramName, paramNamePlural;
        className = this.name;
        metadata = this.metadata[className];
        if (metadata) return metadata;
        namespace = Tower.namespace();
        name = Tower.Support.String.camelize(className, true);
        namePlural = Tower.Support.String.pluralize(name);
        classNamePlural = Tower.Support.String.pluralize(className);
        paramName = Tower.Support.String.parameterize(name);
        paramNamePlural = Tower.Support.String.parameterize(namePlural);
        modelName = "" + namespace + "." + className;
        controllerName = "" + namespace + "." + classNamePlural + "Controller";
        return this.metadata[className] = {
          name: name,
          namePlural: namePlural,
          className: className,
          classNamePlural: classNamePlural,
          paramName: paramName,
          paramNamePlural: paramNamePlural,
          modelName: modelName,
          controllerName: controllerName
        };
      }
    },
    toLabel: function() {
      return this.className();
    },
    toPath: function() {
      var param, result;
      result = this.constructor.toParam();
      if (result === void 0) return "/";
      param = this.toParam();
      if (param) result += "/" + param;
      return result;
    },
    toParam: function() {
      var id;
      id = this.get("id");
      if (id != null) {
        return String(id);
      } else {
        return null;
      }
    },
    toKey: function() {
      return this.constructor.tokey();
    },
    toCacheKey: function() {},
    toModel: function() {
      return this;
    },
    metadata: function() {
      return this.constructor.metadata();
    }
  };

  Tower.Model.Inheritance = {
    _computeType: function() {}
  };

  Tower.Model.Relation = (function(_super) {

    __extends(Relation, _super);

    function Relation(owner, name, options) {
      var key, value;
      if (options == null) options = {};
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.owner = owner;
      this.name = name;
      this.initialize(options);
    }

    Relation.prototype.initialize = function(options) {
      var name, owner;
      owner = this.owner;
      name = this.name;
      this.type = options.type || Tower.Support.String.camelize(Tower.Support.String.singularize(name));
      this.ownerType = Tower.namespaced(owner.name);
      this.dependent || (this.dependent = false);
      this.counterCache || (this.counterCache = false);
      if (!this.hasOwnProperty("cache")) this.cache = false;
      if (!this.hasOwnProperty("readOnly")) this.readOnly = false;
      if (!this.hasOwnProperty("validate")) this.validate = false;
      if (!this.hasOwnProperty("autoSave")) this.autoSave = false;
      if (!this.hasOwnProperty("touch")) this.touch = false;
      this.inverseOf || (this.inverseOf = void 0);
      this.polymorphic = options.hasOwnProperty("as") || !!options.polymorphic;
      if (!this.hasOwnProperty("default")) this["default"] = false;
      this.singularName = Tower.Support.String.camelize(owner.name, true);
      this.pluralName = Tower.Support.String.pluralize(owner.name);
      this.singularTargetName = Tower.Support.String.singularize(name);
      this.pluralTargetName = Tower.Support.String.pluralize(name);
      this.targetType = this.type;
      if (!this.foreignKey) {
        if (this.as) {
          this.foreignKey = "" + this.as + "Id";
        } else {
          this.foreignKey = "" + this.singularName + "Id";
        }
      }
      if (this.polymorphic) {
        this.foreignType || (this.foreignType = "" + this.as + "Type");
      }
      if (this.cache) {
        if (typeof this.cache === "string") {
          this.cacheKey = this.cache;
          this.cache = true;
        } else {
          this.cacheKey = this.singularTargetName + "Ids";
        }
        this.owner.field(this.cacheKey, {
          type: "Array",
          "default": []
        });
      }
      if (this.counterCache) {
        if (typeof this.counterCache === "string") {
          this.counterCacheKey = this.counterCache;
          this.counterCache = true;
        } else {
          this.counterCacheKey = "" + this.singularTargetName + "Count";
        }
        this.owner.field(this.counterCacheKey, {
          type: "Integer",
          "default": 0
        });
      }
      return this.owner.prototype[name] = function() {
        return this.relation(name);
      };
    };

    Relation.prototype.scoped = function(record) {
      return new this.constructor.Scope({
        model: this.klass(),
        owner: record,
        relation: this
      });
    };

    Relation.prototype.targetKlass = function() {
      return Tower.constant(this.targetType);
    };

    Relation.prototype.klass = function() {
      return Tower.constant(this.type);
    };

    Relation.prototype.inverse = function() {
      var name, relation, relations;
      if (this._inverse) return this._inverse;
      relations = this.targetKlass().relations();
      if (this.inverseOf) {
        return relations[this.inverseOf];
      } else {
        for (name in relations) {
          relation = relations[name];
          if (relation.inverseOf === this.name) return relation;
        }
        for (name in relations) {
          relation = relations[name];
          if (relation.targetType === this.ownerType) return relation;
        }
      }
      return null;
    };

    Relation.Scope = (function(_super2) {

      __extends(Scope, _super2);

      Scope.prototype.isConstructable = function() {
        return !!!this.relation.polymorphic;
      };

      function Scope(options) {
        if (options == null) options = {};
        Scope.__super__.constructor.call(this, options);
        this.owner = options.owner;
        this.relation = options.relation;
        this.records = [];
      }

      Scope.prototype.clone = function() {
        return new this.constructor({
          model: this.model,
          criteria: this.criteria.clone(),
          owner: this.owner,
          relation: this.relation
        });
      };

      Scope.prototype.setInverseInstance = function(record) {
        var inverse;
        if (record && this.invertibleFor(record)) {
          inverse = record.relation(this.inverseReflectionFor(record).name);
          return inverse.target = owner;
        }
      };

      Scope.prototype.invertibleFor = function(record) {
        return true;
      };

      Scope.prototype.inverse = function(record) {};

      return Scope;

    })(Tower.Model.Scope);

    return Relation;

  })(Tower.Class);

  Tower.Model.Relation.BelongsTo = (function(_super) {

    __extends(BelongsTo, _super);

    function BelongsTo(owner, name, options) {
      if (options == null) options = {};
      BelongsTo.__super__.constructor.call(this, owner, name, options);
      this.foreignKey = "" + name + "Id";
      owner.field(this.foreignKey, {
        type: "Id"
      });
      if (this.polymorphic) {
        this.foreignType = "" + name + "Type";
        owner.field(this.foreignType, {
          type: "String"
        });
      }
      owner.prototype[name] = function() {
        return this.relation(name);
      };
      owner.prototype["build" + (Tower.Support.String.camelize(name))] = function(attributes, callback) {
        return this.buildRelation(name, attributes, callback);
      };
      owner.prototype["create" + (Tower.Support.String.camelize(name))] = function(attributes, callback) {
        return this.createRelation(name, attributes, callback);
      };
    }

    BelongsTo.Scope = (function(_super2) {

      __extends(Scope, _super2);

      function Scope() {
        Scope.__super__.constructor.apply(this, arguments);
      }

      Scope.prototype.toCriteria = function() {
        var criteria, relation;
        criteria = Scope.__super__.toCriteria.apply(this, arguments);
        relation = this.relation;
        criteria.where({
          id: {
            $in: [this.owner.get(relation.foreignKey)]
          }
        });
        return criteria;
      };

      return Scope;

    })(BelongsTo.Scope);

    return BelongsTo;

  })(Tower.Model.Relation);

  Tower.Model.Relation.HasMany = (function(_super) {

    __extends(HasMany, _super);

    function HasMany() {
      HasMany.__super__.constructor.apply(this, arguments);
    }

    HasMany.prototype.initialize = function(options) {
      if (this.through && !options.type) {
        options.type || (options.type = this.owner.relation(this.through).ownerType);
      }
      return HasMany.__super__.initialize.apply(this, arguments);
    };

    HasMany.Scope = (function(_super2) {

      __extends(Scope, _super2);

      function Scope() {
        Scope.__super__.constructor.apply(this, arguments);
      }

      Scope.prototype.create = function() {
        var callback, criteria, data, options, _ref2;
        if (!this.owner.isPersisted()) {
          throw new Error("You cannot call create unless the parent is saved");
        }
        _ref2 = this._extractArgs(arguments, {
          data: true
        }), criteria = _ref2.criteria, data = _ref2.data, options = _ref2.options, callback = _ref2.callback;
        if (this.relation.embed && this.owner.store().supports("embed")) {
          return this._createEmbedded(criteria, data, options, callback);
        } else {
          return this._createReferenced(criteria, data, options, callback);
        }
      };

      Scope.prototype.update = function() {};

      Scope.prototype.destroy = function() {};

      Scope.prototype.compile = function() {
        var criteria, defaults, relation;
        criteria = Scope.__super__.compile.apply(this, arguments);
        relation = this.relation;
        defaults = {};
        if (relation.through) {
          criteria.through({
            scope: this.owner[relation.through](),
            key: "wallId"
          });
        } else if (relation.cache) {
          defaults.id = {
            $in: this.owner.get(relation.cacheKey)
          };
          criteria.where(defaults);
        } else {
          defaults[relation.foreignKey] = {
            $in: this.owner.get('id')
          };
          criteria.where(defaults);
        }
        return criteria;
      };

      Scope.prototype._createEmbedded = function(criteria, args, options, callback) {
        var attributes, owner, record, records, relation, updates, _base, _base2, _j, _len2, _ref2,
          _this = this;
        owner = this.owner;
        relation = this.relation;
        criteria.mergeOptions(options);
        _ref2 = criteria.toCreate(), attributes = _ref2.attributes, options = _ref2.options;
        records = this._build(args, attributes, options);
        updates = {
          $pushAll: {}
        };
        if (Tower.Support.Object.isArray(records)) {
          attributes = [];
          for (_j = 0, _len2 = records.length; _j < _len2; _j++) {
            record = records[_j];
            if ((_base = record.attributes)._id == null) {
              _base._id = relation.klass().store().generateId();
            }
            delete record.attributes.id;
            attributes.push(record.attributes);
          }
          updates["$pushAll"][relation.name] = attributes;
        } else {
          if ((_base2 = records.attributes)._id == null) {
            _base2._id = relation.klass().store().generateId();
          }
          delete records.attributes.id;
          updates["$pushAll"][relation.name] = [records.attributes];
        }
        return owner.store().update(updates, {
          id: owner.get('id')
        }, {}, function(error) {
          if (!error) {
            if (Tower.Support.Object.isArray(records)) {
              _this.owner.relation(_this.relation.name).records = _this.records.concat(records);
            } else {
              _this.owner.relation(_this.relation.name).records.push(records);
            }
            if (callback) return callback.call(_this, error, records);
          }
        });
      };

      Scope.prototype._createReferenced = function(criteria, args, options, callback) {
        var array, attributes, data, defaults, id, instantiate, inverseRelation, owner, relation, _name, _ref2,
          _this = this;
        owner = this.owner;
        relation = this.relation;
        inverseRelation = relation.inverse();
        id = owner.get("id");
        data = {};
        if (inverseRelation && inverseRelation.cache) {
          array = data[inverseRelation.cacheKey] || [];
          if (array.indexOf(id) === -1) array.push(id);
          data[inverseRelation.cacheKey] = array;
        } else if (relation.foreignKey) {
          if (id !== void 0) data[relation.foreignKey] = id;
          if (this.relation.foreignType) {
            data[_name = relation.foreignType] || (data[_name] = owner.constructor.name);
          }
        }
        criteria.where(data);
        criteria.mergeOptions(options);
        if (inverseRelation && inverseRelation.counterCacheKey) {
          defaults = {};
          defaults[inverseRelation.counterCacheKey] = 1;
          criteria.where(defaults);
        }
        instantiate = options.instantiate !== false;
        _ref2 = criteria.toCreate(), attributes = _ref2.attributes, options = _ref2.options;
        attributes = this._build(args, attributes, options);
        options.instantiate = true;
        return this._create(criteria, attributes, options, function(error, record) {
          var inc, push, updates;
          if (!error) {
            if (Tower.Support.Object.isArray(record)) {
              _this.owner.relation(_this.relation.name).records = _this.records.concat(record);
            } else {
              _this.owner.relation(_this.relation.name).records.push(record);
            }
            if (relation && (relation.cache || relation.counterCache)) {
              if (relation.cache) {
                push = {};
                push[relation.cacheKey] = record.get("id");
              }
              if (relation.counterCacheKey) {
                inc = {};
                inc[relation.counterCacheKey] = 1;
              }
              updates = {};
              if (push) updates["$push"] = push;
              if (inc) updates["$inc"] = inc;
              return owner.updateAttributes(updates, function(error) {
                if (callback) return callback.call(_this, error, record);
              });
            } else {
              if (callback) return callback.call(_this, error, record);
            }
          } else {
            if (callback) return callback.call(_this, error, record);
          }
        });
      };

      Scope.prototype._serializeAttributes = function(attributes) {
        var name, relation, relations, target, value;
        if (attributes == null) attributes = {};
        target = Tower.constant(this.relation.targetClassName);
        relations = target.relations();
        for (name in relations) {
          relation = relations[name];
          if (attributes.hasOwnProperty(name)) {
            value = attributes[name];
            delete attributes[name];
            if (relation instanceof Tower.Model.Relation.BelongsTo) {
              attributes[relation.foreignKey] = value.id;
              if (relation.polymorphic) {
                attributes[relation.foreignType] = value.type;
              }
            }
          }
        }
        return attributes;
      };

      return Scope;

    })(HasMany.Scope);

    return HasMany;

  })(Tower.Model.Relation);

  Tower.Model.Relation.HasOne = (function(_super) {

    __extends(HasOne, _super);

    function HasOne() {
      HasOne.__super__.constructor.apply(this, arguments);
    }

    return HasOne;

  })(Tower.Model.Relation);

  Tower.Model.Relations = {
    ClassMethods: {
      hasOne: function(name, options) {
        if (options == null) options = {};
        return this.relations()[name] = new Tower.Model.Relation.HasOne(this, name, options);
      },
      hasMany: function(name, options) {
        if (options == null) options = {};
        return this.relations()[name] = new Tower.Model.Relation.HasMany(this, name, options);
      },
      belongsTo: function(name, options) {
        return this.relations()[name] = new Tower.Model.Relation.BelongsTo(this, name, options);
      },
      relations: function() {
        return this._relations || (this._relations = {});
      },
      relation: function(name) {
        var relation;
        relation = this.relations()[name];
        if (!relation) {
          throw new Error("Relation '" + name + "' does not exist on '" + this.name + "'");
        }
        return relation;
      }
    },
    relation: function(name) {
      var _base;
      return (_base = this.relations)[name] || (_base[name] = this.constructor.relation(name).scoped(this));
    },
    buildRelation: function(name, attributes, callback) {
      return this.relation(name).build(attributes, callback);
    },
    createRelation: function(name, attributes, callback) {
      return this.relation(name).create(attributes, callback);
    },
    destroyRelations: function() {}
  };

  Tower.Model.Attribute = (function() {

    Attribute.string = {
      from: function(serialized) {
        if (Tower.none(serialized)) {
          return null;
        } else {
          return String(serialized);
        }
      },
      to: function(deserialized) {
        if (Tower.none(deserialized)) {
          return null;
        } else {
          return String(deserialized);
        }
      }
    };

    Attribute.number = {
      from: function(serialized) {
        if (Tower.none(serialized)) {
          return null;
        } else {
          return Number(serialized);
        }
      },
      to: function(deserialized) {
        if (Tower.none(deserialized)) {
          return null;
        } else {
          return Number(deserialized);
        }
      }
    };

    Attribute.integer = {
      from: function(serialized) {
        if (Tower.none(serialized)) {
          return null;
        } else {
          return parseInt(serialized);
        }
      },
      to: function(deserialized) {
        if (Tower.none(deserialized)) {
          return null;
        } else {
          return parseInt(deserialized);
        }
      }
    };

    Attribute.float = {
      from: function(serialized) {
        return parseFloat(serialized);
      },
      to: function(deserialized) {
        return deserialized;
      }
    };

    Attribute.decimal = Attribute.float;

    Attribute.boolean = {
      from: function(serialized) {
        if (typeof serialized === "string") {
          return !!(serialized !== "false");
        } else {
          return Boolean(serialized);
        }
      },
      to: function(deserialized) {
        return Tower.Model.Attribute.boolean.from(deserialized);
      }
    };

    Attribute.date = {
      from: function(date) {
        return date;
      },
      to: function(date) {
        return date;
      }
    };

    Attribute.time = Attribute.date;

    Attribute.datetime = Attribute.date;

    Attribute.array = {
      from: function(serialized) {
        if (Tower.none(serialized)) {
          return null;
        } else {
          return Tower.Support.Object.toArray(serialized);
        }
      },
      to: function(deserialized) {
        return Tower.Model.Attribute.array.from(deserialized);
      }
    };

    function Attribute(owner, name, options) {
      var serializer;
      if (options == null) options = {};
      this.owner = owner;
      this.name = key = name;
      this.type = options.type || "String";
      if (typeof this.type !== "string") {
        this.itemType = this.type[0];
        this.type = "Array";
      }
      this.encodingType = (function() {
        switch (this.type) {
          case "Id":
          case "Date":
          case "Array":
          case "String":
          case "Integer":
          case "Float":
          case "BigDecimal":
          case "Time":
          case "DateTime":
          case "Boolean":
          case "Object":
          case "Number":
            return this.type;
          default:
            return "Model";
        }
      }).call(this);
      serializer = Tower.Model.Attribute[Tower.Support.String.camelize(this.type, true)];
      this._default = options["default"];
      this.get = options.get || (serializer ? serializer.from : void 0);
      this.set = options.set || (serializer ? serializer.to : void 0);
      if (Tower.accessors) {
        Object.defineProperty(this.owner.prototype, name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this.get(key);
          },
          set: function(value) {
            return this.set(key, value);
          }
        });
      }
    }

    Attribute.prototype.defaultValue = function(record) {
      var _default;
      _default = this._default;
      if (Tower.Support.Object.isArray(_default)) {
        return _default.concat();
      } else if (Tower.Support.Object.isHash(_default)) {
        return Tower.Support.Object.extend({}, _default);
      } else if (typeof _default === "function") {
        return _default.call(record);
      } else {
        return _default;
      }
    };

    Attribute.prototype.encode = function(value, binding) {
      return this.code(this.set, value, binding);
    };

    Attribute.prototype.decode = function(value, binding) {
      return this.code(this.get, value, binding);
    };

    Attribute.prototype.code = function(type, value, binding) {
      switch (typeof type) {
        case "string":
          return binding[type].call(binding[type], value);
        case "function":
          return type.call(binding, value);
        default:
          return value;
      }
    };

    return Attribute;

  })();

  Tower.Model.Attributes = {
    ClassMethods: {
      field: function(name, options) {
        return this.fields()[name] = new Tower.Model.Attribute(this, name, options);
      },
      fields: function() {
        return this._fields || (this._fields = {});
      }
    },
    get: function(name) {
      var field;
      field = this.constructor.fields()[name];
      if (!this.has(name)) {
        if (field) this.attributes[name] = field.defaultValue(this);
      }
      if (field) {
        return field.decode(this.attributes[name], this);
      } else {
        return this.attributes[name];
      }
    },
    assignAttributes: function(attributes) {
      var key, value;
      for (key in attributes) {
        value = attributes[key];
        delete this.changes[key];
        this.attributes[key] = value;
      }
      return this;
    },
    has: function(key) {
      return this.attributes.hasOwnProperty(key);
    },
    set: function(key, value) {
      var _this = this;
      return this.operation(function() {
        return Tower.oneOrMany(_this, _this._set, key, value);
      });
    },
    push: function(key, value) {
      var _this = this;
      return this.operation(function() {
        return Tower.oneOrMany(_this, _this._push, key, value);
      });
    },
    pushAll: function(key, value) {
      var _this = this;
      return this.operation(function() {
        return Tower.oneOrMany(_this, _this._push, key, value, true);
      });
    },
    pull: function(key, value) {
      var _this = this;
      return this.operation(function() {
        return Tower.oneOrMany(_this, _this._pull, key, value);
      });
    },
    pullAll: function(key, value) {
      var _this = this;
      return this.operation(function() {
        return Tower.oneOrMany(_this, _this._pull, key, value, true);
      });
    },
    inc: function(key, value) {
      var _this = this;
      return this.operation(function() {
        return Tower.oneOrMany(_this, _this._inc, key, value);
      });
    },
    addToSet: function(key, value) {
      var _this = this;
      return this.operation(function() {
        return Tower.oneOrMany(_this, _this._addToSet, key, value);
      });
    },
    unset: function() {
      var key, keys, _j, _len2;
      keys = _.flatten(Tower.args(arguments));
      for (_j = 0, _len2 = keys.length; _j < _len2; _j++) {
        key = keys[_j];
        delete this.attributes[key];
      }
      return;
    },
    _set: function(key, value) {
      var after, before, field, fields, operation, _ref2;
      if (Tower.Store.atomicModifiers.hasOwnProperty(key)) {
        return this[key.replace(/^\$/, "")](value);
      } else {
        fields = this.constructor.fields();
        field = fields[key];
        if (field) value = field.encode(value, this);
        _ref2 = this.changes, before = _ref2.before, after = _ref2.after;
        this._attributeChange(key, value);
        if (!before.hasOwnProperty(key)) before[key] = this.get(key);
        after.$set || (after.$set = {});
        after.$set[key] = value;
        if (operation = this._currentOperation) {
          operation.$set || (operation.$set = {});
          operation.$set[key] = value;
        }
        return this.attributes[key] = value;
      }
    },
    _push: function(key, value, array) {
      var after, before, current, fields, operation, push, _ref2;
      if (array == null) array = false;
      fields = this.constructor.fields();
      if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
      _ref2 = this.changes, before = _ref2.before, after = _ref2.after;
      push = after.$push || (after.$push = {});
      before[key] || (before[key] = this.get(key));
      current = this.get(key) || [];
      push[key] || (push[key] = current.concat());
      if (array === true && _.isArray(value)) {
        push[key] = push[key].concat(value);
      } else {
        push[key].push(value);
      }
      if (operation = this._currentOperation) {
        operation.$push || (operation.$push = {});
        operation.$push[key] = value;
      }
      return this.attributes[key] = push[key];
    },
    _pull: function(key, value, array) {
      var after, before, current, fields, item, operation, pull, _j, _len2, _ref2;
      if (array == null) array = false;
      fields = this.constructor.fields();
      if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
      _ref2 = this.changes, before = _ref2.before, after = _ref2.after;
      pull = after.$pull || (after.$pull = {});
      before[key] || (before[key] = this.get(key));
      current = this.get(key) || [];
      pull[key] || (pull[key] = current.concat());
      if (array && _.isArray(value)) {
        for (_j = 0, _len2 = value.length; _j < _len2; _j++) {
          item = value[_j];
          pull[key].splice(pull[key].indexOf(item), 1);
        }
      } else {
        pull[key].splice(pull[key].indexOf(value), 1);
      }
      if (operation = this._currentOperation) {
        operation.$pull || (operation.$pull = {});
        operation.$pull[key] = value;
      }
      return this.attributes[key] = pull[key];
    },
    _inc: function(key, value) {
      var after, before, fields, inc, operation, _ref2;
      fields = this.constructor.fields();
      if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
      _ref2 = this.changes, before = _ref2.before, after = _ref2.after;
      inc = after.$inc || (after.$inc = {});
      if (!before.hasOwnProperty(key)) before[key] = this.get(key);
      inc[key] = this.get(key) || 0;
      inc[key] += value;
      if (operation = this._currentOperation) {
        operation.$before || (operation.$before = {});
        if (!operation.$before.hasOwnProperty(key)) {
          operation.$before[key] = this.get(key);
        }
        operation.$inc || (operation.$inc = {});
        operation.$inc[key] = value;
        operation.$after || (operation.$after = {});
        operation.$after[key] = inc[key];
      }
      return this.attributes[key] = inc[key];
    },
    _addToSet: function(key, value) {
      var addToSet, after, before, fields, _ref2;
      fields = this.constructor.fields();
      if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
      _ref2 = this.changes, before = _ref2.before, after = _ref2.after;
      addToSet = after.$addToSet || (after.$addToSet = {});
      if (!before.hasOwnProperty(key)) before[key] = this.get(key);
      addToSet[key] || (addToSet[key] = (addToSet[key] || []).concat());
      if (addToSet[key].indexOf(value) === -1) addToSet[key].push(value);
      return this.attributes[key] = addToSet[key];
    }
  };

  Tower.Model.Persistence = {
    ClassMethods: {
      defaultStore: Tower.client ? Tower.Store.Memory : Tower.Store.MongoDB,
      store: function(value) {
        var metadata, store;
        metadata = this.metadata();
        store = metadata.store;
        if (!value && store) return store;
        if (typeof value === "function") {
          store = new value({
            name: this.collectionName(),
            type: Tower.namespaced(this.name)
          });
        } else if (typeof value === "object") {
          store || (store = new this.defaultStore({
            name: this.collectionName(),
            type: Tower.namespaced(this.name)
          }));
          Tower.Support.Object.extend(store, value);
        } else if (value) {
          store = value;
        }
        store || (store = new this.defaultStore({
          name: this.collectionName(),
          type: Tower.namespaced(this.name)
        }));
        return metadata.store = store;
      },
      load: function(records) {
        return this.store().load(records);
      }
    },
    InstanceMethods: {
      save: function(options, callback) {
        var _this = this;
        if (this.readOnly) throw new Error("Record is read only");
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        options || (options = {});
        if (options.validate !== false) {
          this.validate(function(error) {
            if (error) {
              if (callback) return callback.call(_this, null, false);
            } else {
              return _this._save(callback);
            }
          });
        } else {
          this._save(callback);
        }
        return this;
      },
      updateAttributes: function(attributes, callback) {
        this.set(attributes);
        return this._update(attributes, callback);
      },
      destroy: function(callback) {
        if (this.isNew()) {
          if (callback) callback.call(this, null);
        } else {
          this._destroy(callback);
        }
        return this;
      },
      isPersisted: function() {
        return !!this.persistent;
      },
      isNew: function() {
        return !!!this.isPersisted();
      },
      reload: function() {},
      store: function() {
        return this.constructor.store();
      },
      _save: function(callback) {
        var _this = this;
        return this.runCallbacks("save", function(block) {
          var complete;
          complete = _this._callback(block, callback);
          if (_this.isNew()) {
            return _this._create(complete);
          } else {
            return _this._update(_this.toUpdates(), complete);
          }
        });
      },
      _create: function(callback) {
        var _this = this;
        this.runCallbacks("create", function(block) {
          var complete;
          complete = _this._callback(block, callback);
          return _this.constructor.create(_this, {
            instantiate: false
          }, function(error) {
            if (error && !callback) throw error;
            if (!error) {
              _this._resetChanges();
              _this.persistent = true;
            }
            return complete.call(_this, error);
          });
        });
        return this;
      },
      _update: function(updates, callback) {
        var _this = this;
        this.runCallbacks("update", function(block) {
          var complete;
          complete = _this._callback(block, callback);
          return _this.constructor.update(_this.get("id"), updates, {
            instantiate: false
          }, function(error) {
            if (error && !callback) throw error;
            if (!error) {
              _this._resetChanges();
              _this.persistent = true;
            }
            return complete.call(_this, error);
          });
        });
        return this;
      },
      _destroy: function(callback) {
        var _this = this;
        this.runCallbacks("destroy", function(block) {
          var complete;
          complete = _this._callback(block, callback);
          return _this.constructor.destroy(_this, {
            instantiate: false
          }, function(error) {
            if (error && !callback) throw error;
            if (!error) {
              _this.persistent = false;
              _this._resetChanges();
              delete _this.attributes.id;
            }
            return complete.call(_this, error);
          });
        });
        return this;
      }
    }
  };

  Tower.Model.Scopes = {
    ClassMethods: {
      scope: function(name, scope) {
        return this[name] = scope instanceof Tower.Model.Scope ? scope : this.where(scope);
      },
      scoped: function() {
        var scope;
        scope = new Tower.Model.Scope({
          model: this
        });
        if (this.baseClass().name !== this.name) {
          scope.where({
            type: this.name
          });
        }
        return scope;
      },
      defaultSort: function(object) {
        if (object) this._defaultSort = object;
        return this._defaultSort || (this._defaultSort = {
          name: "createdAt",
          direction: "desc"
        });
      },
      defaultScope: function() {}
    }
  };

  _ref2 = Tower.Model.Scope.queryMethods;
  _fn2 = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref3;
      return (_ref3 = this.scoped())[key].apply(_ref3, arguments);
    };
  };
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    key = _ref2[_j];
    _fn2(key);
  }

  _ref3 = Tower.Model.Scope.finderMethods;
  _fn3 = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref4;
      return (_ref4 = this.scoped())[key].apply(_ref4, arguments);
    };
  };
  for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
    key = _ref3[_k];
    _fn3(key);
  }

  _ref4 = Tower.Model.Scope.persistenceMethods;
  _fn4 = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref5;
      return (_ref5 = this.scoped())[key].apply(_ref5, arguments);
    };
  };
  for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
    key = _ref4[_l];
    _fn4(key);
  }

  Tower.Model.Serialization = {
    ClassMethods: {
      fromJSON: function(data) {
        var i, record, records, _len5;
        records = JSON.parse(data);
        if (!(records instanceof Array)) records = [records];
        for (i = 0, _len5 = records.length; i < _len5; i++) {
          record = records[i];
          records[i] = new this(record);
        }
        return records;
      },
      toJSON: function(records, options) {
        var record, result, _len5, _m;
        if (options == null) options = {};
        result = [];
        for (_m = 0, _len5 = records.length; _m < _len5; _m++) {
          record = records[_m];
          result.push(record.toJSON());
        }
        return result;
      }
    },
    toJSON: function(options) {
      return this._serializableHash(options);
    },
    clone: function() {
      var attributes;
      attributes = Tower.clone(this.attributes);
      delete attributes.id;
      return new this.constructor(attributes);
    },
    _serializableHash: function(options) {
      var attributeNames, except, i, include, includes, methodNames, methods, name, only, opts, record, records, result, tmp, _len5, _len6, _len7, _len8, _m, _n, _o;
      if (options == null) options = {};
      result = {};
      attributeNames = Tower.Support.Object.keys(this.attributes);
      if (only = options.only) {
        attributeNames = _.union(Tower.Support.Object.toArray(only), attributeNames);
      } else if (except = options.except) {
        attributeNames = _.difference(Tower.Support.Object.toArray(except), attributeNames);
      }
      for (_m = 0, _len5 = attributeNames.length; _m < _len5; _m++) {
        name = attributeNames[_m];
        result[name] = this._readAttributeForSerialization(name);
      }
      if (methods = options.methods) {
        methodNames = Tower.Support.Object.toArray(methods);
        for (_n = 0, _len6 = methods.length; _n < _len6; _n++) {
          name = methods[_n];
          result[name] = this[name]();
        }
      }
      if (includes = options.include) {
        includes = Tower.Support.Object.toArray(includes);
        for (_o = 0, _len7 = includes.length; _o < _len7; _o++) {
          include = includes[_o];
          if (!Tower.Support.Object.isHash(include)) {
            tmp = {};
            tmp[include] = {};
            include = tmp;
            tmp = void 0;
          }
          for (name in include) {
            opts = include[name];
            records = this[name]().all();
            for (i = 0, _len8 = records.length; i < _len8; i++) {
              record = records[i];
              records[i] = record._serializableHash(opts);
            }
            result[name] = records;
          }
        }
      }
      return result;
    },
    _readAttributeForSerialization: function(name, type) {
      if (type == null) type = "json";
      return this.attributes[name];
    }
  };

  Tower.Model.Validator = (function() {

    Validator.create = function(name, value, attributes) {
      var key, _results;
      if (typeof name === "object") {
        attributes = value;
        _results = [];
        for (key in name) {
          value = name[key];
          _results.push(this._create(key, value, attributes));
        }
        return _results;
      } else {
        return this._create(name, value, attributes);
      }
    };

    Validator._create = function(name, value, attributes) {
      switch (name) {
        case "presence":
        case "required":
          return new this.Presence(name, value, attributes);
        case "count":
        case "length":
        case "min":
        case "max":
          return new this.Length(name, value, attributes);
        case "format":
          return new this.Format(name, value, attributes);
        case "in":
        case "except":
        case "only":
        case "notIn":
        case "values":
        case "accepts":
          return new this.Set(name, value, attributes);
      }
    };

    function Validator(name, value, attributes) {
      this.name = name;
      this.value = value;
      this.attributes = Tower.Support.Object.toArray(attributes);
    }

    Validator.prototype.validateEach = function(record, errors, callback) {
      var iterator,
        _this = this;
      iterator = function(attribute, next) {
        return _this.validate(record, attribute, errors, function(error) {
          return next();
        });
      };
      return Tower.parallel(this.attributes, iterator, function(error) {
        if (callback) return callback.call(_this, error);
      });
    };

    Validator.prototype.success = function(callback) {
      if (callback) callback.call(this);
      return true;
    };

    Validator.prototype.failure = function(record, attribute, errors, message, callback) {
      errors[attribute] || (errors[attribute] = []);
      errors[attribute].push(message);
      if (callback) callback.call(this, message);
      return false;
    };

    return Validator;

  })();

  Tower.Model.Validator.Format = (function() {

    function Format(value, attributes) {
      Format.__super__.constructor.call(this, value, attributes);
      this.value = typeof value === 'string' ? new RegExp(value) : value;
    }

    Format.prototype.validate = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!this.value.exec(value)) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.format", {
          attribute: attribute,
          value: this.value.toString()
        }), callback);
      } else {
        return this.success(callback);
      }
    };

    return Format;

  })();

  Tower.Model.Validator.Length = (function(_super) {

    __extends(Length, _super);

    function Length(name, value, attributes) {
      Length.__super__.constructor.apply(this, arguments);
      this.validate = (function() {
        switch (name) {
          case "min":
            return this.validateMinimum;
          case "max":
            return this.validateMaximum;
          default:
            return this.validateLength;
        }
      }).call(this);
    }

    Length.prototype.validateMinimum = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(typeof value === 'number' && value >= this.value)) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateMaximum = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(typeof value === 'number' && value <= this.value)) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.maximum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateLength = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(typeof value === 'number' && value === this.value)) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.length", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    return Length;

  })(Tower.Model.Validator);

  Tower.Model.Validator.Presence = (function(_super) {

    __extends(Presence, _super);

    function Presence() {
      Presence.__super__.constructor.apply(this, arguments);
    }

    Presence.prototype.validate = function(record, attribute, errors, callback) {
      if (!Tower.Support.Object.isPresent(record.get(attribute))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.presence", {
          attribute: attribute
        }), callback);
      }
      return this.success(callback);
    };

    return Presence;

  })(Tower.Model.Validator);

  Tower.Model.Validator.Set = (function() {

    function Set(value, attributes) {
      Set.__super__.constructor.call(this, Tower.Support.Object.toArray(value), attributes);
    }

    Set.prototype.validate = function(record, attribute, errors, callback) {};

    return Set;

  })();

  Tower.Model.Validator.Uniqueness = (function(_super) {

    __extends(Uniqueness, _super);

    function Uniqueness() {
      Uniqueness.__super__.constructor.apply(this, arguments);
    }

    Uniqueness.prototype.validate = function(record, attribute, errors, callback) {
      var conditions, value,
        _this = this;
      value = record.get(attribute);
      conditions = {};
      conditions[attribute] = value;
      return record.constructor.where(conditions).exists(function(error, result) {
        if (result) {
          return _this.failure(record, attribute, errors, Tower.t("model.errors.uniqueness", {
            attribute: attribute,
            value: value
          }), callback);
        } else {
          return _this.success(callback);
        }
      });
    };

    return Uniqueness;

  })(Tower.Model.Validator);

  Tower.Model.Validations = {
    ClassMethods: {
      validates: function() {
        var attributes, key, options, validators, value, _results;
        attributes = Tower.Support.Array.args(arguments);
        options = attributes.pop();
        validators = this.validators();
        _results = [];
        for (key in options) {
          value = options[key];
          _results.push(validators.push(Tower.Model.Validator.create(key, value, attributes)));
        }
        return _results;
      },
      validators: function() {
        return this._validators || (this._validators = []);
      }
    },
    validate: function(callback) {
      var success,
        _this = this;
      success = false;
      this.runCallbacks("validate", function(block) {
        var complete, errors, iterator, validators;
        complete = _this._callback(block, callback);
        validators = _this.constructor.validators();
        errors = _this.errors = {};
        iterator = function(validator, next) {
          return validator.validateEach(_this, errors, next);
        };
        Tower.async(validators, iterator, function(error) {
          if (!(error || Tower.Support.Object.isPresent(errors))) success = true;
          return complete.call(_this, !success);
        });
        return success;
      });
      return success;
    }
  };

  Tower.Model.Timestamp = {
    ClassMethods: {
      timestamps: function() {
        this.include(Tower.Model.Timestamp.CreatedAt);
        this.include(Tower.Model.Timestamp.UpdatedAt);
        this.field("createdAt", {
          type: "Date"
        });
        this.field("updatedAt", {
          type: "Date"
        });
        this.before("create", "setCreatedAt");
        return this.before("save", "setUpdatedAt");
      }
    },
    CreatedAt: {
      ClassMethods: {},
      setCreatedAt: function() {
        return this.set("createdAt", new Date);
      }
    },
    UpdatedAt: {
      ClassMethods: {},
      setUpdatedAt: function() {
        return this.set("updatedAt", new Date);
      }
    }
  };

  Tower.Support.I18n.load({
    model: {
      errors: {
        presence: "%{attribute} can't be blank",
        minimum: "%{attribute} must be a minimum of %{value}",
        maximum: "%{attribute} must be a maximum of %{value}",
        length: "%{attribute} must be equal to %{value}",
        format: "%{attribute} must be match the format %{value}",
        inclusion: "%{attribute} is not included in the list",
        exclusion: "%{attribute} is reserved",
        invalid: "%{attribute} is invalid",
        confirmation: "%{attribute} doesn't match confirmation",
        accepted: "%{attribute} must be accepted",
        empty: "%{attribute} can't be empty",
        blank: "%{attribute} can't be blank",
        tooLong: "%{attribute} is too long (maximum is %{count} characters)",
        tooShort: "%{attribute} is too short (minimum is %{count} characters)",
        wrongLength: "%{attribute} is the wrong length (should be %{count} characters)",
        taken: "%{attribute} has already been taken",
        notANumber: "%{attribute} is not a number",
        greaterThan: "%{attribute} must be greater than %{count}",
        greaterThanOrEqualTo: "%{attribute} must be greater than or equal to %{count}",
        equalTo: "%{attribute} must be equal to %{count}",
        lessThan: "%{attribute} must be less than %{count}",
        lessThanOrEqualTo: "%{attribute} must be less than or equal to %{count}",
        odd: "%{attribute} must be odd",
        even: "%{attribute} must be even",
        recordInvalid: "Validation failed: %{errors}"
      },
      fullMessages: {
        format: "%{message}"
      }
    }
  });

  Tower.Model.include(Tower.Support.Callbacks);

  Tower.Model.include(Tower.Model.Conversion);

  Tower.Model.include(Tower.Model.Dirty);

  Tower.Model.include(Tower.Model.Criteria);

  Tower.Model.include(Tower.Model.Scopes);

  Tower.Model.include(Tower.Model.Persistence);

  Tower.Model.include(Tower.Model.Inheritance);

  Tower.Model.include(Tower.Model.Serialization);

  Tower.Model.include(Tower.Model.Relations);

  Tower.Model.include(Tower.Model.Validations);

  Tower.Model.include(Tower.Model.Attributes);

  Tower.Model.include(Tower.Model.Timestamp);

  Tower.View = (function(_super) {

    __extends(View, _super);

    View.extend({
      cache: {},
      engine: "coffee",
      prettyPrint: false,
      loadPaths: ["app/views"],
      componentSuffix: "widget",
      hintClass: "hint",
      hintTag: "figure",
      labelClass: "control-label",
      requiredClass: "required",
      requiredAbbr: "*",
      requiredTitle: "Required",
      errorClass: "error",
      errorTag: "output",
      validClass: null,
      optionalClass: "optional",
      optionalAbbr: "",
      optionalTitle: "Optional",
      labelMethod: "humanize",
      labelAttribute: "toLabel",
      validationMaxLimit: 255,
      defaultTextFieldSize: null,
      defaultTextAreaWidth: 300,
      allFieldsRequiredByDefault: true,
      fieldListTag: "ol",
      fieldListClass: "fields",
      fieldTag: "li",
      separator: "-",
      breadcrumb: " - ",
      includeBlankForSelectByDefault: true,
      collectionLabelMethods: ["toLabel", "displayName", "fullName", "name", "title", "toString"],
      i18nLookupsByDefault: true,
      escapeHtmlEntitiesInHintsAndLabels: false,
      renameNestedAttributes: true,
      inlineValidations: true,
      autoIdForm: true,
      fieldsetClass: "fieldset",
      fieldClass: "field control-group",
      validateClass: "validate",
      legendClass: "legend",
      formClass: "form",
      idEnabledOn: ["input", "field"],
      widgetsPath: "shared/widgets",
      navClass: "list-item",
      includeAria: true,
      activeClass: "active",
      navTag: "li",
      termsTag: "dl",
      termClass: "term",
      termKeyClass: "key",
      termValueClass: "value",
      hintIsPopup: false,
      listTag: "ul",
      pageHeaderId: "header",
      pageTitleId: "title",
      autoIdNav: false,
      pageSubtitleId: "subtitle",
      widgetClass: "widget",
      headerClass: "header",
      titleClass: "title",
      subtitleClass: "subtitle",
      contentClass: "content",
      defaultHeaderLevel: 3,
      termSeparator: ":",
      richInput: false,
      submitFieldsetClass: "submit-fieldset",
      addLabel: "+",
      removeLabel: "-",
      cycleFields: false,
      alwaysIncludeHintTag: false,
      alwaysIncludeErrorTag: true,
      requireIfValidatesPresence: true,
      localizeWithNamespace: false,
      localizeWithNestedModel: false,
      localizeWithInheritance: true,
      defaultComponentHeaderLevel: 3,
      helpers: [],
      metaTags: ["description", "keywords", "author", "copyright", "category", "robots"],
      store: function(store) {
        if (store) this._store = store;
        return this._store || (this._store = new Tower.Store.Memory({
          name: "view"
        }));
      },
      renderers: {}
    });

    function View(context) {
      if (context == null) context = {};
      this._context = context;
    }

    return View;

  })(Tower.Class);

  Tower.View.Helpers = {
    titleTag: function(title) {
      return "<title>" + title + "</title>";
    },
    metaTag: function(name, content) {
      return "<meta name=\"" + name + "\" content=\"" + content + "\"/>";
    },
    tag: function(name, options) {},
    linkTag: function(title, path, options) {},
    imageTag: function(path, options) {},
    csrfMetaTag: function() {
      return this.metaTag("csrf-token", this.request.session._csrf);
    },
    contentTypeTag: function(type) {
      if (type == null) type = "UTF-8";
      return "<meta charset=\"" + type + "\" />";
    },
    javascriptTag: function(path) {
      return "<script type=\"text/javascript\" src=\"" + path + "\" ></script>";
    },
    stylesheetTag: function(path) {
      return "<link href=\"" + path + "\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>";
    },
    mobileTags: function() {
      return "<meta content='yes' name='apple-mobile-web-app-capable'>\n<meta content='yes' name='apple-touch-fullscreen'>\n<meta content='initial-scale = 1.0, maximum-scale = 1.0, user-scalable = no, width = device-width' name='viewport'>";
    }
  };

  Tower.View.Rendering = {
    render: function(options, callback) {
      var _this = this;
      options.type || (options.type = this.constructor.engine);
      if (!options.hasOwnProperty("layout") && this._context.layout) {
        options.layout = this._context.layout();
      }
      options.locals = this._renderingContext(options);
      return this._renderBody(options, function(error, body) {
        if (error) return callback(error, body);
        return _this._renderLayout(body, options, callback);
      });
    },
    partial: function(path, options, callback) {
      var prefixes, template;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      options || (options = {});
      prefixes = options.prefixes;
      if (this._context) prefixes || (prefixes = [this._context.collectionName]);
      template = this._readTemplate(path, prefixes, options.type || Tower.View.engine);
      return this._renderString(template, options, callback);
    },
    renderWithEngine: function(template, engine) {
      var mint;
      if (Tower.client) {
        return "(" + template + ").call(this);";
      } else {
        mint = require("mint");
        return mint[mint.engine(engine || "coffee")](template, {}, function(error, result) {
          if (error) return console.log(error);
        });
      }
    },
    _renderBody: function(options, callback) {
      if (options.text) {
        return callback(null, options.text);
      } else if (options.json) {
        return callback(null, typeof options.json === "string" ? options.json : JSON.stringify(options.json));
      } else {
        if (!options.inline) {
          options.template = this._readTemplate(options.template, options.prefixes, options.type);
        }
        return this._renderString(options.template, options, callback);
      }
    },
    _renderLayout: function(body, options, callback) {
      var layout;
      if (options.layout) {
        layout = this._readTemplate("layouts/" + options.layout, [], options.type);
        options.locals.body = body;
        return this._renderString(layout, options, callback);
      } else {
        return callback(null, body);
      }
    },
    _renderString: function(string, options, callback) {
      var coffeekup, e, engine, hardcode, helper, locals, mint, result, _len5, _m, _ref5;
      if (options == null) options = {};
      if (!!options.type.match(/coffee/)) {
        e = null;
        result = null;
        coffeekup = Tower.client ? global.CoffeeKup : require("coffeekup");
        try {
          locals = options.locals;
          locals.renderWithEngine = this.renderWithEngine;
          locals._readTemplate = this._readTemplate;
          locals.cache = Tower.env !== "development";
          locals.format = true;
          hardcode = {};
          _ref5 = Tower.View.helpers;
          for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
            helper = _ref5[_m];
            hardcode = _.extend(hardcode, helper);
          }
          hardcode = _.extend(hardcode, {
            tags: coffeekup.tags
          });
          locals.hardcode = hardcode;
          locals._ = _;
          result = coffeekup.render(string, locals);
        } catch (error) {
          e = error;
        }
        return callback(e, result);
      } else if (options.type) {
        mint = require("mint");
        engine = require("mint").engine(options.type);
        return mint[engine](string, options.locals, callback);
      } else {
        mint = require("mint");
        engine = require("mint");
        options.locals.string = string;
        return engine.render(options.locals, callback);
      }
    },
    _renderingContext: function(options) {
      var key, locals, value;
      locals = this;
      _ref = this._context;
      for (key in _ref) {
        value = _ref[key];
        if (!key.match(/^(constructor|head)/)) locals[key] = value;
      }
      locals = Tower.Support.Object.extend(locals, options.locals);
      if (this.constructor.prettyPrint) locals.pretty = true;
      return locals;
    },
    _readTemplate: function(template, prefixes, ext) {
      var result, _base, _name;
      if (typeof template !== "string") return template;
      result = (_base = this.constructor.cache)[_name = "app/views/" + template] || (_base[_name] = this.constructor.store().find({
        path: template,
        ext: ext,
        prefixes: prefixes
      }));
      if (!result) throw new Error("Template '" + template + "' was not found.");
      return result;
    }
  };

  Tower.View.Component = (function() {

    Component.render = function() {
      var args, block, options, template;
      args = Tower.Support.Array.args(arguments);
      template = args.shift();
      block = Tower.Support.Array.extractBlock(args);
      if (!(args[args.length - 1] instanceof Tower.Model || typeof args[args.length - 1] !== "object")) {
        options = args.pop();
      }
      options || (options = {});
      options.template = template;
      return (new this(args, options)).render(block);
    };

    function Component(args, options) {
      var key, value;
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
    }

    Component.prototype.tag = function() {
      var args, key;
      key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.template.tag(key, args);
    };

    Component.prototype.addClass = function(string, args) {
      var arg, result, _len5, _m;
      result = string ? string.split(/\s+/g) : [];
      for (_m = 0, _len5 = args.length; _m < _len5; _m++) {
        arg = args[_m];
        if (!arg) continue;
        if (!(result.indexOf(arg) > -1)) result.push(arg);
      }
      return result.join(" ");
    };

    return Component;

  })();

  Tower.View.Table = (function(_super) {

    __extends(Table, _super);

    function Table(args, options) {
      var aria, data, recordOrKey;
      Table.__super__.constructor.apply(this, arguments);
      recordOrKey = args.shift();
      this.key = this.recordKey(recordOrKey);
      this.rowIndex = 0;
      this.cellIndex = 0;
      this.scope = "table";
      this.headers = [];
      options.summary || (options.summary = "Table for " + (_.titleize(this.key)));
      options.role = "grid";
      options["class"] = this.addClass(options["class"] || "", ["table"]);
      data = options.data || (options.data = {});
      if (options.hasOwnProperty("total")) data.total = options.total;
      if (options.hasOwnProperty("page")) data.page = options.page;
      if (options.hasOwnProperty("count")) data.count = options.count;
      aria = options.aria || {};
      delete options.aria;
      if (!(aria.hasOwnProperty("aria-multiselectable") || options.multiselect === true)) {
        aria["aria-multiselectable"] = false;
      }
      options.id || (options.id = "" + recordOrKey + "-table");
      this.options = {
        summary: options.summary,
        role: options.role,
        data: options.data,
        "class": options["class"]
      };
    }

    Table.prototype.render = function(block) {
      var _this = this;
      return this.tag("table", this.options, function() {
        if (block) block(_this);
        return null;
      });
    };

    Table.prototype.tableQueryRowClass = function() {
      return ["search-row", queryParams.except("page", "sort").blank != null ? null : "search-results"].compact.join(" ");
    };

    Table.prototype.linkToSort = function(title, attribute, options) {
      var sortParam;
      if (options == null) options = {};
      sortParam = sortValue(attribute, oppositeSortDirection(attribute));
      return linkTo(title, withParams(request.path, {
        sort: sortParam
      }), options);
    };

    Table.prototype.nextPagePath = function(collection) {
      return withParams(request.path, {
        page: collection.nextPage
      });
    };

    Table.prototype.prevPagePath = function(collection) {
      return withParams(request.path, {
        page: collection.prevPage
      });
    };

    Table.prototype.firstPagePath = function(collection) {
      return withParams(request.path, {
        page: 1
      });
    };

    Table.prototype.lastPagePath = function(collection) {
      return withParams(request.path, {
        page: collection.lastPage
      });
    };

    Table.prototype.currentPageNum = function() {
      var page;
      page = params.page ? params.page : 1;
      if (page < 1) page = 1;
      return page;
    };

    Table.prototype.caption = function() {};

    Table.prototype.head = function(attributes, block) {
      if (attributes == null) attributes = {};
      this.hideHeader = attributes.visible === false;
      delete attributes.visible;
      return this._section("head", attributes, block);
    };

    Table.prototype.body = function(attributes, block) {
      if (attributes == null) attributes = {};
      return this._section("body", attributes, block);
    };

    Table.prototype.foot = function(attributes, block) {
      if (attributes == null) attributes = {};
      return this._section("foot", attributes, block);
    };

    Table.prototype._section = function(scope, attributes, block) {
      this.rowIndex = 0;
      this.scope = scope;
      this.tag("t" + scope, attributes, block);
      this.rowIndex = 0;
      return this.scope = "table";
    };

    Table.prototype.row = function() {
      var args, attributes, block, _m;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _m = arguments.length - 1) : (_m = 0, []), block = arguments[_m++];
      attributes = Tower.Support.Array.extractOptions(args);
      attributes.scope = "row";
      if (this.scope === "body") attributes.role = "row";
      this.rowIndex += 1;
      this.cellIndex = 0;
      this.tag("tr", attributes, block);
      return this.cellIndex = 0;
    };

    Table.prototype.column = function() {
      var args, attributes, block, value, _base, _m;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _m = arguments.length - 1) : (_m = 0, []), block = arguments[_m++];
      attributes = Tower.Support.Array.extractOptions(args);
      value = args.shift();
      if (typeof (_base = Tower.View.idEnabledOn).include === "function" ? _base.include("table") : void 0) {
        attributes.id || (attributes.id = this.idFor("header", key, value, this.rowIndex, this.cellIndex));
      }
      if (attributes.hasOwnProperty("width")) {
        attributes.width = this.pixelate(attributes.width);
      }
      if (attributes.hasOwnProperty("height")) {
        attributes.height = this.pixelate(attributes.height);
      }
      this.headers.push(attributes.id);
      tag("col", attributes);
      return this.cellIndex += 1;
    };

    Table.prototype.header = function() {
      var args, attributes, block, direction, label, sort, value, _base,
        _this = this;
      args = Tower.Support.Array.args(arguments);
      block = Tower.Support.Array.extractBlock(args);
      attributes = Tower.Support.Array.extractOptions(args);
      value = args.shift();
      attributes.abbr || (attributes.abbr = value);
      attributes.role = "columnheader";
      if (typeof (_base = Tower.View.idEnabledOn).include === "function" ? _base.include("table") : void 0) {
        attributes.id || (attributes.id = this.idFor("header", key, value, this.rowIndex, this.cellIndex));
      }
      attributes.scope = "col";
      if (attributes.hasOwnProperty("for")) {
        attributes.abbr || (attributes.abbr = attributes["for"]);
      }
      attributes.abbr || (attributes.abbr = value);
      delete attributes["for"];
      if (attributes.hasOwnProperty("width")) {
        attributes.width = this.pixelate(attributes.width);
      }
      if (attributes.hasOwnProperty("height")) {
        attributes.height = this.pixelate(attributes.height);
      }
      sort = attributes.sort === true;
      delete attributes.sort;
      if (sort) {
        attributes["class"] = this.addClass(attributes["class"] || "", [attributes.sortClass || "sortable"]);
        attributes.direction || (attributes.direction = "asc");
      }
      delete attributes.sortClass;
      label = attributes.label || _.titleize(value.toString());
      delete attributes.label;
      direction = attributes.direction;
      delete attributes.direction;
      if (direction) {
        attributes["aria-sort"] = direction;
        attributes["class"] = [attributes["class"], direction].join(" ");
        attributes["aria-selected"] = true;
      } else {
        attributes["aria-sort"] = "none";
        attributes["aria-selected"] = false;
      }
      this.headers.push(attributes.id);
      if (block) {
        this.tag("th", attributes, block);
      } else {
        if (sort) {
          this.tag("th", attributes, function() {
            return _this.linkToSort(label, value);
          });
        } else {
          this.tag("th", attributes, function() {
            return _this.tag("span", label);
          });
        }
      }
      return this.cellIndex += 1;
    };

    Table.prototype.linkToSort = function(label, value) {
      var direction,
        _this = this;
      direction = "+";
      return this.tag("a", {
        href: "?sort=" + direction
      }, function() {
        return _this.tag("span", label);
      });
    };

    Table.prototype.cell = function() {
      var args, attributes, block, value, _base, _m;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _m = arguments.length - 1) : (_m = 0, []), block = arguments[_m++];
      attributes = Tower.Support.Array.extractOptions(args);
      value = args.shift();
      attributes.role = "gridcell";
      if (typeof (_base = Tower.View.idEnabledOn).include === "function" ? _base.include("table") : void 0) {
        attributes.id || (attributes.id = this.idFor("cell", key, value, this.rowIndex, this.cellIndex));
      }
      attributes.headers = this.headers[this.cellIndex];
      if (attributes.hasOwnProperty("width")) {
        attributes.width = this.pixelate(attributes.width);
      }
      if (attributes.hasOwnProperty("height")) {
        attributes.height = this.pixelate(attributes.height);
      }
      if (block) {
        this.tag("td", attributes, block);
      } else {
        this.tag("td", value, attributes);
      }
      return this.cellIndex += 1;
    };

    Table.prototype.recordKey = function(recordOrKey) {
      if (typeof recordOrKey === "string") {
        return recordOrKey;
      } else {
        return recordOrKey.constructor.name;
      }
    };

    Table.prototype.idFor = function(type, key, value, row_index, column_index) {
      if (row_index == null) row_index = this.row_index;
      if (column_index == null) column_index = this.column_index;
      [key, type, row_index, column_index].compact.map(function(node) {
        return node.replace(/[\s_]/, "-");
      });
      return end.join("-");
    };

    Table.prototype.pixelate = function(value) {
      if (typeof value === "string") {
        return value;
      } else {
        return "" + value + "px";
      }
    };

    return Table;

  })(Tower.View.Component);

  Tower.View.Form = (function(_super) {

    __extends(Form, _super);

    function Form(args, options) {
      var klass;
      Form.__super__.constructor.apply(this, arguments);
      this.model = args.shift() || new Tower.Model;
      if (typeof this.model === "string") {
        klass = Tower.constant(Tower.Support.String.camelize(this.model));
        this.model = klass ? new klass : null;
      }
      this.attributes = this._extractAttributes(options);
    }

    Form.prototype.render = function(callback) {
      var _this = this;
      return this.tag("form", this.attributes, function() {
        var builder;
        _this.tag("input", {
          type: "hidden",
          name: "_method",
          value: _this.attributes["data-method"]
        });
        if (callback) {
          builder = new Tower.View.Form.Builder([], {
            template: _this.template,
            tabindex: 1,
            accessKeys: {},
            model: _this.model
          });
          return builder.render(callback);
        }
      });
    };

    Form.prototype._extractAttributes = function(options) {
      var attributes, method;
      if (options == null) options = {};
      attributes = options.html || {};
      attributes.action = options.url || Tower.urlFor(this.model);
      if (options.hasOwnProperty("class")) attributes["class"] = options["class"];
      if (options.hasOwnProperty("id")) attributes.id = options.id;
      attributes.id || (attributes.id = Tower.Support.String.parameterize("" + this.model.constructor.name + "-form"));
      if (options.multipart || attributes.multipart === true) {
        attributes.enctype = "multipart/form-data";
      }
      attributes.role = "form";
      attributes.novalidate = "true";
      if (options.hasOwnProperty("validate")) {
        attributes["data-validate"] = options.validate.toString();
      }
      method = attributes.method || options.method;
      if (!method || method === "") {
        if (this.model && this.model.get("id")) {
          method = "put";
        } else {
          method = "post";
        }
      }
      attributes["data-method"] = method;
      attributes.method = method === "get" ? "get" : "post";
      return attributes;
    };

    return Form;

  })(Tower.View.Component);

  Tower.View.Form.Builder = (function(_super) {

    __extends(Builder, _super);

    function Builder(args, options) {
      if (options == null) options = {};
      this.template = options.template;
      this.model = options.model;
      this.attribute = options.attribute;
      this.parentIndex = options.parentIndex;
      this.index = options.index;
      this.tabindex = options.tabindex;
      this.accessKeys = options.accessKeys;
    }

    Builder.prototype.defaultOptions = function(options) {
      if (options == null) options = {};
      options.model || (options.model = this.model);
      options.index || (options.index = this.index);
      options.attribute || (options.attribute = this.attribute);
      options.template || (options.template = this.template);
      return options;
    };

    Builder.prototype.fieldset = function() {
      var args, block, options;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      block = args.pop();
      options = this.defaultOptions(Tower.Support.Array.extractOptions(args));
      options.label || (options.label = args.shift());
      return new Tower.View.Form.Fieldset([], options).render(block);
    };

    Builder.prototype.fields = function() {
      var args, attribute, block, options,
        _this = this;
      args = Tower.Support.Array.args(arguments);
      block = Tower.Support.Array.extractBlock(args);
      options = Tower.Support.Array.extractOptions(args);
      options.as = "fields";
      options.label || (options.label = false);
      attribute = args.shift() || this.attribute;
      return this.field(attribute, options, function(_field) {
        return _this.fieldset(block);
      });
    };

    Builder.prototype.fieldsFor = function() {
      var attrName, attribute, index, keys, macro, options, subObject, subParent;
      options = args.extractOptions;
      attribute = args.shift;
      macro = model.macroFor(attribute);
      attrName = nil;
      if (options.as === "object") {
        attrName = attribute.toS;
      } else {
        attrName = Tower.View.renameNestedAttributes ? "" + attribute + "_attributes" : attribute.toS;
      }
      subParent = model.object;
      subObject = args.shift;
      index = options["delete"]("index");
      if (!((index.present != null) && typeof index === "string")) {
        if ((subObject.blank != null) && (index.present != null)) {
          subObject = subParent.send(attribute)[index];
        } else if ((index.blank != null) && (subObject.present != null) && macro === "hasMany") {
          index = subParent.send(attribute).index(subObject);
        }
      }
      subObject || (subObject = model["default"](attribute) || model.toS.camelize.constantize["new"]);
      keys = [model.keys, attrName];
      options.merge({
        template: template,
        model: model,
        parentIndex: index,
        accessKeys: accessKeys,
        tabindex: tabindex
      });
      return new Tower.View.Form.Builder(options).render(block);
    };

    Builder.prototype.field = function() {
      var args, attributeName, block, defaults, last, options;
      args = Tower.Support.Array.args(arguments);
      last = args[args.length - 1];
      if (last === null || last === void 0) args.pop();
      block = Tower.Support.Array.extractBlock(args);
      options = Tower.Support.Array.extractOptions(args);
      attributeName = args.shift() || "attribute.name";
      defaults = {
        template: this.template,
        model: this.model,
        attribute: attributeName,
        parentIndex: this.parentIndex,
        index: this.index,
        fieldHTML: options.fieldHTML || {},
        inputHTML: options.inputHTML || {},
        labelHTML: options.labelHTML || {},
        errorHTML: options.errorHTML || {},
        hintHtml: options.hintHtml || {}
      };
      return new Tower.View.Form.Field([], _.extend(defaults, options)).render(block);
    };

    Builder.prototype.button = function() {
      var args, block, options;
      args = Tower.Support.Array.args(arguments);
      block = Tower.Support.Array.extractBlock(args);
      options = Tower.Support.Array.extractOptions(args);
      options.as || (options.as = "submit");
      options.value = args.shift() || "Submit";
      if (options.as === "submit") {
        options["class"] = Tower.View.submitFieldsetClass;
      }
      return this.field(options.value, options, block);
    };

    Builder.prototype.submit = Builder.prototype.button;

    Builder.prototype.partial = function(path, options) {
      if (options == null) options = {};
      return this.template.render({
        partial: path,
        locals: options.merge({
          fields: self
        })
      });
    };

    Builder.prototype.tag = function() {
      var args, key;
      key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.template.tag(key, args);
    };

    Builder.prototype.render = function(block) {
      return block(this);
    };

    return Builder;

  })(Tower.View.Component);

  Tower.View.Form.Field = (function(_super) {

    __extends(Field, _super);

    Field.prototype.addClass = function(string, args) {
      var arg, result, _len5, _m;
      result = string ? string.split(/\s+/g) : [];
      for (_m = 0, _len5 = args.length; _m < _len5; _m++) {
        arg = args[_m];
        if (!arg) continue;
        if (!(result.indexOf(arg) > -1)) result.push(arg);
      }
      return result.join(" ");
    };

    Field.prototype.toId = function(options) {
      var result;
      if (options == null) options = {};
      result = Tower.Support.String.parameterize(this.model.constructor.name);
      if (options.parentIndex) result += "-" + options.parentIndex;
      result += "-" + (Tower.Support.String.parameterize(this.attribute));
      result += "-" + (options.type || "field");
      if (this.index != null) result += "-" + this.index;
      return result;
    };

    Field.prototype.toParam = function(options) {
      var result;
      if (options == null) options = {};
      result = Tower.Support.String.parameterize(this.model.constructor.name);
      if (options.parentIndex) result += "[" + options.parentIndex + "]";
      result += "[" + this.attribute + "]";
      if (this.index != null) result += "[" + this.index + "]";
      return result;
    };

    function Field(args, options) {
      var classes, field, inputType, pattern, value, _base, _base2, _base3, _base4, _base5;
      this.labelValue = options.label;
      delete options.label;
      Field.__super__.constructor.call(this, args, options);
      this.required || (this.required = false);
      field = this.model.constructor.fields()[this.attribute];
      options.as || (options.as = field ? Tower.Support.String.camelize(field.type, true) : "string");
      this.inputType = inputType = options.as;
      this.required = !!(field && field.required === true);
      classes = [Tower.View.fieldClass, inputType];
      if (!(["submit", "fieldset"].indexOf(inputType) > -1)) {
        classes.push(field.required ? Tower.View.requiredClass : Tower.View.optionalClass);
        classes.push(field.errors ? Tower.View.errorClass : Tower.View.validClass);
        if (options.validate !== false && field.validations) {
          classes.push(Tower.View.validateClass);
        }
      }
      this.fieldHTML["class"] = this.addClass(this.fieldHTML["class"], classes);
      if (!this.fieldHTML.id && Tower.View.idEnabledOn.indexOf("field") > -1) {
        this.fieldHTML.id = this.toId({
          type: "field",
          index: this.index,
          parentIndex: this.parentIndex
        });
      }
      this.inputHTML.id = this.toId({
        type: "input",
        index: this.index,
        parentIndex: this.parentIndex
      });
      if (!(["hidden", "submit"].indexOf(inputType) > -1)) {
        (_base = this.labelHTML)["for"] || (_base["for"] = this.inputHTML.id);
        this.labelHTML["class"] = this.addClass(this.labelHTML["class"], [Tower.View.labelClass]);
        if (this.labelValue !== false) {
          this.labelValue || (this.labelValue = Tower.Support.String.camelize(this.attribute.toString()));
        }
        if (options.hint !== false) {
          this.errorHTML["class"] = this.addClass(this.errorHTML["class"], [Tower.View.errorClass]);
          if (Tower.View.includeAria && Tower.View.hintIsPopup) {
            (_base2 = this.errorHTML).role || (_base2.role = "tooltip");
          }
        }
      }
      this.attributes = this.fieldHTML;
      if (inputType !== "submit") {
        (_base3 = this.inputHTML).name || (_base3.name = this.toParam());
      }
      this.value = options.value;
      this.dynamic = options.dynamic === true;
      this.richInput = options.hasOwnProperty("rich_input") ? !!options.rich_input : Tower.View.richInput;
      this.validate = options.validate !== false;
      classes = [inputType, Tower.Support.String.parameterize(this.attribute), this.inputHTML["class"]];
      if (!(["submit", "fieldset"].indexOf(inputType) > -1)) {
        classes.push(field.required ? Tower.View.requiredClass : Tower.View.optionalClass);
        classes.push(field.errors ? Tower.View.errorClass : Tower.View.validClass);
        classes.push("input");
        if (options.validate !== false && field.validations) {
          classes.push(Tower.View.validateClass);
        }
      }
      this.inputHTML["class"] = this.addClass(this.inputHTML["class"], classes);
      if (options.placeholder) this.inputHTML.placeholder = options.placeholder;
      if (this.inputHTML.value == null) {
        if (options.hasOwnProperty("value")) this.inputHTML.value = options.value;
        if (this.inputHTML.value == null) {
          value = this.model.get(this.attribute);
          if (value) this.inputHTML.value = value;
        }
      }
      if (options.hasOwnProperty("max")) {
        (_base4 = this.inputHTML).maxlength || (_base4.maxlength = options.max);
      }
      pattern = options.match;
      if (_.isRegExp(pattern)) pattern = pattern.toString();
      if (pattern != null) this.inputHTML["data-match"] = pattern;
      this.inputHTML["aria-required"] = this.required.toString();
      if (this.required === true) this.inputHTML.required = "true";
      if (this.disabled) this.inputHTML.disabled = "true";
      if (this.autofocus === true) this.inputHTML.autofocus = "true";
      if (this.dynamic) this.inputHTML["data-dynamic"] = "true";
      if (this.inputHTML.placeholder) {
        (_base5 = this.inputHTML).title || (_base5.title = this.inputHTML.placeholder);
      }
      this.autocomplete = this.inputHTML.autocomplete === true;
      if (this.autocomplete && Tower.View.includeAria) {
        this.inputHTML["aria-autocomplete"] = (function() {
          switch (this.autocomplete) {
            case "inline":
            case "list":
            case "both":
              return this.autocomplete;
            default:
              return "both";
          }
        }).call(this);
      }
    }

    Field.prototype.input = function() {
      var args, options;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      options = _.extend(this.inputHTML, Tower.Support.Array.extractOptions(args));
      key = args.shift() || this.attribute;
      return this["" + this.inputType + "Input"](key, options);
    };

    Field.prototype.checkboxInput = function(key, options) {
      return this.tag("input", _.extend({
        type: "checkbox"
      }, options));
    };

    Field.prototype.stringInput = function(key, options) {
      return this.tag("input", _.extend({
        type: "text"
      }, options));
    };

    Field.prototype.submitInput = function(key, options) {
      var value;
      value = options.value;
      delete options.value;
      return this.tag("button", _.extend({
        type: "submit"
      }, options), value);
    };

    Field.prototype.fileInput = function(key, options) {
      return this.tag("input", _.extend({
        type: "file"
      }, options));
    };

    Field.prototype.textInput = function(key, options) {
      var value;
      value = options.value;
      delete options.value;
      return this.tag("textarea", options, value);
    };

    Field.prototype.passwordInput = function(key, options) {
      return this.tag("input", _.extend({
        type: "password"
      }, options));
    };

    Field.prototype.emailInput = function(key, options) {
      return this.tag("input", _.extend({
        type: "email"
      }, options));
    };

    Field.prototype.urlInput = function(key, options) {
      return this.tag("input", _.extend({
        type: "url"
      }, options));
    };

    Field.prototype.numberInput = function(key, options) {
      return this.tag("input", _.extend({
        type: "string",
        "data-type": "numeric"
      }, options));
    };

    Field.prototype.searchInput = function(key, options) {
      return this.tag("input", _.extend({
        type: "search",
        "data-type": "search"
      }, options));
    };

    Field.prototype.phoneInput = function(key, options) {
      return this.tag("input", _.extend({
        type: "tel",
        "data-type": "phone"
      }, options));
    };

    Field.prototype.arrayInput = function(key, options) {
      if (options.value) {
        options.value = Tower.Support.Object.toArray(options.value).join(", ");
      }
      return this.tag("input", _.extend({
        "data-type": "array"
      }, options));
    };

    Field.prototype.label = function() {
      var _this = this;
      if (!this.labelValue) return;
      return this.tag("label", this.labelHTML, function() {
        _this.tag("span", _this.labelValue);
        if (_this.required) {
          return _this.tag("abbr", {
            title: Tower.View.requiredTitle,
            "class": Tower.View.requiredClass
          }, function() {
            return Tower.View.requiredAbbr;
          });
        } else {
          return _this.tag("abbr", {
            title: Tower.View.optionalTitle,
            "class": Tower.View.optionalClass
          }, function() {
            return Tower.View.optionalAbbr;
          });
        }
      });
    };

    Field.prototype.render = function(block) {
      var _this = this;
      return this.tag(Tower.View.fieldTag, this.attributes, function() {
        if (block) {
          return block.call(_this);
        } else {
          _this.label();
          if (_this.inputType === "submit") {
            return _this.input();
          } else {
            return _this.tag("div", {
              "class": "controls"
            }, function() {
              return _this.input();
            });
          }
        }
      });
    };

    Field.prototype.extractElements = function(options) {
      var elements, _base;
      if (options == null) options = {};
      elements = [];
      if (typeof (_base = ["hidden", "submit"]).include === "function" ? _base.include(inputType) : void 0) {
        elements.push("inputs");
      } else {
        if ((this.label.present != null) && (this.label.value != null)) {
          elements.push("label");
        }
        elements = elements.concat(["inputs", "hints", "errors"]);
      }
      return elements;
    };

    return Field;

  })(Tower.View.Component);

  Tower.View.Form.Fieldset = (function(_super) {

    __extends(Fieldset, _super);

    function Fieldset(args, options) {
      var attributes;
      Fieldset.__super__.constructor.apply(this, arguments);
      this.attributes = attributes = {};
      delete attributes.index;
      delete attributes.parentIndex;
      delete attributes.label;
      this.builder = new Tower.View.Form.Builder([], {
        template: this.template,
        model: this.model,
        attribute: this.attribute,
        index: this.index,
        parentIndex: this.parentIndex
      });
    }

    Fieldset.prototype.render = function(block) {
      var _this = this;
      return this.tag("fieldset", this.attributes, function() {
        if (_this.label) {
          _this.tag("legend", {
            "class": Tower.View.legendClass
          }, function() {
            return _this.tag("span", _this.label);
          });
        }
        return _this.tag(Tower.View.fieldListTag, {
          "class": Tower.View.fieldListClass
        }, function() {
          return _this.builder.render(block);
        });
      });
    };

    return Fieldset;

  })(Tower.View.Component);

  Tower.View.AssetHelper = {
    javascripts: function() {
      var options, path, paths, sources, _len5, _m;
      sources = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      options = Tower.Support.Array.extractOptions(sources);
      options.namespace = "javascripts";
      options.extension = "js";
      paths = _extractAssetPaths(sources, options);
      for (_m = 0, _len5 = paths.length; _m < _len5; _m++) {
        path = paths[_m];
        javascriptTag(path);
      }
      return null;
    },
    javascript: function() {
      return javascript.apply(this, arguments);
    },
    stylesheets: function() {
      var options, path, paths, sources, _len5, _m;
      sources = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      options = Tower.Support.Array.extractOptions(sources);
      options.namespace = "stylesheets";
      options.extension = "css";
      paths = _extractAssetPaths(sources, options);
      for (_m = 0, _len5 = paths.length; _m < _len5; _m++) {
        path = paths[_m];
        stylesheetTag(path);
      }
      return null;
    },
    stylesheet: function() {
      return stylesheets.apply(this, arguments);
    },
    _extractAssetPaths: function(sources, options) {
      var extension, manifest, namespace, path, paths, result, source, _len5, _len6, _len7, _m, _n, _o;
      if (options == null) options = {};
      namespace = options.namespace;
      extension = options.extension;
      result = [];
      if (Tower.env === "production") {
        manifest = Tower.assetManifest;
        for (_m = 0, _len5 = sources.length; _m < _len5; _m++) {
          source = sources[_m];
          if (!source.match(/^(http|\/{2})/)) {
            source = "" + source + "." + extension;
            if (manifest[source]) source = manifest[source];
            source = "/assets/" + source;
            if (Tower.assetHost) source = "" + Tower.assetHost + source;
          }
          result.push(source);
        }
      } else {
        for (_n = 0, _len6 = sources.length; _n < _len6; _n++) {
          source = sources[_n];
          if (!!source.match(/^(http|\/{2})/)) {
            result.push(source);
          } else {
            paths = Tower.config.assets[namespace][source];
            if (paths) {
              for (_o = 0, _len7 = paths.length; _o < _len7; _o++) {
                path = paths[_o];
                result.push("/" + namespace + path + "." + extension);
              }
            }
          }
        }
      }
      return result;
    },
    stylesheetTag: function(source) {
      return link({
        rel: 'stylesheet',
        href: source
      });
    },
    javascriptTag: function(source) {
      return script({
        src: source
      });
    }
  };

  Tower.View.ComponentHelper = {
    formFor: function() {
      var _ref5;
      return (_ref5 = Tower.View.Form).render.apply(_ref5, [__ck].concat(__slice.call(arguments)));
    },
    tableFor: function() {
      var _ref5;
      return (_ref5 = Tower.View.Table).render.apply(_ref5, [__ck].concat(__slice.call(arguments)));
    },
    widget: function() {},
    linkTo: function(title, path, options) {
      if (options == null) options = {};
      return a(_.extend(options, {
        href: path,
        title: title
      }), title.toString());
    },
    navItem: function(title, path, options) {
      if (options == null) options = {};
      return li(function() {
        return linkTo(title, path, options);
      });
    }
  };

  Tower.View.ElementHelper = {
    title: function(value) {
      return document.title = value;
    },
    addClass: function() {
      var classes, part, parts, string, _len5, _m;
      string = arguments[0], parts = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      classes = string.split(/\ +/);
      for (_m = 0, _len5 = parts.length; _m < _len5; _m++) {
        part = parts[_m];
        if (classes.indexOf(part) > -1) classes.push(part);
      }
      return classes.join(" ");
    },
    elementId: function() {
      return "#" + (this.elementKey.apply(this, arguments));
    },
    elementClass: function() {
      return "." + (this.elementKey.apply(this, arguments));
    },
    elementKey: function() {
      return Tower.Support.String.parameterize(this.elementNameComponents.apply(this, arguments).join("-"));
    },
    elementName: function() {
      var i, item, result, _len5;
      result = this.elementNameComponents.apply(this, arguments);
      i = 1;
      for (i = 0, _len5 = result.length; i < _len5; i++) {
        item = result[i];
        result[i] = "[" + item + "]";
      }
      return Tower.Support.String.parameterize(result.join(""));
    },
    elementNameComponents: function() {
      var args, item, result, _len5, _m;
      args = Tower.Support.Array.args(arguments);
      result = [];
      for (_m = 0, _len5 = args.length; _m < _len5; _m++) {
        item = args[_m];
        switch (typeof item) {
          case "function":
            result.push(item.constructor.name);
            break;
          case "string":
            result.push(item);
            break;
          default:
            result.push(item.toString());
        }
      }
      return result;
    }
  };

  Tower.View.HeadHelper = {
    metaTag: function(name, content) {
      return meta({
        name: name,
        content: content
      });
    },
    snapshotLinkTag: function(href) {
      return linkTag({
        rel: "imageSrc",
        href: href
      });
    },
    html4ContentTypeTag: function(charset, type) {
      if (charset == null) charset = "UTF-8";
      if (type == null) type = "text/html";
      return httpMetaTag("Content-Type", "" + type + "; charset=" + charset);
    },
    chromeFrameTag: function() {
      html4ContentTypeTag();
      return meta({
        "http-equiv": "X-UA-Compatible",
        content: "IE=Edge,chrome=1"
      });
    },
    html5ContentTypeTag: function(charset) {
      if (charset == null) charset = "UTF-8";
      return meta({
        charset: charset
      });
    },
    contentTypeTag: function(charset) {
      return html5ContentTypeTag(charset);
    },
    csrfMetaTag: function() {
      return metaTag("csrf-token", this.request.session._csrf);
    },
    searchLinkTag: function(href, title) {
      return linkTag({
        rel: "search",
        type: "application/opensearchdescription+xml",
        href: href,
        title: title
      });
    },
    faviconLinkTag: function(favicon) {
      if (favicon == null) favicon = "/favicon.ico";
      return linkTag({
        rel: "shortcut icon",
        href: favicon,
        type: "image/x-icon"
      });
    },
    linkTag: function(options) {
      if (options == null) options = {};
      return link(options);
    },
    ieApplicationMetaTags: function(title, options) {
      var result;
      if (options == null) options = {};
      result = [];
      result.push(metaTag("application-name", title));
      if (options.hasOwnProperty("tooltip")) {
        result.push(metaTag("msapplication-tooltip", options.tooltip));
      }
      if (options.hasOwnProperty("url")) {
        result.push(metaTag("msapplication-starturl", options.url));
      }
      if (options.hasOwnProperty("width") && options.hasOwnProperty("height")) {
        result.push(metaTag("msapplication-window", "width=" + options.width + ";height=" + options.height));
        if (options.hasOwnProperty("color")) {
          result.push(metaTag("msapplication-navbutton-color", options.color));
        }
      }
      return result.join("\n");
    },
    ieTaskMetaTag: function(name, path, icon) {
      var content;
      if (icon == null) icon = null;
      content = [];
      content.push("name=" + name);
      content.push("uri=" + path);
      if (icon) content.push("icon-uri=" + icon);
      return this.metaTag("msapplication-task", content.join(";"));
    },
    appleMetaTags: function(options) {
      var result;
      if (options == null) options = {};
      result = [];
      result.push(appleViewportMetaTag(options));
      if (options.hasOwnProperty("fullScreen")) {
        result.push(appleFullScreenMetaTag(options.fullScreen));
      }
      if (options.hasOwnProperty("mobile")) {
        result.push(appleMobileCompatibleMetaTag(options.mobile));
      }
      return result.join();
    },
    appleViewportMetaTag: function(options) {
      var viewport;
      if (options == null) options = {};
      viewport = [];
      if (options.hasOwnProperty("width")) viewport.push("width=" + options.width);
      if (options.hasOwnProperty("height")) {
        viewport.push("height=" + options.height);
      }
      viewport.push("initial-scale=" + (options.scale || 1.0));
      if (options.hasOwnProperty("min")) {
        viewport.push("minimum-scale=" + options.min);
      }
      if (options.hasOwnProperty("max")) {
        viewport.push("maximum-scale=" + options.max);
      }
      if (options.hasOwnProperty("scalable")) {
        viewport.push("user-scalable=" + (boolean(options.scalable)));
      }
      return metaTag("viewport", viewport.join(", "));
    },
    appleFullScreenMetaTag: function(value) {
      return metaTag("apple-touch-fullscreen", boolean(value));
    },
    appleMobileCompatibleMetaTag: function(value) {
      return metaTag("apple-mobile-web-app-capable", boolean(value));
    },
    appleTouchIconLinkTag: function(path, options) {
      var rel;
      if (options == null) options = {};
      rel = ["apple-touch-icon"];
      if (options.hasOwnProperty("size")) {
        rel.push("" + options.size + "x" + options.size);
      }
      if (options.precomposed) rel.push("precomposed");
      return linkTag({
        rel: rel.join("-"),
        href: path
      });
    },
    appleTouchIconLinkTags: function() {
      var options, path, result, size, sizes, _len5, _m;
      path = arguments[0], sizes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof sizes[sizes.length - 1] === "object") {
        options = sizes.pop();
      } else {
        options = {};
      }
      result = [];
      for (_m = 0, _len5 = sizes.length; _m < _len5; _m++) {
        size = sizes[_m];
        result.push(appleTouchIconLinkTag(path, _.extend({
          size: size
        }, options)));
      }
      return result.join();
    },
    openGraphMetaTags: function(options) {
      if (options == null) options = {};
      if (options.title) openGraphMetaTag("og:title", options.title);
      if (options.type) openGraphMetaTag("og:type", options.type);
      if (options.image) openGraphMetaTag("og:image", options.image);
      if (options.site) openGraphMetaTag("og:siteName", options.site);
      if (options.description) {
        openGraphMetaTag("og:description", options.description);
      }
      if (options.email) openGraphMetaTag("og:email", options.email);
      if (options.phone) openGraphMetaTag("og:phoneNumber", options.phone);
      if (options.fax) openGraphMetaTag("og:faxNumber", options.fax);
      if (options.lat) openGraphMetaTag("og:latitude", options.lat);
      if (options.lng) openGraphMetaTag("og:longitude", options.lng);
      if (options.street) openGraphMetaTag("og:street-address", options.street);
      if (options.city) openGraphMetaTag("og:locality", options.city);
      if (options.state) openGraphMetaTag("og:region", options.state);
      if (options.zip) openGraphMetaTag("og:postal-code", options.zip);
      if (options.country) openGraphMetaTag("og:country-name", options.country);
      return null;
    },
    openGraphMetaTag: function(property, content) {
      return meta({
        property: property,
        content: content
      });
    }
  };

  Tower.View.RenderingHelper = {
    partial: function(path, options, callback) {
      var item, locals, name, prefixes, template, tmpl, _len5, _m, _ref5;
      try {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        options || (options = {});
        options.locals || (options.locals = {});
        locals = options.locals;
        path = path.split("/");
        path[path.length - 1] = "_" + path[path.length - 1];
        path = path.join("/");
        prefixes = options.prefixes;
        if (this._context) prefixes || (prefixes = [this._context.collectionName]);
        template = this._readTemplate(path, prefixes, options.type || Tower.View.engine);
        template = this.renderWithEngine(String(template));
        if (options.collection) {
          name = options.as || Tower.Support.String.camelize(options.collection[0].constructor.name, true);
          tmpl = eval("(function(data) { with(data) { this." + name + " = " + name + "; " + (String(template)) + " } })");
          _ref5 = options.collection;
          for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
            item = _ref5[_m];
            locals[name] = item;
            tmpl.call(this, locals);
            delete this[name];
          }
        } else {
          tmpl = "(function(data) { with(data) { " + (String(template)) + " } })";
          eval(tmpl).call(this, locals);
        }
      } catch (error) {
        console.log(error.stack || error);
      }
      return null;
    },
    page: function() {
      var args, browserTitle, options;
      args = Tower.Support.Array.args(arguments);
      options = Tower.Support.Array.extractOptions(args);
      browserTitle = args.shift() || options.title;
      return this.contentFor("title", function() {
        return title(browserTitle);
      });
    },
    urlFor: function() {
      return Tower.urlFor.apply(Tower, arguments);
    },
    yields: function(key) {
      var ending, value;
      value = this[key];
      if (typeof value === "function") {
        eval("(" + (String(value)) + ")()");
      } else {
        ending = value.match(/\n$/) ? "\n" : "";
        text(value.replace(/\n$/, "").replace(/^(?!\s+$)/mg, __ck.repeat('  ', __ck.tabs)) + ending);
      }
      return null;
    },
    hasContentFor: function(key) {
      return !!(this.hasOwnProperty(key) && this[key] && this[key] !== "");
    },
    has: function(key) {
      return !!(this.hasOwnProperty(key) && this[key] && this[key] !== "");
    },
    contentFor: function(key, block) {
      this[key] = block;
      return null;
    }
  };

  Tower.View.StringHelper = {
    HTML_ESCAPE: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    },
    preserve: function(text) {
      return text.replace(/\n/g, '&#x000A;').replace(/\r/g, '');
    },
    htmlEscape: function(text) {
      var _this = this;
      return text.replace(/[\"><&]/g, function(_) {
        return _this.HTML_ESCAPE[_];
      });
    },
    t: function(string) {
      return Tower.Support.I18n.translate(string);
    },
    l: function(object) {
      return Tower.Support.I18n.localize(string);
    },
    boolean: function(boolean) {
      if (boolean) {
        return "yes";
      } else {
        return "no";
      }
    }
  };

  Tower.View.include(Tower.View.Rendering);

  Tower.View.include(Tower.View.Helpers);

  Tower.View.include(Tower.View.AssetHelper);

  Tower.View.include(Tower.View.ComponentHelper);

  Tower.View.include(Tower.View.HeadHelper);

  Tower.View.include(Tower.View.RenderingHelper);

  Tower.View.include(Tower.View.StringHelper);

  Tower.View.helpers.push(Tower.View.AssetHelper);

  Tower.View.helpers.push(Tower.View.ComponentHelper);

  Tower.View.helpers.push(Tower.View.HeadHelper);

  Tower.View.helpers.push(Tower.View.RenderingHelper);

  Tower.View.helpers.push(Tower.View.StringHelper);

  $.fn.serializeParams = function(coerce) {
    return $.serializeParams($(this).serialize(), coerce);
  };

  $.serializeParams = function(params, coerce) {
    var array, coerce_types, cur, i, index, item, keys, keys_last, obj, param, val, _len5;
    obj = {};
    coerce_types = {
      "true": !0,
      "false": !1,
      "null": null
    };
    array = params.replace(/\+/g, " ").split("&");
    for (index = 0, _len5 = array.length; index < _len5; index++) {
      item = array[index];
      param = item.split("=");
      key = decodeURIComponent(param[0]);
      val = void 0;
      cur = obj;
      i = 0;
      keys = key.split("][");
      keys_last = keys.length - 1;
      if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
        keys[keys_last] = keys[keys_last].replace(/\]$/, "");
        keys = keys.shift().split("[").concat(keys);
        keys_last = keys.length - 1;
      } else {
        keys_last = 0;
      }
      if (param.length === 2) {
        val = decodeURIComponent(param[1]);
        if (coerce) {
          val = (val && !isNaN(val) ? +val : (val === "undefined" ? undefined : (coerce_types[val] !== undefined ? coerce_types[val] : val)));
        }
        if (keys_last) {
          while (i <= keys_last) {
            key = (keys[i] === "" ? cur.length : keys[i]);
            cur = cur[key] = (i < keys_last ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val);
            i++;
          }
        } else {
          if ($.isArray(obj[key])) {
            obj[key].push(val);
          } else if (obj[key] !== undefined) {
            obj[key] = [obj[key], val];
          } else {
            obj[key] = val;
          }
        }
      } else {
        if (key) obj[key] = (coerce ? undefined : "");
      }
    }
    return obj;
  };

  Tower.View.MetaHelper = {
    title: function(string) {
      return document.title = string;
    }
  };

  Tower.View.ValidationHelper = {
    success: function() {
      return this.redirectTo("/");
    },
    failure: function(error) {
      if (error) {
        return this.flashError(error);
      } else {
        return this.invalidate();
      }
    },
    invalidate: function() {
      var attribute, element, errors, field, _ref5, _results;
      element = $("#" + this.resourceName + "-" + this.elementName);
      _ref5 = this.resource.errors;
      _results = [];
      for (attribute in _ref5) {
        errors = _ref5[attribute];
        field = $("#" + this.resourceName + "-" + attribute + "-field");
        if (field.length) {
          field.css("background", "yellow");
          _results.push($("input", field).after("<output class='error'>" + (errors.join("\n")) + "</output>"));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  Tower.Controller = (function(_super) {

    __extends(Controller, _super);

    Controller.include(Tower.Support.Callbacks);

    Controller.extend(Tower.Support.EventEmitter);

    Controller.include(Tower.Support.EventEmitter);

    Controller.instance = function() {
      return this._instance || (this._instance = new this);
    };

    Controller.metadata = function() {
      return this._metadata || (this._metadata = {});
    };

    function Controller() {
      this.constructor._instance = this;
      this.headers = {};
      this.status = 200;
      this.request = null;
      this.response = null;
      this.params = {};
      this.query = {};
      this.resourceName = this.constructor.resourceName();
      this.resourceType = this.constructor.resourceType();
      this.collectionName = this.constructor.collectionName();
      this.formats = _.keys(this.constructor.mimes());
      this.hasParent = this.constructor.hasParent();
    }

    return Controller;

  })(Tower.Class);

  Tower.Controller.Callbacks = {
    ClassMethods: {
      beforeAction: function() {
        return this.before.apply(this, ["action"].concat(__slice.call(arguments)));
      },
      afterAction: function() {
        return this.after.apply(this, ["action"].concat(__slice.call(arguments)));
      }
    }
  };

  Tower.Controller.Helpers = {
    ClassMethods: {
      helper: function(object) {
        this._helpers || (this._helpers = []);
        return this._helpers.push(object);
      },
      layout: function(layout) {
        return this._layout = layout;
      }
    },
    layout: function() {
      var layout;
      layout = this.constructor._layout;
      if (typeof layout === "function") {
        return layout.call(this);
      } else {
        return layout;
      }
    }
  };

  Tower.Controller.Instrumentation = {
    call: function(request, response, next) {
      this.request = request;
      this.response = response;
      this.params = this.request.params || {};
      this.cookies = this.request.cookies || {};
      this.query = this.request.query || {};
      this.session = this.request.session || {};
      this.format = this.params.format || "html";
      this.action = this.params.action;
      this.headers = {};
      this.callback = next;
      return this.process();
    },
    process: function() {
      var _this = this;
      this.processQuery();
      if (!Tower.env.match(/(test|production)/)) {
        console.log("  Processing by " + this.constructor.name + "#" + this.action + " as " + (this.format.toUpperCase()));
        console.log("  Parameters:");
        console.log(this.params);
      }
      return this.runCallbacks("action", {
        name: this.action
      }, function(callback) {
        return _this[_this.action].call(_this, callback);
      });
    },
    processQuery: function() {},
    clear: function() {
      this.request = null;
      this.response = null;
      return this.headers = null;
    }
  };

  Tower.Controller.Params = {
    ClassMethods: {
      params: function(options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        if (options) {
          this._paramsOptions = Tower.Support.Object.extend(this._paramsOptions || {}, options);
          if (callback) callback.call(this);
        }
        return this._params || (this._params = {});
      },
      param: function(key, options) {
        if (options == null) options = {};
        this._params || (this._params = {});
        return this._params[key] = Tower.HTTP.Param.create(key, Tower.Support.Object.extend({}, this._paramsOptions || {}, options));
      }
    },
    criteria: function() {
      var criteria, name, params, parser, parsers;
      if (this._criteria) return this._criteria;
      this._criteria = criteria = new Tower.Model.Criteria;
      parsers = this.constructor.params();
      params = this.params;
      for (name in parsers) {
        parser = parsers[name];
        if (params.hasOwnProperty(name)) {
          criteria.where(parser.toCriteria(params[name]));
        }
      }
      return criteria;
    }
  };

  Tower.Controller.Redirecting = {
    redirectTo: function() {
      return this.redirect.apply(this, arguments);
    },
    redirect: function() {
      var args, options, url;
      try {
        args = Tower.Support.Array.args(arguments);
        options = Tower.Support.Array.extractOptions(args);
        url = args.shift();
        if (!url && options.hasOwnProperty("action")) {
          url = (function() {
            switch (options.action) {
              case "index":
              case "new":
                return Tower.urlFor(this.resourceType, {
                  action: options.action
                });
              case "edit":
              case "show":
                return Tower.urlFor(this.resource, {
                  action: options.action
                });
            }
          }).call(this);
        }
        url || (url = "/");
        this.response.redirect(url);
      } catch (error) {
        console.log(error);
      }
      if (this.callback) return this.callback();
    }
  };

  Tower.Controller.Rendering = {
    ClassMethods: {
      addRenderer: function(key, block) {
        return this.renderers()[key] = block;
      },
      addRenderers: function(renderers) {
        var block, key;
        if (renderers == null) renderers = {};
        for (key in renderers) {
          block = renderers[key];
          this.addRenderer(key, block);
        }
        return this;
      },
      renderers: function() {
        return this._renderers || (this._renderers = {});
      }
    },
    render: function() {
      return this.renderToBody(this._normalizeRender.apply(this, arguments));
    },
    renderToBody: function(options) {
      this._processRenderOptions(options);
      return this._renderTemplate(options);
    },
    renderToString: function() {
      return this.renderToBody(this._normalizeRender.apply(this, arguments));
    },
    sendFile: function(path, options) {
      if (options == null) options = {};
    },
    sendData: function(data, options) {
      if (options == null) options = {};
    },
    _renderTemplate: function(options) {
      var callback, view, _base, _callback,
        _this = this;
      _callback = options.callback;
      callback = function(error, body) {
        if (error) {
          _this.status || (_this.status = 404);
          _this.body = error.stack;
        } else {
          _this.status || (_this.status = 200);
          _this.body = body;
        }
        if (_callback) _callback.apply(_this, arguments);
        if (_this.callback) return _this.callback();
      };
      if (this._handleRenderers(options, callback)) return;
      (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = "text/html");
      view = new Tower.View(this);
      try {
        return view.render.call(view, options, callback);
      } catch (error) {
        return callback(error);
      }
    },
    _handleRenderers: function(options, callback) {
      var name, renderer, _ref5;
      _ref5 = Tower.Controller.renderers();
      for (name in _ref5) {
        renderer = _ref5[name];
        if (options.hasOwnProperty(name)) {
          renderer.call(this, options[name], options, callback);
          return true;
        }
      }
      return false;
    },
    _processRenderOptions: function(options) {
      if (options == null) options = {};
      if (options.status) this.status = options.status;
      if (options.contentType) this.headers["Content-Type"] = options.contentType;
      if (options.location) {
        this.headers["Location"] = this.urlFor(options.location);
      }
      return this;
    },
    _normalizeRender: function() {
      return this._normalizeOptions(this._normalizeArgs.apply(this, arguments));
    },
    _normalizeArgs: function() {
      var action, args, callback, options;
      args = Tower.Support.Array.args(arguments);
      if (typeof args[0] === "string") action = args.shift();
      if (typeof args[0] === "object") options = args.shift();
      if (typeof args[0] === "function") callback = args.shift();
      options || (options = {});
      if (action) {
        key = !!action.match(/\//) ? "file" : "action";
        options[key] = action;
      }
      if (callback) options.callback = callback;
      return options;
    },
    _normalizeOptions: function(options) {
      if (options == null) options = {};
      if (options.partial === true) options.partial = this.action;
      options.prefixes || (options.prefixes = []);
      options.prefixes.push(this.collectionName);
      options.template || (options.template = options.file || (options.action || this.action));
      return options;
    }
  };

  Tower.Controller.Resourceful = {
    ClassMethods: {
      resource: function(options) {
        if (options.hasOwnProperty("name")) this._resourceName = options.name;
        if (options.hasOwnProperty("type")) this._resourceType = options.type;
        if (options.hasOwnProperty("collectionName")) {
          this._collectionName = options.collectionName;
        }
        return this;
      },
      resourceType: function() {
        return this._resourceType || (this._resourceType = Tower.Support.String.singularize(this.name.replace(/(Controller)$/, "")));
      },
      resourceName: function() {
        var parts;
        if (this._resourceName) return this._resourceName;
        parts = this.resourceType().split(".");
        return this._resourceName = Tower.Support.String.camelize(parts[parts.length - 1], true);
      },
      collectionName: function() {
        return this._collectionName || (this._collectionName = Tower.Support.String.camelize(this.name.replace(/(Controller)$/, ""), true));
      },
      belongsTo: function(key, options) {
        if (options == null) options = {};
        if (this._belongsTo) {
          this._belongsTo = this._belongsTo.concat();
        } else {
          this._belongsTo = [];
        }
        if (!key) return this._belongsTo;
        options.key = key;
        options.type || (options.type = Tower.Support.String.camelize(options.key));
        return this._belongsTo.push(options);
      },
      hasParent: function() {
        var belongsTo;
        belongsTo = this.belongsTo();
        return belongsTo.length > 0;
      },
      actions: function() {
        var action, actions, actionsToRemove, args, options, _len5, _m;
        args = Tower.Support.Array.args(arguments);
        if (typeof args[args.length - 1] === "object") {
          options = args.pop();
        } else {
          options = {};
        }
        actions = ["index", "new", "create", "show", "edit", "update", "destroy"];
        actionsToRemove = _.difference(actions, args, options.except || []);
        for (_m = 0, _len5 = actionsToRemove.length; _m < _len5; _m++) {
          action = actionsToRemove[_m];
          this[action] = null;
          delete this[action];
        }
        return this;
      }
    },
    index: function() {
      var _this = this;
      return this._index(function(format) {
        format.html(function() {
          return _this.render("index");
        });
        return format.json(function() {
          return _this.render({
            json: _this.collection,
            status: 200
          });
        });
      });
    },
    "new": function() {
      var _this = this;
      return this._new(function(format) {
        format.html(function() {
          return _this.render("new");
        });
        return format.json(function() {
          return _this.render({
            json: _this.resource,
            status: 200
          });
        });
      });
    },
    create: function(callback) {
      var _this = this;
      return this._create(function(format) {
        format.html(function() {
          return _this.redirectTo({
            action: "show"
          });
        });
        return format.json(function() {
          return _this.render({
            json: _this.resource,
            status: 200
          });
        });
      });
    },
    show: function() {
      var _this = this;
      return this._show(function(format) {
        format.html(function() {
          return _this.render("show");
        });
        return format.json(function() {
          return _this.render({
            json: _this.resource,
            status: 200
          });
        });
      });
    },
    edit: function() {
      var _this = this;
      return this._edit(function(format) {
        format.html(function() {
          return _this.render("edit");
        });
        return format.json(function() {
          return _this.render({
            json: _this.resource,
            status: 200
          });
        });
      });
    },
    update: function() {
      var _this = this;
      return this._update(function(format) {
        format.html(function() {
          return _this.redirectTo({
            action: "show"
          });
        });
        return format.json(function() {
          return _this.render({
            json: _this.resource,
            status: 200
          });
        });
      });
    },
    destroy: function() {
      var _this = this;
      return this._destroy(function(format) {
        format.html(function() {
          return _this.redirectTo({
            action: "index"
          });
        });
        return format.json(function() {
          return _this.render({
            json: _this.resource,
            status: 200
          });
        });
      });
    },
    _index: function(callback) {
      var _this = this;
      return this.findCollection(function(error, collection) {
        return _this.respondWith(collection, callback);
      });
    },
    _new: function(callback) {
      var _this = this;
      return this.buildResource(function(error, resource) {
        if (!resource) return _this.failure(error);
        return _this.respondWith(resource, callback);
      });
    },
    _create: function(callback) {
      var _this = this;
      return this.buildResource(function(error, resource) {
        if (!resource) return _this.failure(error, callback);
        return resource.save(function(error) {
          return _this.respondWithStatus(Tower.Support.Object.isBlank(resource.errors), callback);
        });
      });
    },
    _show: function(callback) {
      var _this = this;
      return this.findResource(function(error, resource) {
        return _this.respondWith(resource, callback);
      });
    },
    _edit: function(callback) {
      var _this = this;
      return this.findResource(function(error, resource) {
        return _this.respondWith(resource, callback);
      });
    },
    _update: function(callback) {
      var _this = this;
      return this.findResource(function(error, resource) {
        if (error) return _this.failure(error, callback);
        return resource.updateAttributes(_this.params[_this.resourceName], function(error) {
          return _this.respondWithStatus(!!!error && Tower.Support.Object.isBlank(resource.errors), callback);
        });
      });
    },
    _destroy: function(callback) {
      var _this = this;
      return this.findResource(function(error, resource) {
        if (error) return _this.failure(error, callback);
        return resource.destroy(function(error) {
          return _this.respondWithStatus(!!!error, callback);
        });
      });
    },
    respondWithScoped: function(callback) {
      var _this = this;
      return this.scoped(function(error, scope) {
        if (error) return _this.failure(error, callback);
        return _this.respondWith(scope.build(), callback);
      });
    },
    respondWithStatus: function(success, callback) {
      var failureResponder, options, successResponder;
      options = {
        records: this.resource || this.collection
      };
      if (callback && callback.length > 1) {
        successResponder = new Tower.Controller.Responder(this, options);
        failureResponder = new Tower.Controller.Responder(this, options);
        callback.call(this, successResponder, failureResponder);
        if (success) {
          return successResponder[format].call(this);
        } else {
          return failureResponder[format].call(this, error);
        }
      } else {
        return Tower.Controller.Responder.respond(this, options, callback);
      }
    },
    buildResource: function(callback) {
      var _this = this;
      return this.scoped(function(error, scope) {
        var resource;
        if (error) return callback.call(_this, error, null);
        _this[_this.resourceName] = _this.resource = resource = scope.build(_this.params[_this.resourceName]);
        if (callback) callback.call(_this, null, resource);
        return resource;
      });
    },
    findResource: function(callback) {
      var _this = this;
      return this.scoped(function(error, scope) {
        if (error) return callback.call(_this, error, null);
        return scope.find(_this.params.id, function(error, resource) {
          _this[_this.resourceName] = _this.resource = resource;
          return callback.call(_this, error, resource);
        });
      });
    },
    findCollection: function(callback) {
      var _this = this;
      return this.scoped(function(error, scope) {
        if (error) return callback.call(_this, error, null);
        return scope.all(function(error, collection) {
          _this[_this.collectionName] = _this.collection = collection;
          if (callback) return callback.call(_this, error, collection);
        });
      });
    },
    findParent: function(callback) {
      var parentClass, relation,
        _this = this;
      relation = this.findParentRelation();
      if (relation) {
        parentClass = Tower.constant(relation.type);
        return parentClass.find(this.params[relation.param], function(error, parent) {
          if (error && !callback) throw error;
          if (!error) _this.parent = _this[relation.key] = parent;
          if (callback) return callback.call(_this, error, parent);
        });
      } else {
        if (callback) callback.call(this, null, false);
        return false;
      }
    },
    findParentRelation: function() {
      var belongsTo, param, params, relation, _len5, _m;
      belongsTo = this.constructor.belongsTo();
      params = this.params;
      if (belongsTo.length > 0) {
        for (_m = 0, _len5 = belongsTo.length; _m < _len5; _m++) {
          relation = belongsTo[_m];
          param = relation.param || ("" + relation.key + "Id");
          if (params.hasOwnProperty(param)) {
            relation = Tower.Support.Object.extend({}, relation);
            relation.param = param;
            return relation;
          }
        }
        return null;
      } else {
        return null;
      }
    },
    scoped: function(callback) {
      var callbackWithScope,
        _this = this;
      callbackWithScope = function(error, scope) {
        return callback.call(_this, error, scope.where(_this.criteria()));
      };
      if (this.hasParent) {
        return this.findParent(function(error, parent) {
          if (error || !parent) {
            if (callback) return callback.call(_this, error || true);
          } else {
            return callbackWithScope(error, parent[_this.collectionName]());
          }
        });
      } else {
        return callbackWithScope(null, Tower.constant(this.resourceType));
      }
    },
    failure: function(resource, callback) {
      return callback();
    }
  };

  Tower.Controller.Responder = (function() {

    Responder.respond = function(controller, options, callback) {
      var responder;
      responder = new this(controller, options);
      return responder.respond(callback);
    };

    function Responder(controller, options) {
      var format, _len5, _m, _ref5;
      if (options == null) options = {};
      this.controller = controller;
      this.options = options;
      _ref5 = this.controller.formats;
      for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
        format = _ref5[_m];
        this.accept(format);
      }
    }

    Responder.prototype.accept = function(format) {
      return this[format] = function(callback) {
        return this["_" + format] = callback;
      };
    };

    Responder.prototype.respond = function(callback) {
      var method;
      if (callback) callback.call(this.controller, this);
      method = this["_" + this.controller.format];
      if (method) {
        return method.call(this);
      } else {
        return this.toFormat();
      }
    };

    Responder.prototype._html = function() {
      return this.controller.render({
        action: this.controller.action
      });
    };

    Responder.prototype._json = function() {
      return this.controller.render({
        json: this.options.records
      });
    };

    Responder.prototype.toFormat = function() {
      try {
        if ((typeof get !== "undefined" && get !== null) || !(typeof hasErrors !== "undefined" && hasErrors !== null)) {
          return this.defaultRender();
        } else {
          return this.displayErrors();
        }
      } catch (error) {
        return this._apiBehavior(error);
      }
    };

    Responder.prototype._navigationBehavior = function(error) {
      if (typeof get !== "undefined" && get !== null) {
        throw error;
      } else if ((typeof hasErrors !== "undefined" && hasErrors !== null) && defaultAction) {
        return this.render({
          action: this.defaultAction
        });
      } else {
        return this.redirectTo(this.navigationLocation);
      }
    };

    Responder.prototype._apiBehavior = function(error) {
      if (typeof get !== "undefined" && get !== null) {
        return this.display(resource);
      } else if (typeof post !== "undefined" && post !== null) {
        return this.display(resource, {
          status: "created",
          location: this.apiLocation
        });
      } else {
        return this.head("noContent");
      }
    };

    Responder.prototype.isResourceful = function() {
      return this.resource.hasOwnProperty("to" + (this.format.toUpperCase()));
    };

    Responder.prototype.resourceLocation = function() {
      return this.options.location || this.resources;
    };

    Responder.prototype.defaultRender = function() {
      return this.defaultResponse.call(options);
    };

    Responder.prototype.display = function(resource, givenOptions) {
      if (givenOptions == null) givenOptions = {};
      return this.controller.render(_.extend(givenOptions, this.options, {
        format: this.resource
      }));
    };

    Responder.prototype.displayErrors = function() {
      return this.controller.render({
        format: this.resourceErrors,
        status: "unprocessableEntity"
      });
    };

    Responder.prototype.hasErrors = function() {
      var _base;
      return (typeof (_base = this.resource).respondTo === "function" ? _base.respondTo("errors") : void 0) && !(this.resource.errors.empty != null);
    };

    Responder.prototype.defaultAction = function() {
      return this.action || (this.action = ACTIONS_FOR_VERBS[request.requestMethodSymbol]);
    };

    Responder.prototype.resourceErrors = function() {
      if (this.hasOwnProperty("" + format + "ResourceErrors")) {
        return this["" + format + "RresourceErrors"];
      } else {
        return this.resource.errors;
      }
    };

    Responder.prototype.jsonResourceErrors = function() {
      return {
        errors: this.resource.errors
      };
    };

    return Responder;

  })();

  Tower.Controller.Responding = {
    ClassMethods: {
      respondTo: function() {
        var args, except, mimes, name, only, options, _len5, _m;
        mimes = this.mimes();
        args = Tower.Support.Array.args(arguments);
        if (typeof args[args.length - 1] === "object") {
          options = args.pop();
        } else {
          options = {};
        }
        if (options.only) only = Tower.Support.Object.toArray(options.only);
        if (options.except) except = Tower.Support.Object.toArray(options.except);
        for (_m = 0, _len5 = args.length; _m < _len5; _m++) {
          name = args[_m];
          mimes[name] = {};
          if (only) mimes[name].only = only;
          if (except) mimes[name].except = except;
        }
        return this;
      },
      mimes: function() {
        return this._mimes || (this._mimes = {
          json: {},
          html: {}
        });
      }
    },
    respondTo: function(block) {
      return Tower.Controller.Responder.respond(this, {}, block);
    },
    respondWith: function() {
      var args, callback, options;
      args = Tower.Support.Array.args(arguments);
      callback = null;
      if (typeof args[args.length - 1] === "function") callback = args.pop();
      if (typeof args[args.length - 1] === "object" && !(args[args.length - 1] instanceof Tower.Model)) {
        options = args.pop();
      } else {
        options = {};
      }
      options || (options = {});
      options.records = args[0];
      return Tower.Controller.Responder.respond(this, options, callback);
    },
    _mimesForAction: function() {
      var action, config, mime, mimes, result, success;
      action = this.action;
      result = [];
      mimes = this.constructor.mimes();
      for (mime in mimes) {
        config = mimes[mime];
        success = false;
        if (config.except) {
          success = !_.include(config.except, action);
        } else if (config.only) {
          success = _.include(config.only, action);
        } else {
          success = true;
        }
        if (success) result.push(mime);
      }
      return result;
    }
  };

  Tower.Controller.include(Tower.Controller.Callbacks);

  Tower.Controller.include(Tower.Controller.Helpers);

  Tower.Controller.include(Tower.Controller.Instrumentation);

  Tower.Controller.include(Tower.Controller.Params);

  Tower.Controller.include(Tower.Controller.Redirecting);

  Tower.Controller.include(Tower.Controller.Rendering);

  Tower.Controller.include(Tower.Controller.Resourceful);

  Tower.Controller.include(Tower.Controller.Responding);

  Tower.Controller.Elements = {
    ClassMethods: {
      extractElements: function(target, options) {
        var key, method, result, selector, selectors;
        if (options == null) options = {};
        result = {};
        for (method in options) {
          selectors = options[method];
          for (key in selectors) {
            selector = selectors[key];
            result[key] = target[method](selector);
          }
        }
        return result;
      },
      processElements: function(target, options) {
        if (options == null) options = {};
        return this.elements = this.extractElements(target, options);
      },
      clickHandler: function(name, handler, options) {
        var _this = this;
        return $(this.dispatcher).on(name, function(event) {});
      },
      submitHandler: function(name, handler, options) {
        var _this = this;
        return $(this.dispatcher).on(name, function(event) {
          var action, elements, form, method, params, target;
          try {
            target = $(event.target);
            form = target.closest("form");
            action = form.attr("action");
            method = (form.attr("data-method") || form.attr("method")).toUpperCase();
            params = form.serializeParams();
            params.method = method;
            params.action = action;
            elements = _.extend({
              target: target,
              form: form
            }, {});
            _this._dispatch(handler, {
              elements: elements,
              params: params
            });
          } catch (error) {
            console.log(error);
          }
          return false;
        });
      },
      invalidForm: function() {
        var attribute, element, errors, field, _ref5, _results;
        element = $("#" + this.resourceName + "-" + this.elementName);
        _ref5 = this.resource.errors;
        _results = [];
        for (attribute in _ref5) {
          errors = _ref5[attribute];
          field = $("#" + this.resourceName + "-" + attribute + "-field");
          if (field.length) {
            field.css("background", "yellow");
            _results.push($("input", field).after("<output class='error'>" + (errors.join("\n")) + "</output>"));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    }
  };

  Tower.Controller.Events = {
    ClassMethods: {
      DOM_EVENTS: ["click", "dblclick", "blur", "error", "focus", "focusIn", "focusOut", "hover", "keydown", "keypress", "keyup", "load", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "ready", "resize", "scroll", "select", "submit", "tap", "taphold", "swipe", "swipeleft", "swiperight"],
      dispatcher: global,
      addEventHandler: function(name, handler, options) {
        if (options.type === "socket" || !name.match(this.DOM_EVENT_PATTERN)) {
          return this.addSocketEventHandler(name, handler, options);
        } else {
          return this.addDomEventHandler(name, handler, options);
        }
      },
      socketNamespace: function() {
        return Tower.Support.String.pluralize(Tower.Support.String.camelize(this.name.replace(/(Controller)$/, ""), false));
      },
      addSocketEventHandler: function(name, handler, options) {
        var _this = this;
        this.io || (this.io = Tower.Application.instance().io.connect(this.socketNamespace()));
        return this.io.on(name, function(data) {
          return _this._dispatch(void 0, handler, data);
        });
      },
      addDomEventHandler: function(name, handler, options) {
        var eventType, method, parts, selector,
          _this = this;
        parts = name.split(/\ +/);
        name = parts.shift();
        selector = parts.join(" ");
        if (selector && selector !== "") options.target = selector;
        options.target || (options.target = "body");
        eventType = name.split(/[\.:]/)[0];
        method = this["" + eventType + "Handler"];
        if (method) {
          method.call(this, name, handler, options);
        } else {
          $(this.dispatcher).on(name, options.target, function(event) {
            return _this._dispatch(handler, options);
          });
        }
        return this;
      },
      _dispatch: function(handler, options) {
        var controller;
        if (options == null) options = {};
        controller = this.instance();
        controller.elements || (controller.elements = {});
        controller.params || (controller.params = {});
        if (options.params) _.extend(controller.params, options.params);
        if (options.elements) _.extend(controller.elements, options.elements);
        if (typeof handler === "string") {
          return controller[handler].call(controller, event);
        } else {
          return handler.call(controller, event);
        }
      }
    }
  };

  Tower.Controller.Events.ClassMethods.DOM_EVENT_PATTERN = new RegExp("^(" + (Tower.Controller.Events.ClassMethods.DOM_EVENTS.join("|")) + ")");

  Tower.Controller.Handlers = {
    ClassMethods: {
      submitHandler: function(name, handler, options) {
        var _this = this;
        return $(this.dispatcher).on(name, function(event) {
          var action, elements, form, method, params, target;
          target = $(event.target);
          form = target.closest("form");
          action = form.attr("action");
          method = (form.attr("data-method") || form.attr("method")).toUpperCase();
          params = form.serializeParams();
          params.method = method;
          params.action = action;
          elements = _.extend({
            target: target,
            form: form
          }, {});
          return _this._dispatch(handler, {
            elements: elements,
            params: params
          });
        });
      }
    }
  };

  Tower.Controller.include(Tower.Controller.Elements);

  Tower.Controller.include(Tower.Controller.Events);

  Tower.Controller.include(Tower.Controller.Handlers);

  $.fn.serializeParams = function(coerce) {
    return $.serializeParams($(this).serialize(), coerce);
  };

  $.serializeParams = function(params, coerce) {
    var array, coerce_types, cur, i, index, item, keys, keys_last, obj, param, val, _len5;
    obj = {};
    coerce_types = {
      "true": !0,
      "false": !1,
      "null": null
    };
    array = params.replace(/\+/g, " ").split("&");
    for (index = 0, _len5 = array.length; index < _len5; index++) {
      item = array[index];
      param = item.split("=");
      key = decodeURIComponent(param[0]);
      val = void 0;
      cur = obj;
      i = 0;
      keys = key.split("][");
      keys_last = keys.length - 1;
      if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
        keys[keys_last] = keys[keys_last].replace(/\]$/, "");
        keys = keys.shift().split("[").concat(keys);
        keys_last = keys.length - 1;
      } else {
        keys_last = 0;
      }
      if (param.length === 2) {
        val = decodeURIComponent(param[1]);
        if (coerce) {
          val = (val && !isNaN(val) ? +val : (val === "undefined" ? undefined : (coerce_types[val] !== undefined ? coerce_types[val] : val)));
        }
        if (keys_last) {
          while (i <= keys_last) {
            key = (keys[i] === "" ? cur.length : keys[i]);
            cur = cur[key] = (i < keys_last ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val);
            i++;
          }
        } else {
          if ($.isArray(obj[key])) {
            obj[key].push(val);
          } else if (obj[key] !== undefined) {
            obj[key] = [obj[key], val];
          } else {
            obj[key] = val;
          }
        }
      } else {
        if (key) obj[key] = (coerce ? undefined : "");
      }
    }
    return obj;
  };

  Tower.HTTP = {};

  Tower.HTTP.Agent = (function() {

    function Agent(attributes) {
      if (attributes == null) attributes = {};
      _.extend(this, attributes);
    }

    Agent.prototype.toJSON = function() {
      return {
        family: this.family,
        major: this.major,
        minor: this.minor,
        patch: this.patch,
        version: this.version,
        os: this.os,
        name: this.name
      };
    };

    return Agent;

  })();

  Tower.HTTP.Cookies = (function() {

    Cookies.parse = function(string) {
      var eqlIndex, pair, pairs, result, value, _len5, _m;
      if (string == null) string = document.cookie;
      result = {};
      pairs = string.split(/[;,] */);
      for (_m = 0, _len5 = pairs.length; _m < _len5; _m++) {
        pair = pairs[_m];
        eqlIndex = pair.indexOf('=');
        key = pair.substring(0, eqlIndex).trim().toLowerCase();
        value = pair.substring(++eqlIndex, pair.length).trim();
        if ('"' === value[0]) value = value.slice(1, -1);
        if (result[key] === void 0) {
          value = value.replace(/\+/g, ' ');
          try {
            result[key] = decodeURIComponent(value);
          } catch (error) {
            if (error instanceof URIError) {
              result[key] = value;
            } else {
              throw err;
            }
          }
        }
      }
      return new this(result);
    };

    function Cookies(attributes) {
      var key, value;
      if (attributes == null) attributes = {};
      for (key in attributes) {
        value = attributes[key];
        this[key] = value;
      }
    }

    return Cookies;

  })();

  Tower.HTTP.Param = (function() {

    Param.perPage = 20;

    Param.sortDirection = "ASC";

    Param.sortKey = "sort";

    Param.limitKey = "limit";

    Param.pageKey = "page";

    Param.separator = "_";

    Param.create = function(key, options) {
      options.type || (options.type = "String");
      return new Tower.HTTP.Param[options.type](key, options);
    };

    function Param(key, options) {
      if (options == null) options = {};
      this.controller = options.controller;
      this.key = key;
      this.attribute = options.as || this.key;
      this.modelName = options.modelName;
      if (typeof modelName !== "undefined" && modelName !== null) {
        this.namespace = Tower.Support.String.pluralize(this.modelName);
      }
      this.exact = options.exact || false;
      this["default"] = options["default"];
    }

    Param.prototype.parse = function(value) {
      return value;
    };

    Param.prototype.render = function(value) {
      return value;
    };

    Param.prototype.toCriteria = function(value) {
      var attribute, conditions, criteria, node, nodes, operator, set, _len5, _len6, _m, _n;
      nodes = this.parse(value);
      criteria = new Tower.Model.Criteria;
      for (_m = 0, _len5 = nodes.length; _m < _len5; _m++) {
        set = nodes[_m];
        for (_n = 0, _len6 = set.length; _n < _len6; _n++) {
          node = set[_n];
          attribute = node.attribute;
          operator = node.operators[0];
          conditions = {};
          if (operator === "$eq") {
            conditions[attribute] = node.value;
          } else {
            conditions[attribute] = {};
            conditions[attribute][operator] = node.value;
          }
          criteria.where(conditions);
        }
      }
      return criteria;
    };

    Param.prototype.parseValue = function(value, operators) {
      return {
        namespace: this.namespace,
        key: this.key,
        operators: operators,
        value: value,
        attribute: this.attribute
      };
    };

    Param.prototype._clean = function(string) {
      return string.replace(/^-/, "").replace(/^\+-/, "").replace(/^'|'$/, "").replace("+", " ").replace(/^\^/, "").replace(/\$$/, "").replace(/^\s+|\s+$/, "");
    };

    return Param;

  })();

  Tower.HTTP.Param.Array = (function(_super) {

    __extends(Array, _super);

    function Array() {
      Array.__super__.constructor.apply(this, arguments);
    }

    Array.prototype.parse = function(value) {
      var array, isRange, negation, string, values, _len5, _m,
        _this = this;
      values = [];
      array = value.toString().split(/[,\|]/);
      for (_m = 0, _len5 = array.length; _m < _len5; _m++) {
        string = array[_m];
        isRange = false;
        negation = !!string.match(/^\^/);
        string = string.replace(/^\^/, "");
        string.replace(/([^\.]+)?(\.{2})([^\.]+)?/, function(_, startsOn, operator, endsOn) {
          var range;
          isRange = true;
          range = [];
          if (!!(startsOn && startsOn.match(/^\d/))) {
            range.push(_this.parseValue(startsOn, ["$gte"]));
          }
          if (!!(endsOn && endsOn.match(/^\d/))) {
            range.push(_this.parseValue(endsOn, ["$lte"]));
          }
          return values.push(range);
        });
        if (!isRange) values.push([this.parseValue(string, ["$eq"])]);
      }
      return values;
    };

    return Array;

  })(Tower.HTTP.Param);

  Tower.HTTP.Param.Date = (function(_super) {

    __extends(Date, _super);

    function Date() {
      Date.__super__.constructor.apply(this, arguments);
    }

    Date.prototype.parse = function(value) {
      var array, isRange, string, values, _len5, _m,
        _this = this;
      values = [];
      array = value.toString().split(/[\s,\+]/);
      for (_m = 0, _len5 = array.length; _m < _len5; _m++) {
        string = array[_m];
        isRange = false;
        string.replace(/([^\.]+)?(\.\.)([^\.]+)?/, function(_, startsOn, operator, endsOn) {
          var range;
          isRange = true;
          range = [];
          if (!!(startsOn && startsOn.match(/^\d/))) {
            range.push(_this.parseValue(startsOn, ["$gte"]));
          }
          if (!!(endsOn && endsOn.match(/^\d/))) {
            range.push(_this.parseValue(endsOn, ["$lte"]));
          }
          return values.push(range);
        });
        if (!isRange) values.push([this.parseValue(string, ["$eq"])]);
      }
      return values;
    };

    Date.prototype.parseValue = function(value, operators) {
      return Date.__super__.parseValue.call(this, Tower.date(value), operators);
    };

    return Date;

  })(Tower.HTTP.Param);

  Tower.HTTP.Param.Number = (function(_super) {

    __extends(Number, _super);

    function Number() {
      Number.__super__.constructor.apply(this, arguments);
    }

    Number.prototype.parse = function(value) {
      var array, isRange, negation, string, values, _len5, _m,
        _this = this;
      values = [];
      array = value.toString().split(/[,\|]/);
      for (_m = 0, _len5 = array.length; _m < _len5; _m++) {
        string = array[_m];
        isRange = false;
        negation = !!string.match(/^\^/);
        string = string.replace(/^\^/, "");
        string.replace(/([^\.]+)?(\.{2})([^\.]+)?/, function(_, startsOn, operator, endsOn) {
          var range;
          isRange = true;
          range = [];
          if (!!(startsOn && startsOn.match(/^\d/))) {
            range.push(_this.parseValue(startsOn, ["$gte"]));
          }
          if (!!(endsOn && endsOn.match(/^\d/))) {
            range.push(_this.parseValue(endsOn, ["$lte"]));
          }
          return values.push(range);
        });
        if (!isRange) values.push([this.parseValue(string, ["$eq"])]);
      }
      return values;
    };

    Number.prototype.parseValue = function(value, operators) {
      return Number.__super__.parseValue.call(this, parseFloat(value), operators);
    };

    return Number;

  })(Tower.HTTP.Param);

  Tower.HTTP.Param.String = (function(_super) {

    __extends(String, _super);

    function String() {
      String.__super__.constructor.apply(this, arguments);
    }

    String.prototype.parse = function(value) {
      var arrays, i, node, values, _len5,
        _this = this;
      arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/g);
      for (i = 0, _len5 = arrays.length; i < _len5; i++) {
        node = arrays[i];
        values = [];
        node.replace(/([\+\-\^]?[\w@_\s\d\.\$]+|-?\'[\w@-_\s\d\+\.\$]+\')/g, function(_, token) {
          var exact, negation, operators;
          negation = false;
          exact = false;
          token = token.replace(/^(\+?-+)/, function(_, $1) {
            negation = $1 && $1.length > 0;
            return "";
          });
          token = token.replace(/^\'(.+)\'$/, function(_, $1) {
            exact = $1 && $1.length > 0;
            return $1;
          });
          if (negation) {
            operators = [exact ? "$neq" : "$notMatch"];
          } else {
            operators = [exact ? "$eq" : "$match"];
          }
          if (!!token.match(/^\+?\-?\^/)) operators.push("^");
          if (!!token.match(/\$$/)) operators.push("$");
          values.push(_this.parseValue(_this._clean(token), operators));
          return _;
        });
        arrays[i] = values;
      }
      return arrays;
    };

    return String;

  })(Tower.HTTP.Param);

  Tower.HTTP.Route = (function(_super) {

    __extends(Route, _super);

    Route.store = function() {
      return this._store || (this._store = []);
    };

    Route.create = function(route) {
      return this.store().push(route);
    };

    Route.all = function() {
      return this.store();
    };

    Route.clear = function() {
      return this._store = [];
    };

    Route.draw = function(callback) {
      return callback.apply(new Tower.HTTP.Route.DSL(this));
    };

    Route.findController = function(request, response, callback) {
      var controller, route, routes, _len5, _m;
      routes = Tower.Route.all();
      for (_m = 0, _len5 = routes.length; _m < _len5; _m++) {
        route = routes[_m];
        controller = route.toController(request);
        if (controller) break;
      }
      if (controller) {
        controller.call(request, response, function() {
          return callback(controller);
        });
      } else {
        callback(null);
      }
      return controller;
    };

    Route.prototype.toController = function(request) {
      var capture, controller, i, keys, match, method, params, _len5, _name;
      match = this.match(request);
      if (!match) return null;
      method = request.method.toLowerCase();
      keys = this.keys;
      params = Tower.Support.Object.extend({}, this.defaults, request.query || {}, request.body || {});
      match = match.slice(1);
      for (i = 0, _len5 = match.length; i < _len5; i++) {
        capture = match[i];
        params[_name = keys[i].name] || (params[_name] = capture ? decodeURIComponent(capture) : null);
      }
      controller = this.controller;
      if (controller) params.action = controller.action;
      request.params = params;
      if (controller) {
        controller = new (Tower.constant(Tower.namespaced(this.controller.className)));
      }
      return controller;
    };

    function Route(options) {
      options || (options = options);
      this.path = options.path;
      this.name = options.name;
      this.method = (options.method || "GET").toUpperCase();
      this.ip = options.ip;
      this.defaults = options.defaults || {};
      this.constraints = options.constraints;
      this.options = options;
      this.controller = options.controller;
      this.keys = [];
      this.pattern = this.extractPattern(this.path);
      this.id = this.path;
      if (this.controller) {
        this.id += this.controller.name + this.controller.action;
      }
    }

    Route.prototype.match = function(requestOrPath) {
      var match, path;
      if (typeof requestOrPath === "string") {
        return this.pattern.exec(requestOrPath);
      }
      path = requestOrPath.location.path;
      if (requestOrPath.method.toUpperCase() !== this.method) return null;
      match = this.pattern.exec(path);
      if (!match) return null;
      if (!this.matchConstraints(requestOrPath)) return null;
      return match;
    };

    Route.prototype.matchConstraints = function(request) {
      var constraints, key, value;
      constraints = this.constraints;
      switch (typeof constraints) {
        case "object":
          for (key in constraints) {
            value = constraints[key];
            switch (typeof value) {
              case "string":
              case "number":
                if (request[key] !== value) return false;
                break;
              case "function":
              case "object":
                if (!request.location[key].match(value)) return false;
            }
          }
          break;
        case "function":
          return constraints.call(request, request);
        default:
          return false;
      }
      return true;
    };

    Route.prototype.urlFor = function(options) {
      var key, result, value;
      if (options == null) options = {};
      result = this.path;
      for (key in options) {
        value = options[key];
        result = result.replace(new RegExp(":" + key + "\\??", "g"), value);
      }
      result = result.replace(new RegExp("\\.?:\\w+\\??", "g"), "");
      return result;
    };

    Route.prototype.extractPattern = function(path, caseSensitive, strict) {
      var self;
      if (path instanceof RegExp) return path;
      self = this;
      if (path === "/") return new RegExp('^' + path + '$');
      path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, function(_, open, slash, format, symbol, key, close, optional) {
        var result, splat;
        optional = (!!optional) || (open + close === "()");
        splat = symbol === "*";
        self.keys.push({
          name: key,
          optional: !!optional,
          splat: splat
        });
        slash || (slash = "");
        result = "";
        if (!optional || !splat) result += slash;
        result += "(?:";
        if (format != null) {
          result += splat ? "\\.([^.]+?)" : "\\.([^/.]+?)";
        } else {
          result += splat ? "/?(.+)" : "([^/\\.]+)";
        }
        result += ")";
        if (optional) result += "?";
        return result;
      });
      return new RegExp('^' + path + '$', !!caseSensitive ? '' : 'i');
    };

    return Route;

  })(Tower.Class);

  Tower.Route = Tower.HTTP.Route;

  Tower.HTTP.Route.DSL = (function() {

    function DSL() {
      this._scope = {};
    }

    DSL.prototype.match = function() {
      this.scope || (this.scope = {});
      return Tower.HTTP.Route.create(new Tower.HTTP.Route(this._extractOptions.apply(this, arguments)));
    };

    DSL.prototype.get = function() {
      return this.matchMethod("get", Tower.Support.Array.args(arguments));
    };

    DSL.prototype.post = function() {
      return this.matchMethod("post", Tower.Support.Array.args(arguments));
    };

    DSL.prototype.put = function() {
      return this.matchMethod("put", Tower.Support.Array.args(arguments));
    };

    DSL.prototype["delete"] = function() {
      return this.matchMethod("delete", Tower.Support.Array.args(arguments));
    };

    DSL.prototype.matchMethod = function(method, args) {
      var name, options, path;
      if (typeof args[args.length - 1] === "object") {
        options = args.pop();
      } else {
        options = {};
      }
      name = args.shift();
      options.method = method;
      options.action = name;
      options.name = name;
      if (this._scope.name) {
        options.name = this._scope.name + Tower.Support.String.camelize(options.name);
      }
      path = "/" + name;
      if (this._scope.path) path = this._scope.path + path;
      this.match(path, options);
      return this;
    };

    DSL.prototype.scope = function(options, block) {
      var originalScope;
      if (options == null) options = {};
      originalScope = this._scope || (this._scope = {});
      this._scope = Tower.Support.Object.extend({}, originalScope, options);
      block.call(this);
      this._scope = originalScope;
      return this;
    };

    DSL.prototype.controller = function(controller, options, block) {
      options.controller = controller;
      return this.scope(options, block);
    };

    DSL.prototype.namespace = function(path, options, block) {
      if (typeof options === 'function') {
        block = options;
        options = {};
      } else {
        options = {};
      }
      options = Tower.Support.Object.extend({
        name: path,
        path: path,
        as: path,
        module: path,
        shallowPath: path,
        shallowPrefix: path
      }, options);
      if (options.name && this._scope.name) {
        options.name = this._scope.name + Tower.Support.String.camelize(options.name);
      }
      return this.scope(options, block);
    };

    DSL.prototype.constraints = function(options, block) {
      return this.scope({
        constraints: options
      }, block);
    };

    DSL.prototype.defaults = function(options, block) {
      return this.scope({
        defaults: options
      }, block);
    };

    DSL.prototype.resource = function(name, options) {
      if (options == null) options = {};
      options.controller = name;
      this.match("" + name + "/new", Tower.Support.Object.extend({
        action: "new"
      }, options));
      this.match("" + name, Tower.Support.Object.extend({
        action: "create",
        method: "POST"
      }, options));
      this.match("" + name + "/", Tower.Support.Object.extend({
        action: "show"
      }, options));
      this.match("" + name + "/edit", Tower.Support.Object.extend({
        action: "edit"
      }, options));
      this.match("" + name, Tower.Support.Object.extend({
        action: "update",
        method: "PUT"
      }, options));
      return this.match("" + name, Tower.Support.Object.extend({
        action: "destroy",
        method: "DELETE"
      }, options));
    };

    DSL.prototype.resources = function(name, options, callback) {
      var many, one, path;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else {
        options = {};
      }
      options.controller || (options.controller = name);
      path = "/" + name;
      if (this._scope.path) path = this._scope.path + path;
      if (this._scope.name) {
        many = this._scope.name + Tower.Support.String.camelize(name);
      } else {
        many = name;
      }
      one = Tower.Support.String.singularize(many);
      this.match("" + path, Tower.Support.Object.extend({
        name: "" + many,
        action: "index"
      }, options));
      this.match("" + path + "/new", Tower.Support.Object.extend({
        name: "new" + (Tower.Support.String.camelize(one)),
        action: "new"
      }, options));
      this.match("" + path, Tower.Support.Object.extend({
        action: "create",
        method: "POST"
      }, options));
      this.match("" + path + "/:id", Tower.Support.Object.extend({
        name: "" + one,
        action: "show"
      }, options));
      this.match("" + path + "/:id/edit", Tower.Support.Object.extend({
        name: "edit" + (Tower.Support.String.camelize(one)),
        action: "edit"
      }, options));
      this.match("" + path + "/:id", Tower.Support.Object.extend({
        action: "update",
        method: "PUT"
      }, options));
      this.match("" + path + "/:id", Tower.Support.Object.extend({
        action: "destroy",
        method: "DELETE"
      }, options));
      if (callback) {
        this.scope(Tower.Support.Object.extend({
          path: "" + path + "/:" + (Tower.Support.String.singularize(name)) + "Id",
          name: one
        }, options), callback);
      }
      return this;
    };

    DSL.prototype.collection = function() {};

    DSL.prototype.member = function() {};

    DSL.prototype.root = function(options) {
      return this.match('/', Tower.Support.Object.extend({
        as: "root"
      }, options));
    };

    DSL.prototype._extractOptions = function() {
      var anchor, args, constraints, controller, defaults, format, method, name, options, path;
      args = Tower.Support.Array.args(arguments);
      path = "/" + args.shift().replace(/^\/|\/$/, "");
      if (typeof args[args.length - 1] === "object") {
        options = args.pop();
      } else {
        options = {};
      }
      if (args.length > 0) options.to || (options.to = args.shift());
      options.path = path;
      format = this._extractFormat(options);
      options.path = this._extractPath(options);
      method = this._extractRequestMethod(options);
      constraints = this._extractConstraints(options);
      defaults = this._extractDefaults(options);
      controller = this._extractController(options);
      anchor = this._extractAnchor(options);
      name = this._extractName(options);
      options = Tower.Support.Object.extend(options, {
        method: method,
        constraints: constraints,
        defaults: defaults,
        name: name,
        format: format,
        controller: controller,
        anchor: anchor,
        ip: options.ip
      });
      return options;
    };

    DSL.prototype._extractFormat = function(options) {};

    DSL.prototype._extractName = function(options) {
      return options.as || options.name;
    };

    DSL.prototype._extractConstraints = function(options) {
      return Tower.Support.Object.extend(this._scope.constraints || {}, options.constraints || {});
    };

    DSL.prototype._extractDefaults = function(options) {
      return options.defaults || {};
    };

    DSL.prototype._extractPath = function(options) {
      return "" + options.path + ".:format?";
    };

    DSL.prototype._extractRequestMethod = function(options) {
      return (options.method || options.via || "GET").toUpperCase();
    };

    DSL.prototype._extractAnchor = function(options) {
      return options.anchor;
    };

    DSL.prototype._extractController = function(options) {
      var action, controller, to;
      if (options == null) options = {};
      to = options.to;
      if (to) {
        to = to.split('#');
        if (to.length === 1) {
          action = to[0];
        } else {
          controller = to[0];
          action = to[1];
        }
      }
      controller || (controller = options.controller || this._scope.controller);
      action || (action = options.action);
      if (!controller) {
        throw new Error("No controller was specified for the route " + options.path);
      }
      controller = controller.toLowerCase().replace(/(?:[cC]ontroller)?$/, "Controller");
      return {
        name: controller,
        action: action,
        className: Tower.Support.String.camelize("" + controller)
      };
    };

    return DSL;

  })();

  Tower.HTTP.Route.Urls = {
    ClassMethods: {
      urlFor: function(options) {
        var action, anchor, controller, host, port;
        switch (typeof options) {
          case "string":
            return options;
          default:
            return controller = options.controller, action = options.action, host = options.host, port = options.port, anchor = options.anchor, options;
        }
      }
    }
  };

  Tower.HTTP.Route.PolymorphicUrls = {
    ClassMethods: {
      polymorphicUrl: function() {}
    }
  };

  Tower.HTTP.Route.include(Tower.HTTP.Route.Urls);

  Tower.HTTP.Route.include(Tower.HTTP.Route.PolymorphicUrls);

  Tower.HTTP.Request = (function() {

    function Request(data) {
      if (data == null) data = {};
      this.url = data.url;
      this.location = data.location;
      this.pathname = this.location.path;
      this.query = this.location.query;
      this.title = data.title;
      this.title || (this.title = typeof document !== "undefined" && document !== null ? document.title : void 0);
      this.body = data.body || {};
      this.headers = data.headers || {};
      this.method = data.method || "GET";
    }

    return Request;

  })();

  Tower.HTTP.Response = (function() {

    function Response(data) {
      if (data == null) data = {};
      this.url = data.url;
      this.location = data.location;
      this.pathname = this.location.path;
      this.query = this.location.query;
      this.title = data.title;
      this.title || (this.title = typeof document !== "undefined" && document !== null ? document.title : void 0);
      this.body = data.body || {};
      this.headers = data.headers || {};
      this.headerSent = false;
      this.statusCode = 200;
      this.body = "";
    }

    Response.prototype.writeHead = function(statusCode, headers) {
      this.statusCode = statusCode;
      return this.headers = headers;
    };

    Response.prototype.setHeader = function(key, value) {
      if (this.headerSent) throw new Error("Headers already sent");
      return this.headers[key] = value;
    };

    Response.prototype.write = function(body) {
      if (body == null) body = '';
      return this.body += body;
    };

    Response.prototype.end = function(body) {
      if (body == null) body = '';
      this.body += body;
      this.sent = true;
      return this.headerSent = true;
    };

    Response.prototype.redirect = function(path, options) {
      if (options == null) options = {};
      if (global.History) return global.History.push(options, null, path);
    };

    return Response;

  })();

  Tower.HTTP.Url = (function() {

    Url.key = ["source", "protocol", "host", "userInfo", "user", "password", "hostname", "port", "relative", "path", "directory", "file", "query", "fragment"];

    Url.aliases = {
      anchor: "fragment"
    };

    Url.parser = {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    };

    Url.querystringParser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    Url.fragmentParser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    Url.typeParser = /(youtube|vimeo|eventbrite)/;

    Url.prototype.parse = function(string) {
      var attributes, domains, fragment, i, key, params, parsed, value;
      key = this.constructor.key;
      string = decodeURI(string);
      parsed = this.constructor.parser[(this.strictMode || false ? "strict" : "loose")].exec(string);
      attributes = {};
      this.params = params = {};
      this.fragment = fragment = {
        params: {}
      };
      i = 14;
      while (i--) {
        attributes[key[i]] = parsed[i] || "";
      }
      attributes["query"].replace(this.constructor.querystringParser, function($0, $1, $2) {
        if ($1) return params[$1] = $2;
      });
      attributes["fragment"].replace(this.constructor.fragmentParser, function($0, $1, $2) {
        if ($1) return fragment.params[$1] = $2;
      });
      this.segments = attributes.path.replace(/^\/+|\/+$/g, "").split("/");
      fragment.segments = attributes.fragment.replace(/^\/+|\/+$/g, "").split("/");
      for (key in attributes) {
        value = attributes[key];
        this[key] || (this[key] = value);
      }
      this.root = (attributes.host ? attributes.protocol + "://" + attributes.hostname + (attributes.port ? ":" + attributes.port : "") : "");
      domains = this.hostname.split(".");
      this.domain = domains.slice(domains.length - 1 - this.depth, (domains.length - 1) + 1 || 9e9).join(".");
      this.subdomains = domains.slice(0, (domains.length - 2 - this.depth) + 1 || 9e9);
      this.subdomain = this.subdomains.join(".");
      if (this.port != null) return this.port = parseInt(this.port);
    };

    function Url(url, depth, strictMode) {
      if (depth == null) depth = 1;
      this.strictMode = strictMode || false;
      this.depth = depth || 1;
      if (typeof window !== "undefined" && window !== null) {
        this.url = url || (url = window.location.toString());
      }
      this.parse(url);
    }

    return Url;

  })();

  Tower.Middleware = {};

  Tower.Middleware.Agent = function(request, response, next) {
    var agent, attributes;
    agent = require('useragent').parse(request.headers['user-agent']);
    attributes = Tower.Support.Object.extend(require('useragent').is(request.headers['user-agent']), {
      family: agent.family,
      major: agent.major,
      minor: agent.minor,
      patch: agent.patch,
      version: agent.toVersion(),
      os: agent.os,
      name: agent.toAgent(),
      mac: !!agent.os.match(/mac/i),
      windows: !!agent.os.match(/win/i),
      linux: !!agent.os.match(/linux/i)
    });
    request.agent = new Tower.HTTP.Agent(attributes);
    if (next) return next();
  };

  Tower.Middleware.Cookies = function(request, response, next) {
    return request._cookies || (request._cookies = Tower.HTTP.Cookies.parse());
  };

  Tower.Middleware.Location = function(request, response, next) {
    var url;
    if (!request.location) {
      if (request.url.match(/^http/)) {
        url = request.url;
      } else {
        url = "http://" + request.headers.host + request.url;
      }
      request.location = new Tower.HTTP.Url(url);
    }
    return next();
  };

  Tower.Middleware.Router = function(request, response, callback) {
    Tower.Middleware.Router.find(request, response, function(controller) {
      if (controller) {
        if (response.statusCode !== 302) {
          response.controller = controller;
          response.writeHead(controller.status, controller.headers);
          response.write(controller.body);
          response.end();
        }
        return controller.clear();
      } else {
        return Tower.Middleware.Router.error(request, response);
      }
    });
    return response;
  };

  Tower.Support.Object.extend(Tower.Middleware.Router, {
    find: function(request, response, callback) {
      this.processHost(request, response);
      this.processAgent(request, response);
      return Tower.HTTP.Route.findController(request, response, callback);
    },
    processHost: function(request, response) {
      return request.location || (request.location = new Tower.HTTP.Url(request.url));
    },
    processAgent: function(request, response) {
      if (request.headers) {
        return request.userAgent || (request.userAgent = request.headers["user-agent"]);
      }
    },
    error: function(request, response) {
      if (response) {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        return response.end("No path matches " + request.url);
      }
    }
  });

}).call(this);
