/*!
 * Tower.js v0.4.0-9
 * http://towerjs.org/
 *
 * Copyright 2012, Lance Pollard
 * MIT License.
 * http://towerjs.org/license
 *
 * Date: Mon, 07 May 2012 21:40:47 GMT
 */
(function() {
  var Tower, action, coffeescriptMixin, key, method, module, nativeIndexOf, phase, specialProperties, towerMixin, _fn, _fn1, _fn2, _fn3, _fn4, _fn5, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice,
    __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
    __defineStaticProperty = function(clazz, key, value) {
  if(typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
    __hasProp = {}.hasOwnProperty,
    __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend(child);
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
},
    _this = this;

  window.global || (window.global = window);

  module = global.module || {};

  global.Tower = Tower = {};

  Tower.version = "0.4.0-9";

  Tower.logger = console;

  _.mixin(_.string.exports());

  Tower.modules = {
    validator: global,
    accounting: global.accounting,
    moment: global.moment,
    geo: global.geolib,
    inflector: global.inflector,
    async: global.async
  };

  Tower.Support = {};

  nativeIndexOf = Array.prototype.indexOf;

  Tower.Support.Array = {
    toStringIndexOf: function(array, item, isSorted) {
      var i, l;
      if (array == null) {
        return -1;
      }
      i = 0;
      l = array.length;
      while (i < l) {
        if (i in array && array[i] && item && array[i].toString() === item.toString()) {
          return i;
        }
        i++;
      }
      return -1;
    },
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
      if (index == null) {
        index = 0;
      }
      if (withCallback == null) {
        withCallback = false;
      }
      if (withOptions == null) {
        withOptions = false;
      }
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
          aValue = a.get(attribute);
          bValue = b.get(attribute);
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
        if (!(sorting instanceof Array)) {
          sorting = [sorting, "asc"];
        }
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

  Tower.Support.Number = {
    isInt: function(n) {
      return n === +n && n === (n | 0);
    },
    isFloat: function(n) {
      return n === +n && n !== (n | 0);
    },
    randomSortOrder: function() {
      return Math.round(Math.random()) - 0.5;
    },
    randomIntBetween: function(min, max) {
      return min + Math.floor(Math.random() * ((max - min) + 1));
    }
  };

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
      if (Object.defineProperty) {
        return Object.defineProperty(object, key, options);
      }
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
    copy: function(object) {
      if (_.isArray(object)) {
        return object.concat();
      } else if (_.isHash(object)) {
        return _.extend({}, object);
      } else {
        return Object.create(object);
      }
    },
    copyArray: function(object) {
      if (object) {
        return object.concat();
      } else {
        return [];
      }
    },
    copyObject: function(object) {
      if (object) {
        return _.clone(object);
      } else {
        return {};
      }
    },
    isA: function(object, isa) {},
    isHash: function(object) {
      return object && object.constructor === Object;
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
    },
    getNestedAttribute: function(object, key) {
      var part, parts, _i, _len;
      parts = key.split('.');
      if (parts.length === 1) {
        return Ember.get(object, key);
      }
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        part = parts[_i];
        object = Ember.get(object, part);
        if (!object) {
          break;
        }
      }
      return object;
    }
  };

  Tower.Support.RegExp = {
    regexpEscape: function(string) {
      return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    regexpUnion: function() {}
  };

  Tower.Support.String = {
    camelize_rx: /(?:^|_|\-)(.)/g,
    capitalize_rx: /(^|\s)([a-z])/g,
    underscore_rx1: /([A-Z]+)([A-Z][a-z])/g,
    underscore_rx2: /([a-z\d])([A-Z])/g,
    constantize: function(string, scope) {
      if (scope == null) {
        scope = global;
      }
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
      var _ref;
      return (_ref = Tower.modules.inflector).singularize.apply(_ref, arguments);
    },
    pluralize: function(count, string) {
      if (string) {
        if (count === 1) {
          return string;
        }
      } else {
        string = count;
      }
      return Tower.modules.inflector.pluralize(string);
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
        if (!string) {
          string = stringOrObject['other'];
        }
      } else {
        string = stringOrObject;
      }
      for (key in keys) {
        value = keys[key];
        string = string.replace(new RegExp("%\\{" + key + "\\}", "g"), value);
      }
      return string;
    },
    grep: function(object, regex, iterator, context) {
      var found;
      regex = _.isRegExp(regex) ? regex : RegExp(String(regex).replace(/([{.(|}:)$+?=^*!\/[\]\\])/g, "\\$1"));
      found = _.select(object, function(s) {
        return regex.test(s);
      }, context);
      if (iterator) {
        return _.map(found, iterator, context);
      }
      return found;
    },
    parameterize: function(string) {
      return Tower.Support.String.underscore(string).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, '');
    }
  };

  _.mixin(Tower.Support.Array);

  _.mixin(Tower.Support.Number);

  _.mixin(Tower.Support.Object);

  _.mixin(Tower.Support.RegExp);

  _.mixin(Tower.Support.String);

  try {
    _.string.isBlank = Tower.Support.Object;
  } catch (_error) {}

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
        args = _.args(arguments);
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
        args = _.args(arguments, 1);
        if (typeof args[args.length - 1] !== "object") {
          method = args.pop();
        }
        if (typeof args[args.length - 1] === "object") {
          options = args.pop();
        }
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
        if (options == null) {
          options = {};
        }
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
        if (complete) {
          return complete.call(this);
        }
      }
    },
    _callback: function() {
      return Tower.callbackChain.apply(Tower, arguments);
    }
  };

  Tower.Support.Callbacks.Chain = (function() {

    function Chain(options) {
      var key, value;
      if (options == null) {
        options = {};
      }
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.before || (this.before = []);
      this.after || (this.after = []);
    }

    __defineProperty(Chain,  "clone", function() {
      return new Tower.Support.Callbacks.Chain({
        before: this.before.concat(),
        after: this.after.concat()
      });
    });

    __defineProperty(Chain,  "run", function(binding, options, block, complete) {
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
                  if (complete) {
                    complete.call(binding);
                  }
                  return binding;
                });
              default:
                return block.call(binding, function(error) {
                  if (!error) {
                    return Tower.async(_this.after, runner, function(error) {
                      if (complete) {
                        complete.call(binding);
                      }
                      return binding;
                    });
                  }
                });
            }
          } else {
            return Tower.async(_this.after, runner, function(error) {
              if (complete) {
                complete.call(binding);
              }
              return binding;
            });
          }
        }
      });
    });

    __defineProperty(Chain,  "push", function(phase, method, filters, options) {
      return this[phase].push(new Tower.Support.Callback(method, filters, options));
    });

    return Chain;

  })();

  Tower.Support.Callback = (function() {

    function Callback(method, conditions) {
      if (conditions == null) {
        conditions = {};
      }
      this.method = method;
      this.conditions = conditions;
      if (conditions.hasOwnProperty("only")) {
        conditions.only = _.castArray(conditions.only);
      }
      if (conditions.hasOwnProperty("except")) {
        conditions.except = _.castArray(conditions.except);
      }
    }

    __defineProperty(Callback,  "run", function(binding, options, next) {
      var conditions, method, result;
      conditions = this.conditions;
      if (options && options.hasOwnProperty("name")) {
        if (conditions.hasOwnProperty("only")) {
          if (_.indexOf(conditions.only, options.name) === -1) {
            return next();
          }
        } else if (conditions.hasOwnProperty("except")) {
          if (_.indexOf(conditions.except, options.name) !== -1) {
            return next();
          }
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
    });

    return Callback;

  })();

  _.extend(Tower, {
    nativeExtensions: true,
    env: "development",
    port: 3000,
    client: typeof window !== "undefined",
    isClient: typeof window !== "undefined",
    isServer: typeof window === "undefined",
    root: "/",
    publicPath: "/",
    "case": "camelcase",
    accessors: typeof window === "undefined",
    logger: typeof _console !== 'undefined' ? _console : console,
    structure: "standard",
    config: {},
    namespaces: {},
    metadata: {},
    subscribe: function() {
      var _ref;
      return (_ref = Tower.Application.instance()).subscribe.apply(_ref, arguments);
    },
    cb: function() {},
    toMixin: function() {
      return {
        include: function() {
          return Tower.include.apply(Tower, [this].concat(__slice.call(arguments)));
        },
        className: function() {
          return _.functionName(this);
        }
      };
    },
    include: function(self, object) {
      var ClassMethods, InstanceMethods, included;
      included = object.included;
      ClassMethods = object.ClassMethods;
      InstanceMethods = object.InstanceMethods;
      delete object.included;
      delete object.ClassMethods;
      delete object.InstanceMethods;
      if (ClassMethods) {
        self.reopenClass(ClassMethods);
      }
      if (InstanceMethods) {
        self.include(InstanceMethods);
      }
      self.reopen(object);
      object.InstanceMethods = InstanceMethods;
      object.ClassMethods = ClassMethods;
      if (included) {
        included.apply(self);
      }
      return object;
    },
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
      string = _.args(arguments).join("_");
      switch (Tower["case"]) {
        case "snakecase":
          return Tower.Support.String.underscore(string);
        default:
          return Tower.Support.String.camelcase(string);
      }
    },
    namespace: function() {
      return Tower.Application.instance().constructor.className();
    },
    module: function(namespace) {
      var node, part, parts, _i, _len;
      node = Tower.namespaces[namespace];
      if (node) {
        return node;
      }
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
      var index, item, _i, _len, _results;
      if (array.forEach) {
        return array.forEach(iterator);
      } else {
        _results = [];
        for (index = _i = 0, _len = array.length; _i < _len; index = ++_i) {
          item = array[index];
          _results.push(iterator(item, index, array));
        }
        return _results;
      }
    },
    series: function(array, iterator, callback) {
      var completed, iterate;
      if (callback == null) {
        callback = function() {};
      }
      if (!array.length) {
        return callback();
      }
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
      if (callback == null) {
        callback = function() {};
      }
      if (!array.length) {
        return callback();
      }
      completed = 0;
      iterate = function() {};
      return Tower.each(array, function(x) {
        return iterator(x, function(error) {
          if (error) {
            callback(error);
            return callback = function() {};
          } else {
            completed += 1;
            if (completed === array.length) {
              return callback();
            }
          }
        });
      });
    },
    callbackChain: function() {
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

  if (typeof Ember !== 'undefined') {
    coffeescriptMixin = {
      __extend: function(child) {
        var object;
        object = Ember.Object.extend.apply(this);
        object.__name__ = child.name;
        if (this.extended) {
          this.extended.call(object);
        }
        return object;
      },
      __defineStaticProperty: function(key, value) {
        var object;
        object = {};
        object[key] = value;
        this[key] = value;
        return this.reopenClass(object);
      },
      __defineProperty: function(key, value) {
        var object;
        object = {};
        object[key] = value;
        return this.reopen(object);
      }
    };
    Ember.Object.reopenClass(coffeescriptMixin);
    Ember.Namespace.reopenClass(coffeescriptMixin);
    Ember.Application.reopenClass(coffeescriptMixin);
    Ember.ArrayProxy.reopenClass(coffeescriptMixin);
    Ember.State.reopenClass(coffeescriptMixin);
    Ember.StateManager.reopenClass(coffeescriptMixin);
    Tower.Class = Ember.Object.extend({
      className: function() {
        return this.constructor.className();
      }
    });
    Tower.Namespace = Ember.Namespace.extend();
    Tower.Collection = Ember.ArrayProxy.extend();
    Tower.State = Ember.State.extend();
    Tower.StateMachine = Ember.StateManager.extend();
    towerMixin = Tower.toMixin();
    Tower.Class.reopenClass(towerMixin);
    Tower.Namespace.reopenClass(towerMixin);
    Ember.Application.reopenClass(towerMixin);
    Tower.Collection.reopenClass(towerMixin);
    Tower.State.reopenClass(towerMixin);
    Tower.StateMachine.reopenClass(towerMixin);
    if (Ember.View) {
      Ember.View.reopenClass(coffeescriptMixin);
      Ember.View.reopenClass(towerMixin);
      Ember.CollectionView.reopenClass(coffeescriptMixin);
      Ember.CollectionView.reopenClass(towerMixin);
    }
    Ember.NATIVE_EXTENSIONS = Tower.nativeExtensions;
  } else {
    throw new Error("Must include Ember.js");
  }

  Tower.Support.EventEmitter = {
    isEventEmitter: true,
    events: function() {
      return this._events || (this._events = {});
    },
    hasEventListener: function(key) {
      return _.isPresent(this.events(), key);
    },
    event: function(key) {
      var _base;
      return (_base = this.events())[key] || (_base[key] = new Tower.Event(this, key));
    },
    on: function() {
      var args, eventMap, eventType, handler, options, _results;
      args = _.args(arguments);
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
      return event.fire.call(event, _.args(arguments, 1));
    },
    allowAndFire: function(key) {
      return this.event(key).allowAndFire(_.args(arguments, 1));
    }
  };

  Tower.Support.I18n = {
    PATTERN: /(?:%%|%\{(\w+)\}|%<(\w+)>(.*?\d*\.?\d*[bBdiouxXeEfgGcps]))/g,
    defaultLanguage: "en",
    load: function(pathOrObject, language) {
      var store;
      if (language == null) {
        language = this.defaultLanguage;
      }
      store = this.store();
      language = store[language] || (store[language] = {});
      _.deepMerge(language, typeof pathOrObject === "string" ? require(pathOrObject) : pathOrObject);
      return this;
    },
    translate: function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.hasOwnProperty("tense")) {
        key += "." + options.tense;
      }
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
      if (language == null) {
        language = this.defaultLanguage;
      }
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
      if (locals == null) {
        locals = {};
      }
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
          if (typeof value === 'function') {
            value = value.call(locals);
          }
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

  Tower.Support.Url = {
    toQueryValue: function(value, type, negate) {
      var item, items, result, _i, _len;
      if (negate == null) {
        negate = "";
      }
      if (_.isArray(value)) {
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
        if (type === 'date') {
          result += _(value).strftime('YYYY-MM-DD');
        } else {
          result += value.toString();
        }
      }
      result = result.replace(" ", "+").replace(/[#%\"\|<>]/g, function(_) {
        return encodeURIComponent(_);
      });
      return result;
    },
    toQuery: function(object, schema) {
      var data, key, negate, param, range, rangeIdentifier, result, set, type, value;
      if (schema == null) {
        schema = {};
      }
      result = [];
      for (key in object) {
        value = object[key];
        param = "" + key + "=";
        type = schema[key] ? schema[key].type.toLowerCase() : 'string';
        negate = type === "string" ? "-" : "^";
        if (_.isHash(value)) {
          data = {};
          if (value.hasOwnProperty(">=")) {
            data.min = value[">="];
          }
          if (value.hasOwnProperty(">")) {
            data.min = value[">"];
          }
          if (value.hasOwnProperty("<=")) {
            data.max = value["<="];
          }
          if (value.hasOwnProperty("<")) {
            data.max = value["<"];
          }
          if (value.hasOwnProperty("=~")) {
            data.match = value["=~"];
          }
          if (value.hasOwnProperty("!~")) {
            data.notMatch = value["!~"];
          }
          if (value.hasOwnProperty("==")) {
            data.eq = value["=="];
          }
          if (value.hasOwnProperty("!=")) {
            data.neq = value["!="];
          }
          data.range = data.hasOwnProperty("min") || data.hasOwnProperty("max");
          set = [];
          if (data.range && !(data.hasOwnProperty("eq") || data.hasOwnProperty("match"))) {
            range = "";
            rangeIdentifier = type === 'date' ? 't' : 'n';
            if (data.hasOwnProperty("min")) {
              range += Tower.Support.Url.toQueryValue(data.min, type);
            } else {
              range += rangeIdentifier;
            }
            range += "..";
            if (data.hasOwnProperty("max")) {
              range += Tower.Support.Url.toQueryValue(data.max, type);
            } else {
              range += rangeIdentifier;
            }
            set.push(range);
          }
          if (data.hasOwnProperty("eq")) {
            set.push(Tower.Support.Url.toQueryValue(data.eq, type));
          }
          if (data.hasOwnProperty("match")) {
            set.push(Tower.Support.Url.toQueryValue(data.match, type));
          }
          if (data.hasOwnProperty("neq")) {
            set.push(Tower.Support.Url.toQueryValue(data.neq, type, negate));
          }
          if (data.hasOwnProperty("notMatch")) {
            set.push(Tower.Support.Url.toQueryValue(data.notMatch, type, negate));
          }
          param += set.join(",");
        } else {
          param += Tower.Support.Url.toQueryValue(value, type);
        }
        result.push(param);
      }
      return result.sort().join("&");
    },
    extractDomain: function(host, tldLength) {
      var parts;
      if (tldLength == null) {
        tldLength = 1;
      }
      if (!this.namedHost(host)) {
        return null;
      }
      parts = host.split('.');
      return parts.slice(0, (parts.length - 1 - 1 + tldLength) + 1 || 9e9).join(".");
    },
    extractSubdomains: function(host, tldLength) {
      var parts;
      if (tldLength == null) {
        tldLength = 1;
      }
      if (!this.namedHost(host)) {
        return [];
      }
      parts = host.split('.');
      return parts.slice(0, (-(tldLength + 2)) + 1 || 9e9);
    },
    extractSubdomain: function(host, tldLength) {
      if (tldLength == null) {
        tldLength = 1;
      }
      return this.extractSubdomains(host, tldLength).join('.');
    },
    namedHost: function(host) {
      return !!!(host === null || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(host));
    },
    rewriteAuthentication: function(options) {
      if (options.user && options.password) {
        return "" + (encodeURI(options.user)) + ":" + (encodeURI(options.password)) + "@";
      } else {
        return "";
      }
    },
    hostOrSubdomainAndDomain: function(options) {
      var host, subdomain, tldLength;
      if (options.subdomain === null && options.domain === null) {
        return options.host;
      }
      tldLength = options.tldLength || 1;
      host = "";
      if (options.subdomain !== false) {
        subdomain = options.subdomain || this.extractSubdomain(options.host, tldLength);
        if (subdomain) {
          host += "" + subdomain + ".";
        }
      }
      host += options.domain || this.extractDomain(options.host, tldLength);
      return host;
    },
    urlForBase: function(options) {
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
        if (!result.match("//")) {
          result += "//";
        }
        result += this.rewriteAuthentication(options);
        result += this.hostOrSubdomainAndDomain(options);
        if (port) {
          result += ":" + port;
        }
      }
      if (options.trailingSlash) {
        result += path.replace(/\/$/, "/");
      } else {
        result += path;
      }
      if (!_.isBlank(params)) {
        result += "?" + (Tower.Support.Url.toQuery(params, schema));
      }
      if (options.anchor) {
        result += "#" + (Tower.Support.Url.toQuery(options.anchor));
      }
      return result;
    },
    urlFor: function() {
      var args, item, last, options, result, route, _i, _len;
      args = _.args(arguments);
      if (!args[0]) {
        return null;
      }
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
      if (options.route) {
        route = Tower.Route.find(options.route);
        if (route) {
          result = route.urlFor();
        }
      } else if (options.controller && options.action) {
        route = Tower.Route.findByControllerOptions({
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
      last = args[args.length - 1];
      if (last && options.params && !options.schema && last instanceof Tower.Model) {
        options.schema = last.constructor.fields();
      }
      if (!options.hasOwnProperty("onlyPath")) {
        options.onlyPath = true;
      }
      options.path = result;
      return this.urlForBase(options);
    }
  };

  Tower.urlFor = function() {
    var _ref;
    return (_ref = Tower.Support.Url).urlFor.apply(_ref, arguments);
  };

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

  (function() {
    var accounting, async, asyncing, cardType, casting, check, format, geo, inflections, inflector, moment, name, phoneFormats, postalCodeFormats, sanitize, sanitizing, validating, validator, _fn, _i, _len, _ref;
    validator = Tower.modules.validator;
    check = validator.check;
    sanitize = validator.sanitize;
    async = Tower.modules.async;
    try {
      validator.Validator.prototype.error = function(msg) {
        this._errors.push(msg);
        return this;
      };
    } catch (error) {
      console.log(error);
    }
    accounting = Tower.modules.accounting;
    moment = Tower.modules.moment;
    geo = Tower.modules.geo;
    inflector = Tower.modules.inflector;
    phoneFormats = {
      us: ["###-###-####", "##########", "###\\.###\\.####", "### ### ####", "\\(###\\) ###-####"],
      brazil: ["## ####-####", "\\(##\\) ####-####", "##########"],
      france: ["## ## ## ## ##"],
      uk: ["#### ### ####"]
    };
    for (name in phoneFormats) {
      format = phoneFormats[name];
      phoneFormats[name] = new RegExp("^" + (format.join('|').replace(/#/g, '\\d')) + "$", "i");
    }
    postalCodeFormats = {
      us: ['#####', '#####-####'],
      pt: ['####', '####-###']
    };
    for (name in postalCodeFormats) {
      format = postalCodeFormats[name];
      postalCodeFormats[name] = new RegExp("^" + (format.join('|').replace(/#/g, '\\d')) + "$", "i");
    }
    casting = {
      xss: function(value) {
        return sanitize(value).xss();
      },
      distance: function() {
        return geo.getDistance.apply(geo, arguments);
      },
      toInt: function(value) {
        return sanitize(value).toInt();
      },
      toBoolean: function(value) {
        return sanitize(value).toBoolean();
      },
      toFixed: function() {
        return accounting.toFixed.apply(accounting, arguments);
      },
      formatCurrency: function() {
        return accounting.formatMoney.apply(accounting, arguments);
      },
      formatNumber: function() {
        return accounting.formatNumber.apply(accounting, arguments);
      },
      unformatCurrency: function() {
        return accounting.unformat.apply(accounting, arguments);
      },
      unformatCreditCard: function(value) {
        return value.toString().replace(/[- ]/g, '');
      },
      strftime: function(time, format) {
        if (time._wrapped) {
          time = time.value();
        }
        return moment(time).format(format);
      },
      now: function() {
        return _(moment()._d);
      },
      endOfDay: function(value) {
        return _(moment(value).eod()._d);
      },
      endOfWeek: function(value) {},
      endOfMonth: function() {},
      endOfQuarter: function() {},
      endOfYear: function() {},
      beginningOfDay: function(value) {
        return _(moment(value).sod()._d);
      },
      beginningOfWeek: function() {},
      beginningOfMonth: function() {},
      beginningOfQuarter: function() {},
      beginningOfYear: function() {},
      midnight: function() {},
      toDate: function(value) {
        return moment(value)._d;
      },
      withDate: function(value) {
        return moment(value);
      },
      days: function(value) {
        return _(value * 24 * 60 * 60 * 1000);
      },
      fromNow: function(value) {
        return _(moment().add('milliseconds', value)._d);
      },
      ago: function(value) {
        return _(moment().subtract('milliseconds', value)._d);
      },
      toHuman: function(value) {
        return moment(value).from();
      },
      humanizeDuration: function(from, as) {
        if (as == null) {
          as = 'days';
        }
        if (from._wrapped) {
          from = from.value();
        }
        return moment.humanizeDuration(from, 'milliseconds');
      },
      toS: function(array) {
        return _.map(array, function(item) {
          return item.toString();
        });
      }
    };
    sanitizing = {
      trim: function(value) {
        return sanitize(value).trim();
      },
      ltrim: function(value, trim) {
        return sanitize(value).ltrim(trim);
      },
      rtrim: function(value, trim) {
        return sanitize(value, trim).rtrim(trim);
      },
      xss: function(value) {
        return sanitize(value).xss();
      },
      entityDecode: function(value) {
        return sanitize(value).entityDecode();
      },
      "with": function(value) {
        return sanitize(value).chain();
      }
    };
    validating = {
      isEmail: function(value) {
        var result;
        result = check(value).isEmail();
        if (!result._errors.length) {
          return true;
        }
        return false;
      },
      isUUID: function(value) {
        var result;
        try {
          result = check(value).isUUID();
        } catch (_error) {}
        if (!result._errors.length) {
          return true;
        }
        return result;
      },
      isAccept: function(value, param) {
        param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";
        return !!value.match(new RegExp(".(" + param + ")$", "i"));
      },
      isPhone: function(value, options) {
        var pattern;
        if (options == null) {
          options = {};
        }
        pattern = phoneFormats[options.format] || /^\d{3}-\d{3}-\d{4}|\d{3}\.\d{3}\.\d{4}|\d{10}|\d{3}\s\d{3}\s\d{4}|\(\d{3}\)\s\d{3}-\d{4}$/i;
        return !!value.toString().match(pattern);
      },
      isCreditCard: function(value) {
        return _.isLuhn(value);
      },
      isMasterCard: function(value) {
        return _.isLuhn(value) && !!value.match(/^5[1-5].{14}/);
      },
      isAmex: function(value) {
        return _.isLuhn(value) && !!value.match(/^3[47].{13}/);
      },
      isVisa: function(value) {
        return _.isLuhn(value) && !!value.match(/^4.{15}/);
      },
      isLuhn: function(value) {
        var digit, i, length, number, parity, total;
        if (!value) {
          return false;
        }
        number = value.toString().replace(/\D/g, "");
        length = number.length;
        parity = length % 2;
        total = 0;
        i = 0;
        while (i < length) {
          digit = number.charAt(i);
          if (i % 2 === parity) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9;
            }
          }
          total += parseInt(digit);
          i++;
        }
        return total % 10 === 0;
      },
      isWeakPassword: function(value) {
        return !!value.match(/(?=.{6,}).*/g);
      },
      isMediumPassword: function(value) {
        return !!value.match(/^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$/);
      },
      isStrongPassword: function(value) {
        return !!value.match(/^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).*$/);
      },
      isPostalCode: function(value, country) {
        if (country == null) {
          country = 'us';
        }
        return !!value.match(postalCodeFormats[country]);
      },
      isSlug: function(value) {
        return value === _.parameterize(value);
      }
    };
    _ref = ['DinersClub', 'EnRoute', 'Discover', 'JCB', 'CarteBlanche', 'Switch', 'Solo', 'Laser'];
    _fn = function(cardType) {
      return validating["is" + cardType] = function(value) {
        return _.isLuhn(value);
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cardType = _ref[_i];
      _fn(cardType);
    }
    inflections = {
      pluralize: function() {
        return inflector.pluralize.apply(inflector, arguments);
      },
      singularize: function() {
        return inflector.singularize.apply(inflector, arguments);
      },
      camelCase: function(value) {
        return Tower.Support.String.camelize(value);
      }
    };
    asyncing = {
      series: function() {
        var _ref1;
        return (_ref1 = Tower.modules.async).series.apply(_ref1, arguments);
      },
      parallel: function() {
        var _ref1;
        return (_ref1 = Tower.modules.async).parallel.apply(_ref1, arguments);
      }
    };
    _.mixin(casting);
    _.mixin(sanitizing);
    _.mixin(inflections);
    _.mixin(validating);
    return _.mixin(asyncing);
  })();

  Tower.Factory = (function() {

    __defineStaticProperty(Factory,  "definitions", {});

    __defineStaticProperty(Factory,  "clear", function() {
      return this.definitions = {};
    });

    __defineStaticProperty(Factory,  "define", function(name, options, callback) {
      return this.definitions[name] = new Tower.Factory(name, options, callback);
    });

    __defineStaticProperty(Factory,  "create", function(name, options, callback) {
      var factory;
      factory = Tower.Factory.definitions[name];
      if (!factory) {
        throw new Error("Factory '" + name + "' doesn't exist.");
      }
      return factory.create(options, callback);
    });

    function Factory(name, options, callback) {
      if (options == null) {
        options = {};
      }
      if (this.constructor !== Tower.Factory) {
        return Tower.Factory.create(name, options);
      }
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (typeof callback !== "function") {
        throw new Error("Expected function callback for Factory '" + name + "'");
      }
      this.name = name;
      this.className = Tower.namespaced(Tower.Support.String.camelize(options.className || name));
      this.parentClassName = options.parent;
      this.callback = callback;
    }

    __defineProperty(Factory,  "toClass", function() {
      var fn, node, parts, _i, _len;
      parts = this.className.split(".");
      fn = global;
      for (_i = 0, _len = parts.length; _i < _len; _i++) {
        node = parts[_i];
        fn = fn[node];
      }
      if (typeof fn !== "function") {
        throw new Error("Class " + string + " not found");
      }
      return fn;
    });

    __defineProperty(Factory,  "create", function(overrides, callback) {
      var _this = this;
      if (typeof overrides === "function") {
        callback = overrides;
        overrides = {};
      }
      overrides || (overrides = {});
      return this.createAttributes(overrides, function(error, attributes) {
        var klass, result;
        klass = _this.toClass();
        result = klass.build();
        result.setProperties(attributes);
        if (result.save) {
          result.save(function() {
            if (callback) {
              return callback.call(_this, error, result);
            }
          });
        } else {
          if (callback) {
            callback.call(_this, error, result);
          }
        }
        return result;
      });
    });

    __defineProperty(Factory,  "createAttributes", function(overrides, callback) {
      var _this = this;
      if (this.callback.length) {
        return this.callback.call(this, function(error, attributes) {
          return callback.call(_this, error, _.extend(attributes, overrides));
        });
      } else {
        return callback.call(this, null, _.extend(this.callback.call(this), overrides));
      }
    });

    return Factory;

  })();

  Tower.Hook = (function(_super) {
    var Hook;

    function Hook() {
      return Hook.__super__.constructor.apply(this, arguments);
    }

    Hook = __extends(Hook, _super);

    Hook.include(Tower.Support.Callbacks);

    return Hook;

  })(Ember.Application);

  Tower.Engine = (function(_super) {
    var Engine;

    function Engine() {
      return Engine.__super__.constructor.apply(this, arguments);
    }

    Engine = __extends(Engine, _super);

    return Engine;

  })(Tower.Hook);

  Tower.Application = (function(_super) {
    var Application;

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application = __extends(Application, _super);

    __defineStaticProperty(Application,  "_callbacks", {});

    __defineStaticProperty(Application,  "extended", function() {});

    Application.before('initialize', 'setDefaults');

    __defineProperty(Application,  "setDefaults", function() {
      Tower.Model["default"]("store", Tower.Store.Ajax);
      Tower.Model.field("id", {
        type: "Id"
      });
      return true;
    });

    __defineStaticProperty(Application,  "configure", function(block) {
      return this.initializers().push(block);
    });

    __defineStaticProperty(Application,  "initializers", function() {
      return this._initializers || (this._initializers = []);
    });

    __defineStaticProperty(Application,  "instance", function() {
      return this._instance;
    });

    __defineStaticProperty(Application,  "defaultStack", function() {
      this.use(Tower.Middleware.Location);
      this.use(Tower.Middleware.Router);
      return this.middleware;
    });

    __defineStaticProperty(Application,  "use", function() {
      this.middleware || (this.middleware = []);
      return this.middleware.push(arguments);
    });

    __defineProperty(Application,  "use", function() {
      var _ref;
      return (_ref = this.constructor).use.apply(_ref, arguments);
    });

    __defineProperty(Application,  "teardown", function() {
      return Tower.Route.reload();
    });

    __defineProperty(Application,  "init", function(middlewares) {
      var middleware, _base, _i, _len, _results;
      if (middlewares == null) {
        middlewares = [];
      }
      this._super.apply(this, arguments);
      if (Tower.Application._instance) {
        throw new Error("Already initialized application");
      }
      Tower.Application._instance = this;
      (_base = Tower.Application).middleware || (_base.middleware = []);
      this.io = global["io"];
      this.History = global["History"];
      this.stack = [];
      _results = [];
      for (_i = 0, _len = middlewares.length; _i < _len; _i++) {
        middleware = middlewares[_i];
        _results.push(this.use(middleware));
      }
      return _results;
    });

    __defineProperty(Application,  "initialize", function() {
      this.extractAgent();
      this.applyMiddleware();
      this.setDefaults();
      return this;
    });

    __defineProperty(Application,  "subscribe", function(key, block) {
      Tower.Model.Cursor.subscriptions.push(key);
      return this[key] = typeof block === 'function' ? block() : block;
    });

    __defineProperty(Application,  "unsubscribe", function(key) {
      Tower.Model.Cursor.subscriptions.push(key).splice(_.indexOf(key), 1);
      return delete this[key];
    });

    __defineProperty(Application,  "applyMiddleware", function() {
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
    });

    __defineProperty(Application,  "middleware", function() {
      var args, handle, route;
      args = _.args(arguments);
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
    });

    __defineProperty(Application,  "extractAgent", function() {
      Tower.cookies = Tower.HTTP.Cookies.parse();
      return Tower.agent = new Tower.HTTP.Agent(JSON.parse(Tower.cookies["user-agent"] || '{}'));
    });

    __defineProperty(Application,  "listen", function() {
      var self;
      self = this;
      if (this.listening) {
        return;
      }
      this.listening = true;
      if (this.History && this.History.enabled) {
        this.History.Adapter.bind(global, "statechange", function() {
          var location, request, response, state;
          state = History.getState();
          location = new Tower.HTTP.Url(state.url);
          request = new Tower.HTTP.Request({
            url: state.url,
            location: location,
            params: _.extend({
              title: state.title
            }, state.data || {})
          });
          response = new Tower.HTTP.Response({
            url: state.url,
            location: location
          });
          return self.handle(request, response);
        });
        return $(global).trigger("statechange");
      } else {
        return console.warn("History not enabled");
      }
    });

    __defineProperty(Application,  "run", function() {
      return this.listen();
    });

    __defineProperty(Application,  "handle", function(request, response, out) {
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
          if (out) {
            return out(err);
          }
          if (err) {
            msg = ("production" === env ? "Internal Server Error" : err.stack || err.toString());
            if ("test" !== env) {
              console.error(err.stack || err.toString());
            }
            if (response.headerSent) {
              return request.socket.destroy();
            }
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
          if (undefined === path) {
            path = "/";
          }
          if (0 !== path.indexOf(layer.route)) {
            return next(err);
          }
          c = path[layer.route.length];
          if (c && "/" !== c && "." !== c) {
            return next(err);
          }
          removed = layer.route;
          request.url = request.url.substr(removed.length);
          if ("/" !== request.url[0]) {
            request.url = "/" + request.url;
          }
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
    });

    return Application;

  })(Tower.Engine);

  Tower.Store = (function(_super) {
    var Store;

    function Store() {
      return Store.__super__.constructor.apply(this, arguments);
    }

    Store = __extends(Store, _super);

    Store.include(Tower.Support.Callbacks);

    __defineStaticProperty(Store,  "defaultLimit", 100);

    __defineStaticProperty(Store,  "isKeyword", function(key) {
      return this.queryOperators.hasOwnProperty(key) || this.atomicModifiers.hasOwnProperty(key);
    });

    __defineStaticProperty(Store,  "hasKeyword", function(object) {
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
    });

    __defineStaticProperty(Store,  "atomicModifiers", {
      "$set": "$set",
      "$unset": "$unset",
      "$push": "$push",
      "$pushAll": "$pushAll",
      "$pull": "$pull",
      "$pullAll": "$pullAll",
      "$inc": "$inc",
      "$pop": "$pop",
      "$addToSet": "$addToSet"
    });

    __defineStaticProperty(Store,  "queryOperators", {
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
    });

    __defineStaticProperty(Store,  "booleans", {
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
    });

    __defineProperty(Store,  "supports", {});

    __defineProperty(Store,  "addIndex", function(name, options) {});

    __defineProperty(Store,  "serialize", function(data, saved) {
      var i, item, _i, _len;
      if (saved == null) {
        saved = false;
      }
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        item = data[i];
        data[i] = this.serializeModel(item, saved);
      }
      return data;
    });

    __defineProperty(Store,  "deserialize", function(models) {
      var i, model, _i, _len;
      for (i = _i = 0, _len = models.length; _i < _len; i = ++_i) {
        model = models[i];
        models[i] = this.deserializeModel(model);
      }
      return models;
    });

    __defineProperty(Store,  "serializeModel", function(attributes) {
      var klass, model;
      if (attributes instanceof Tower.Model) {
        return attributes;
      }
      klass = Tower.constant(this.className);
      model = klass["new"]();
      model.setProperties(attributes);
      return model;
    });

    __defineProperty(Store,  "deserializeModel", function(data) {
      if (data instanceof Tower.Model) {
        return data.get('changes');
      } else {
        return data;
      }
    });

    __defineProperty(Store,  "init", function(options) {
      if (options == null) {
        options = {};
      }
      this._super.apply(this, arguments);
      this.name = options.name;
      return this.className = options.type || Tower.namespaced(Tower.Support.String.camelize(Tower.Support.String.singularize(this.name)));
    });

    __defineProperty(Store,  "_defaultOptions", function(options) {
      return options;
    });

    __defineProperty(Store,  "load", function(records) {});

    __defineProperty(Store,  "fetch", function() {});

    __defineProperty(Store,  "schema", function() {
      return Tower.constant(this.className).fields();
    });

    __defineProperty(Store,  "supports", function(key) {
      return this.constructor.supports[key] === true;
    });

    __defineProperty(Store,  "hashWasUpdated", function(type, clientId, record) {
      if (Ember.get(record, 'isDeleted')) {
        return;
      }
      return this.updateCursors(type, clientId, record);
    });

    __defineProperty(Store,  "cursors", Ember.computed(function() {
      return [];
    }).cacheable());

    __defineProperty(Store,  "updateCursors", function(type, clientId, record) {});

    __defineProperty(Store,  "removeFromCursors", function(record) {});

    __defineProperty(Store,  "_mapKeys", function(key, records) {
      return _.map(records, function(record) {
        return record.get(key);
      });
    });

    return Store;

  })(Tower.Class);

  Tower.Store.Callbacks = {
    runBeforeInsert: function(criteria, callback) {
      return callback();
    },
    runAfterInsert: function(criteria, callback) {
      return callback();
    },
    runBeforeUpdate: function(criteria, callback) {
      if (criteria.throughRelation) {
        return criteria.appendThroughConditions(callback);
      } else {
        return callback();
      }
    },
    runAfterUpdate: function(criteria, callback) {
      return callback();
    },
    runBeforeDestroy: function(criteria, callback) {
      if (criteria.throughRelation) {
        return criteria.appendThroughConditions(callback);
      } else {
        return callback();
      }
    },
    runAfterDestroy: function(criteria, callback) {
      return callback();
    },
    runBeforeFind: function(criteria, callback) {
      if (criteria.throughRelation) {
        return criteria.appendThroughConditions(callback);
      } else {
        return callback();
      }
    },
    runAfterFind: function(criteria, callback) {
      return callback();
    }
  };

  Tower.Store.Batch = (function(_super) {
    var Batch;

    function Batch() {
      return Batch.__super__.constructor.apply(this, arguments);
    }

    Batch = __extends(Batch, _super);

    __defineProperty(Batch,  "autocommit", Tower.isServer);

    __defineProperty(Batch,  "bulk", false);

    __defineProperty(Batch,  "init", function() {
      this._super.apply(this, arguments);
      return Ember.set(this, 'buckets', {
        clean: Ember.Map.create(),
        created: Ember.Map.create(),
        updated: Ember.Map.create(),
        deleted: Ember.Map.create()
      });
    });

    __defineProperty(Batch,  "removeCleanRecords", function() {
      var clean,
        _this = this;
      clean = this.getBucket("clean");
      return clean.forEach(function(type, records) {
        return records.forEach(function(record) {
          return _this.remove(record);
        });
      });
    });

    __defineProperty(Batch,  "add", function(record) {
      return this.adopt(record);
    });

    __defineProperty(Batch,  "remove", function(record) {
      var defaultTransaction;
      defaultTransaction = Ember.getPath(this, 'store.defaultTransaction');
      return defaultTransaction.adopt(record);
    });

    __defineProperty(Batch,  "adopt", function(record) {
      var oldTransaction;
      oldTransaction = record.get('transaction');
      if (oldTransaction) {
        oldTransaction.removeFromBucket('clean', record);
      }
      this.addToBucket('clean', record);
      return record.set('transaction', this);
    });

    __defineProperty(Batch,  "addToBucket", function(kind, record) {
      var bucket, records, type;
      bucket = Ember.get(Ember.get(this, 'buckets'), kind);
      type = this.getType(record);
      records = bucket.get(type);
      if (!records) {
        records = Ember.OrderedSet.create();
        bucket.set(type, records);
      }
      return records.add(record);
    });

    __defineProperty(Batch,  "removeFromBucket", function(kind, record) {
      var bucket, records, type;
      bucket = this.getBucket(kind);
      type = this.getType(record);
      records = bucket.get(type);
      if (records) {
        return records.remove(record);
      }
    });

    __defineProperty(Batch,  "getBucket", function(kind) {
      return Ember.get(Ember.get(this, 'buckets'), kind);
    });

    __defineProperty(Batch,  "getType", function(recordOrCursor) {
      if (recordOrCursor instanceof Tower.Model.Cursor) {
        return recordOrCursor.getType();
      } else {
        return recordOrCursor.constructor;
      }
    });

    __defineProperty(Batch,  "recordBecameClean", function(kind, record) {
      var defaultTransaction;
      this.removeFromBucket(kind, record);
      defaultTransaction = Ember.getPath(this, 'store.defaultTransaction');
      if (defaultTransaction) {
        return defaultTransaction.adopt(record);
      }
    });

    __defineProperty(Batch,  "recordBecameDirty", function(kind, record) {
      this.removeFromBucket('clean', record);
      return this.addToBucket(kind, record);
    });

    __defineProperty(Batch,  "commit", function(callback) {
      var commitDetails, iterate, store,
        _this = this;
      iterate = function(bucketType, fn, binding) {
        var dirty;
        dirty = _this.getBucket(bucketType);
        return dirty.forEach(function(type, records) {
          var array;
          if (records.isEmpty()) {
            return;
          }
          array = [];
          records.forEach(function(record) {
            record.send("willCommit");
            return array.push(record);
          });
          return fn.call(binding, type, array);
        });
      };
      commitDetails = {
        updated: {
          eachType: function(fn, binding) {
            return iterate("updated", fn, binding);
          }
        },
        created: {
          eachType: function(fn, binding) {
            return iterate("created", fn, binding);
          }
        },
        deleted: {
          eachType: function(fn, binding) {
            return iterate("deleted", fn, binding);
          }
        }
      };
      this.removeCleanRecords();
      store = Ember.get(this, "store");
      return store.commit(commitDetails, callback);
    });

    return Batch;

  })(Tower.Class);

  Tower.Store.Memory = (function(_super) {
    var Memory;

    function Memory() {
      return Memory.__super__.constructor.apply(this, arguments);
    }

    Memory = __extends(Memory, _super);

    __defineStaticProperty(Memory,  "stores", function() {
      return this._stores || (this._stores = []);
    });

    __defineStaticProperty(Memory,  "clean", function(callback) {
      var store, stores, _i, _len;
      stores = this.stores();
      for (_i = 0, _len = stores.length; _i < _len; _i++) {
        store = stores[_i];
        store.clean();
      }
      return callback();
    });

    __defineProperty(Memory,  "init", function(options) {
      this._super.apply(this, arguments);
      return this.initialize();
    });

    __defineProperty(Memory,  "initialize", function() {
      this.constructor.stores().push(this);
      this.records = {};
      this.lastId = 1;
      return Ember.set(this, 'batch', new Tower.Store.Batch);
    });

    __defineProperty(Memory,  "clean", function() {
      this.records = {};
      return this.lastId = 1;
    });

    __defineProperty(Memory,  "commit", function() {
      return Ember.get(this, 'batch').commit();
    });

    return Memory;

  })(Tower.Store);

  Tower.Store.Memory.Finders = {
    find: function(criteria, callback) {
      var conditions, endIndex, key, limit, options, record, records, result, sort, startIndex;
      result = [];
      records = this.records;
      conditions = criteria.conditions();
      options = criteria;
      if (_.isPresent(conditions)) {
        for (key in records) {
          record = records[key];
          if (Tower.Store.Operators.test(record, conditions)) {
            result.push(record);
          }
        }
      } else {
        for (key in records) {
          record = records[key];
          result.push(record);
        }
      }
      sort = options.get('order');
      limit = options.get('limit');
      startIndex = options.get('offset') || 0;
      if (sort.length) {
        result = this.sort(result, sort);
      }
      endIndex = startIndex + (limit || result.length) - 1;
      result = result.slice(startIndex, endIndex + 1 || 9e9);
      if (callback) {
        result = callback.call(this, null, result);
      }
      return result;
    },
    findOne: function(criteria, callback) {
      var record,
        _this = this;
      record = void 0;
      criteria.limit(1);
      this.find(criteria, function(error, records) {
        record = records[0] || null;
        if (callback) {
          return callback.call(_this, error, record);
        }
      });
      return record;
    },
    count: function(criteria, callback) {
      var result,
        _this = this;
      result = void 0;
      this.find(criteria, function(error, records) {
        result = records.length;
        if (callback) {
          return callback.call(_this, error, result);
        }
      });
      return result;
    },
    exists: function(criteria, callback) {
      var result,
        _this = this;
      result = void 0;
      this.count(criteria, function(error, record) {
        result = !!record;
        if (callback) {
          return callback.call(_this, error, result);
        }
      });
      return result;
    },
    sort: function(records, sortings) {
      return _.sortBy.apply(_, [records].concat(__slice.call(sortings)));
    }
  };

  Tower.Store.Memory.Persistence = {
    load: function(data) {
      var record, records, _i, _len;
      records = _.castArray(data);
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        this.loadOne(this.serializeModel(record));
      }
      return records;
    },
    loadOne: function(record) {
      record.persistent = true;
      return this.records[record.get('id').toString()] = record;
    },
    insert: function(criteria, callback) {
      var object, result, _i, _len, _ref;
      result = [];
      _ref = criteria.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        result.push(this.insertOne(object));
      }
      result = criteria["export"](result);
      if (callback) {
        callback.call(this, null, result);
      }
      return result;
    },
    insertOne: function(record) {
      var attributes;
      attributes = this.deserializeModel(record);
      if (attributes.id == null) {
        attributes.id = this.generateId();
      }
      attributes.id = attributes.id.toString();
      return this.loadOne(this.serializeModel(record));
    },
    update: function(updates, criteria, callback) {
      var _this = this;
      return this.find(criteria, function(error, records) {
        if (error) {
          return _.error(error, callback);
        }
        if (callback) {
          callback.call(_this, error, records);
        }
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
    destroy: function(criteria, callback) {
      return this.find(criteria, function(error, records) {
        var record, _i, _len;
        if (error) {
          return _.error(error, callback);
        }
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          this.destroyOne(record);
        }
        if (callback) {
          callback.call(this, error, records);
        }
        return records;
      });
    },
    destroyOne: function(record) {
      return delete this.records[record.get('id').toString()];
    }
  };

  Tower.Store.Memory.Serialization = {
    generateId: function() {
      return (this.lastId++).toString();
    }
  };

  Tower.Store.Memory.include(Tower.Store.Memory.Finders);

  Tower.Store.Memory.include(Tower.Store.Memory.Persistence);

  Tower.Store.Memory.include(Tower.Store.Memory.Serialization);

  Tower.Store.Modifiers = {
    MAP: {
      '$set': '$set',
      '$unset': '$unset',
      '$push': '$push',
      '$pushEach': '$pushEach',
      '$pull': '$pull',
      '$pullEach': '$pullEach',
      '$remove': '$pull',
      '$removeEach': '$pullEach',
      '$inc': '$inc',
      '$pop': '$pop',
      '$add': '$add',
      '$addEach': '$addEach',
      '$addToSet': '$add'
    },
    SET: ['push', 'pushEach', 'pull', 'pullEach', 'inc', 'add', 'addEach', 'remove', 'removeEach', 'unset'],
    set: function(key, value) {
      return _.oneOrMany(this, this._set, key, value);
    },
    push: function(key, value) {
      return _.oneOrMany(this, this._push, key, value);
    },
    pushEach: function(key, value) {
      return _.oneOrMany(this, this._push, key, value, true);
    },
    pull: function(key, value) {
      return _.oneOrMany(this, this._pull, key, value);
    },
    pullEach: function(key, value) {
      return _.oneOrMany(this, this._pull, key, value, true);
    },
    inc: function(key, value) {
      return _.oneOrMany(this, this._inc, key, value);
    },
    add: function(key, value) {
      return _.oneOrMany(this, this._add, key, value);
    },
    unset: function() {
      var key, keys, _i, _len;
      keys = _.flatten(_.args(arguments));
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        delete this[key];
      }
      return;
    },
    _set: function(key, value) {},
    _push: function(key, value, array) {
      if (array == null) {
        array = false;
      }
    },
    _pull: function(key, value, array) {
      if (array == null) {
        array = false;
      }
    },
    _inc: function(key, value) {},
    _add: function(key, value) {},
    _remove: function(key, value) {}
  };

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

  Tower.Store.Serializer = {
    String: {
      from: function(serialized) {
        if (_.none(serialized)) {
          return null;
        } else {
          return String(serialized);
        }
      },
      to: function(deserialized) {
        if (_.none(deserialized)) {
          return null;
        } else {
          return String(deserialized);
        }
      }
    },
    Number: {
      from: function(serialized) {
        if (_.none(serialized)) {
          return null;
        } else {
          return Number(serialized);
        }
      },
      to: function(deserialized) {
        if (_.none(deserialized)) {
          return null;
        } else {
          return Number(deserialized);
        }
      }
    },
    Integer: {
      from: function(serialized) {
        if (_.none(serialized)) {
          return null;
        } else {
          return parseInt(serialized);
        }
      },
      to: function(deserialized) {
        if (_.none(deserialized)) {
          return null;
        } else {
          return parseInt(deserialized);
        }
      }
    },
    Float: {
      from: function(serialized) {
        return parseFloat(serialized);
      },
      to: function(deserialized) {
        return deserialized;
      }
    },
    Boolean: {
      from: function(serialized) {
        if (typeof serialized === 'string') {
          return !!(serialized !== 'false');
        } else {
          return Boolean(serialized);
        }
      },
      to: function(deserialized) {
        return Tower.Store.Serializer.Boolean.from(deserialized);
      }
    },
    Date: {
      from: function(date) {
        return date;
      },
      to: function(date) {
        return _.toDate(date);
      }
    },
    Geo: {
      from: function(serialized) {
        return serialized;
      },
      to: function(deserialized) {
        switch (_.kind(deserialized)) {
          case 'array':
            return {
              lat: deserialized[0],
              lng: deserialized[1]
            };
          case 'object':
            return {
              lat: deserialized.lat || deserialized.latitude,
              lng: deserialized.lng || deserialized.longitude
            };
          default:
            deserialized = deserialized.split(/,\ */);
            return {
              lat: parseFloat(deserialized[0]),
              lng: parseFloat(deserialized[1])
            };
        }
      }
    },
    Array: {
      from: function(serialized) {
        if (_.none(serialized)) {
          return null;
        } else {
          return _.castArray(serialized);
        }
      },
      to: function(deserialized) {
        return Tower.Store.Serializer.Array.from(deserialized);
      }
    }
  };

  Tower.Store.Serializer.Decimal = Tower.Store.Serializer.Float;

  Tower.Store.Serializer.Time = Tower.Store.Serializer.Date;

  Tower.Store.Serializer.DateTime = Tower.Store.Serializer.Date;

  Tower.Store.Transaction = (function(_super) {
    var Transaction;

    function Transaction() {
      return Transaction.__super__.constructor.apply(this, arguments);
    }

    Transaction = __extends(Transaction, _super);

    __defineProperty(Transaction,  "init", function() {
      return this.records = [];
    });

    __defineProperty(Transaction,  "add", function(record) {
      return this.records.push(record);
    });

    __defineProperty(Transaction,  "remove", function(record) {
      return this.records.splice(1, _.indexOf(this.records, record));
    });

    __defineProperty(Transaction,  "adopt", function(record) {
      var transaction;
      transaction = record.get('transaction');
      if (transaction !== this) {
        transaction.remove(record);
        return this.add(record);
      }
    });

    __defineProperty(Transaction,  "committed", function() {
      var record, records, _i, _len, _results;
      records = this.records;
      _results = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        _results.push(record.committed());
      }
      return _results;
    });

    __defineProperty(Transaction,  "rollback", function() {
      var record, records, _i, _len, _results;
      records = this.records;
      _results = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        _results.push(record.rollback());
      }
      return _results;
    });

    return Transaction;

  })(Tower.Class);

  Tower.Store.include(Tower.Store.Callbacks);

  Tower.Store.Ajax = (function(_super) {
    var Ajax, sync;

    Ajax = __extends(Ajax, _super);

    __defineStaticProperty(Ajax,  "requests", []);

    __defineStaticProperty(Ajax,  "enabled", true);

    __defineStaticProperty(Ajax,  "pending", false);

    function Ajax() {
      Ajax.__super__.constructor.apply(this, arguments);
      this.deleted = {};
    }

    __defineStaticProperty(Ajax,  "defaults", {
      contentType: 'application/json',
      dataType: 'json',
      processData: false,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    __defineStaticProperty(Ajax,  "ajax", function(params, defaults) {
      return $.ajax($.extend({}, this.defaults, defaults, params));
    });

    __defineStaticProperty(Ajax,  "toJSON", function(record, method, format) {
      var data;
      data = {};
      data[Tower.Support.String.camelize(record.constructor.className(), true)] = record;
      data._method = method;
      data.format = format;
      return JSON.stringify(data);
    });

    __defineStaticProperty(Ajax,  "disable", function(callback) {
      if (this.enabled) {
        this.enabled = false;
        callback();
        return this.enabled = true;
      } else {
        return callback();
      }
    });

    __defineStaticProperty(Ajax,  "requestNext", function() {
      var next;
      next = this.requests.shift();
      if (next) {
        return this.request(next);
      } else {
        return this.pending = false;
      }
    });

    __defineStaticProperty(Ajax,  "request", function(callback) {
      var _this = this;
      return (callback()).complete(function() {
        return _this.requestNext();
      });
    });

    __defineStaticProperty(Ajax,  "queue", function(callback) {
      if (!this.enabled) {
        return;
      }
      if (this.pending) {
        this.requests.push(callback);
      } else {
        this.pending = true;
        this.request(callback);
      }
      return callback;
    });

    __defineProperty(Ajax,  "success", function(record, options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      return function(data, status, xhr) {
        var _ref;
        Ajax.disable(function() {
          if (data && !_.isBlank(data)) {
            return record.updateAttributes(data, {
              sync: false
            });
          }
        });
        return (_ref = options.success) != null ? _ref.apply(_this.record) : void 0;
      };
    });

    __defineProperty(Ajax,  "failure", function(record, options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      return function(xhr, statusText, error) {
        var _ref;
        return (_ref = options.error) != null ? _ref.apply(record) : void 0;
      };
    });

    __defineProperty(Ajax,  "queue", function(callback) {
      return this.constructor.queue(callback);
    });

    __defineProperty(Ajax,  "request", function() {
      var _ref;
      return (_ref = this.constructor).request.apply(_ref, arguments);
    });

    __defineProperty(Ajax,  "ajax", function() {
      var _ref;
      return (_ref = this.constructor).ajax.apply(_ref, arguments);
    });

    __defineProperty(Ajax,  "toJSON", function() {
      var _ref;
      return (_ref = this.constructor).toJSON.apply(_ref, arguments);
    });

    __defineProperty(Ajax,  "insert", function(criteria, callback) {
      var _this = this;
      if (criteria.sync !== false) {
        return this._super(criteria, function(error, records) {
          if (callback) {
            callback.call(_this, error, records);
          }
          return _this.createRequest(records, criteria);
        });
      } else {
        return Ajax.__super__[ "insert"].apply(this, arguments);
      }
    });

    __defineProperty(Ajax,  "update", function(updates, criteria, callback) {
      var _this = this;
      if (criteria.sync === true) {
        return this._super(updates, criteria, function(error, result) {
          if (callback) {
            callback.call(_this, error, result);
          }
          return _this.updateRequest(result, criteria);
        });
      } else {
        return Ajax.__super__[ "update"].apply(this, arguments);
      }
    });

    __defineProperty(Ajax,  "destroy", function(criteria, callback) {
      var _this = this;
      if (criteria.sync !== false) {
        return this._super(criteria, function(error, result) {
          _this.destroyRequest(result, criteria);
          if (callback) {
            return callback.call(_this, error, result);
          }
        });
      } else {
        return Ajax.__super__[ "destroy"].apply(this, arguments);
      }
    });

    __defineProperty(Ajax,  "createRequest", function(records, options) {
      var json, url,
        _this = this;
      if (options == null) {
        options = {};
      }
      json = this.toJSON(records);
      url = Tower.urlFor(records.constructor);
      return this.queue(function() {
        var params;
        params = {
          url: url,
          type: "POST",
          data: json
        };
        return _this.ajax(options, params).success(_this.createSuccess(records)).error(_this.createFailure(records));
      });
    });

    __defineProperty(Ajax,  "createSuccess", function(record) {
      var _this = this;
      return function(data, status, xhr) {
        var id;
        id = record.id;
        record = _this.find(id);
        _this.records[data.id] = record;
        delete _this.records[id];
        return record.updateAttributes(data);
      };
    });

    __defineProperty(Ajax,  "createFailure", function(record) {
      return this.failure(record);
    });

    __defineProperty(Ajax,  "updateRequest", function(record, options, callback) {
      var _this = this;
      return this.queue(function() {
        var params;
        params = {
          type: "PUT",
          data: _this.toJSON(record)
        };
        return _this.ajax({}, params).success(_this.updateSuccess(record)).error(_this.updateFailure(record));
      });
    });

    __defineProperty(Ajax,  "updateSuccess", function(record) {
      var _this = this;
      return function(data, status, xhr) {
        record = Tower.constant(_this.className).find(record.id);
        return record.updateAttributes(data);
      };
    });

    __defineProperty(Ajax,  "updateFailure", function(record) {
      var _this = this;
      return function(xhr, statusText, error) {};
    });

    __defineProperty(Ajax,  "destroyRequest", function(record, criteria) {
      var _this = this;
      return this.queue(function() {
        var params, url;
        if (_.isArray(record)) {
          record = record[0];
        }
        url = Tower.urlFor(record);
        params = {
          url: url,
          type: 'POST',
          data: JSON.stringify({
            format: 'json',
            _method: 'DELETE'
          })
        };
        return _this.ajax({}, params).success(_this.destroySuccess(record)).error(_this.destroyFailure(record));
      });
    });

    __defineProperty(Ajax,  "destroySuccess", function(data) {
      var _this = this;
      return function(data, status, xhr) {
        return delete _this.deleted[data.id];
      };
    });

    __defineProperty(Ajax,  "destroyFailure", function(record) {
      var _this = this;
      return function(xhr, statusText, error) {};
    });

    __defineProperty(Ajax,  "findRequest", function(options) {
      var _this = this;
      return this.queue(function() {
        var params;
        params = {
          type: "GET",
          data: _this.toJSON(record)
        };
        return _this.ajax({}, params).success(_this.findSuccess(options)).error(_this.findFailure(options));
      });
    });

    __defineProperty(Ajax,  "findSuccess", function(options) {
      var _this = this;
      return function(data, status, xhr) {
        if (_.isPresent(data)) {
          return _this.load(data);
        }
      };
    });

    __defineProperty(Ajax,  "findFailure", function(record) {
      var _this = this;
      return function(xhr, statusText, error) {};
    });

    __defineProperty(Ajax,  "findOneRequest", function(options, callback) {
      var _this = this;
      return this.queue(function() {
        var params;
        params = {
          type: "GET",
          data: _this.toJSON(record)
        };
        return _this.ajax({}, params).success(_this.findSuccess(options)).error(_this.findFailure(options));
      });
    });

    __defineProperty(Ajax,  "findOneSuccess", function(options) {
      var _this = this;
      return function(data, status, xhr) {};
    });

    __defineProperty(Ajax,  "findOneFailure", function(options) {
      var _this = this;
      return function(xhr, statusText, error) {};
    });

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
          if (record.syncAction) {
            changes[record.syncAction].push(record);
          }
        }
        if (changes.create != null) {
          _this.createRequest(changes.create);
        }
        if (changes.update != null) {
          _this.updateRequest(changes.update);
        }
        if (changes.destroy != null) {
          _this.destroyRequest(changes.destroy);
        }
        return true;
      });
    };

    __defineProperty(Ajax,  "refresh", function() {});

    __defineProperty(Ajax,  "fetch", function() {});

    return Ajax;

  })(Tower.Store.Memory);

  Tower.Store.LocalStorage = (function(_super) {
    var LocalStorage;

    function LocalStorage() {
      return LocalStorage.__super__.constructor.apply(this, arguments);
    }

    LocalStorage = __extends(LocalStorage, _super);

    __defineProperty(LocalStorage,  "initialize", function() {
      return this.lastId = 0;
    });

    __defineProperty(LocalStorage,  "_setRecord", function(record) {});

    __defineProperty(LocalStorage,  "_getRecord", function(key) {
      return this;
    });

    __defineProperty(LocalStorage,  "_removeRecord", function(key) {
      return delete this.records[record.id];
    });

    return LocalStorage;

  })(Tower.Store.Memory);

  Tower.Model = (function(_super) {
    var Model;

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    Model = __extends(Model, _super);

    Model.reopen(Ember.Evented);

    __defineProperty(Model,  "errors", null);

    __defineProperty(Model,  "init", function(attrs, options) {
      var attributes, definition, definitions, name;
      if (attrs == null) {
        attrs = {};
      }
      if (options == null) {
        options = {};
      }
      this._super.apply(this, arguments);
      definitions = this.constructor.fields();
      attributes = {};
      for (name in definitions) {
        definition = definitions[name];
        attributes[name] = definition.defaultValue(this);
      }
      this.errors = {};
      if (this.constructor.isSubClass()) {
        attributes.type || (attributes.type = this.constructor.className());
      }
      this.readOnly = options.hasOwnProperty('readOnly') ? options.readOnly : false;
      return this.setProperties(attrs);
    });

    return Model;

  })(Tower.Class);

  Tower.Model.Scope = (function() {

    __defineStaticProperty(Scope,  "finderMethods", ['find', 'all', 'first', 'last', 'count', 'exists', 'instantiate', 'pluck']);

    __defineStaticProperty(Scope,  "persistenceMethods", ['insert', 'update', 'create', 'destroy', 'build']);

    __defineStaticProperty(Scope,  "queryMethods", ['where', 'order', 'sort', 'asc', 'desc', 'gte', 'gt', 'lte', 'lt', 'limit', 'offset', 'select', 'joins', 'includes', 'excludes', 'paginate', 'page', 'allIn', 'allOf', 'alsoIn', 'anyIn', 'anyOf', 'notIn', 'near', 'within']);

    __defineStaticProperty(Scope,  "queryOperators", {
      '>=': '$gte',
      '$gte': '$gte',
      '>': '$gt',
      '$gt': '$gt',
      '<=': '$lte',
      '$lte': '$lte',
      '<': '$lt',
      '$lt': '$lt',
      '$in': '$in',
      '$nin': '$nin',
      '$any': '$any',
      '$all': '$all',
      '=~': '$regex',
      '$m': '$regex',
      '$regex': '$regex',
      '$match': '$match',
      '$notMatch': '$notMatch',
      '!~': '$nm',
      '$nm': '$nm',
      '=': '$eq',
      '$eq': '$eq',
      '!=': '$neq',
      '$neq': '$neq',
      '$null': '$null',
      '$notNull': '$notNull'
    });

    function Scope(cursor) {
      this.cursor = cursor;
    }

    __defineProperty(Scope,  "has", function(object) {
      return this.cursor.has(object);
    });

    __defineProperty(Scope,  "build", function() {
      var args, callback, cursor;
      cursor = this.compile();
      args = _.args(arguments);
      callback = _.extractBlock(args);
      cursor.addData(args);
      return cursor.build(callback);
    });

    __defineProperty(Scope,  "insert", function() {
      var args, callback, cursor;
      cursor = this.compile();
      args = _.args(arguments);
      callback = _.extractBlock(args);
      cursor.addData(args);
      return cursor.insert(callback);
    });

    __defineProperty(Scope,  "create", Scope.prototype.insert);

    __defineProperty(Scope,  "update", function() {
      var args, callback, cursor, updates;
      cursor = this.compile();
      args = _.flatten(_.args(arguments));
      callback = _.extractBlock(args);
      updates = args.pop();
      if (!(updates && typeof updates === 'object')) {
        throw new Error('Must pass in updates hash');
      }
      cursor.addData(updates);
      cursor.addIds(args);
      return cursor.update(callback);
    });

    __defineProperty(Scope,  "destroy", function() {
      var args, callback, cursor;
      cursor = this.compile();
      args = _.flatten(_.args(arguments));
      callback = _.extractBlock(args);
      cursor.addIds(args);
      return cursor.destroy(callback);
    });

    __defineProperty(Scope,  "add", function() {
      var args, callback, cursor;
      cursor = this.compile();
      args = _.args(arguments);
      callback = _.extractBlock(args);
      cursor.addData(args);
      return cursor.add(callback);
    });

    __defineProperty(Scope,  "remove", function() {
      var args, callback, cursor;
      cursor = this.compile();
      args = _.flatten(_.args(arguments));
      callback = _.extractBlock(args);
      cursor.addIds(args);
      return cursor.remove(callback);
    });

    __defineProperty(Scope,  "find", function() {
      var args, callback, cursor;
      cursor = this.compile();
      args = _.flatten(_.args(arguments));
      callback = _.extractBlock(args);
      cursor.addIds(args);
      return cursor.find(callback);
    });

    __defineProperty(Scope,  "first", function(callback) {
      var cursor;
      cursor = this.compile();
      return cursor.findOne(callback);
    });

    __defineProperty(Scope,  "last", function(callback) {
      var cursor;
      cursor = this.compile();
      cursor.reverseSort();
      return cursor.findOne(callback);
    });

    __defineProperty(Scope,  "all", function(callback) {
      return this.compile().find(callback);
    });

    __defineProperty(Scope,  "pluck", function() {
      var attributes;
      attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.compile().find(callback);
    });

    __defineProperty(Scope,  "explain", function() {
      return this.compile().explain(callback);
    });

    __defineProperty(Scope,  "count", function(callback) {
      return this.compile().count(callback);
    });

    __defineProperty(Scope,  "exists", function(callback) {
      return this.compile().exists(callback);
    });

    __defineProperty(Scope,  "batch", function() {
      return this;
    });

    __defineProperty(Scope,  "fetch", function() {});

    __defineProperty(Scope,  "options", function(options) {
      return _.extend(this.cursor.options, options);
    });

    __defineProperty(Scope,  "compile", function() {
      return this.cursor.clone();
    });

    __defineProperty(Scope,  "clone", function() {
      return new this.constructor(this.cursor.clone());
    });

    return Scope;

  })();

  _ref = Tower.Model.Scope.queryMethods;
  _fn = function(key) {
    return Tower.Model.Scope.prototype[key] = function() {
      var clone, _ref1;
      clone = this.clone();
      (_ref1 = clone.cursor)[key].apply(_ref1, arguments);
      return clone;
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    _fn(key);
  }

  Tower.Model.Cursor = (function(_super) {
    var Cursor;

    function Cursor() {
      return Cursor.__super__.constructor.apply(this, arguments);
    }

    Cursor = __extends(Cursor, _super);

    __defineProperty(Cursor,  "init", function() {
      return this._super.apply(this, arguments);
    });

    return Cursor;

  })(Tower.Collection);

  Tower.Model.Cursor.Finders = {
    ClassMethods: {
      subscriptions: [],
      pushMatching: function(records) {
        return this.applyMatching('pushMatching', records);
      },
      pullMatching: function(records) {
        return this.applyMatching('pullMatching', records);
      },
      applyMatching: function(method, records) {
        var app, key, subscriptions, _j, _len1;
        subscriptions = Tower.Model.Cursor.subscriptions;
        if (!subscriptions.length) {
          return;
        }
        app = Tower.Application.instance();
        for (_j = 0, _len1 = subscriptions.length; _j < _len1; _j++) {
          key = subscriptions[_j];
          app[key][method](records);
        }
        return;
      }
    },
    find: function(callback) {
      return this._find(callback);
    },
    _find: function(callback) {
      var _this = this;
      if (this.one) {
        this.store.findOne(this, callback);
      } else {
        this.store.find(this, function(error, records) {
          if (!error && records.length) {
            records = _this["export"](records);
          }
          if (callback) {
            callback.call(_this, error, records);
          }
          return records;
        });
      }
      return this;
    },
    findOne: function(callback) {
      this.limit(1);
      this.returnArray = false;
      return this.find(callback);
    },
    count: function(callback) {
      return this._count(callback);
    },
    _count: function(callback) {
      return this.store.count(this, callback);
    },
    exists: function(callback) {
      return this._exists(callback);
    },
    _exists: function(callback) {
      return this.store.exists(this, callback);
    },
    getType: function() {
      return this.model;
    },
    pushMatching: function(records) {
      var matching;
      matching = Tower.Store.Operators.select(records, this.conditions());
      this.addObjects(matching);
      return matching;
    },
    pullMatching: function(records) {
      var matching;
      matching = Tower.Store.Operators.select(records, this.conditions());
      this.removeObjects(matching);
      return matching;
    }
  };

  Tower.Model.Cursor.Operations = {
    eagerLoad: function(object) {
      return this._eagerLoad = _.extend(this._eagerLoad, object);
    },
    joins: function(object) {
      var joins, key, _j, _len1;
      joins = this._joins;
      if (_.isArray(object)) {
        for (_j = 0, _len1 = object.length; _j < _len1; _j++) {
          key = object[_j];
          joins[key] = true;
        }
      } else if (typeof object === 'string') {
        joins[object] = true;
      } else {
        _.extend(joins, object);
      }
      return joins;
    },
    except: function() {
      return this._except = _.flatten(_.args(arguments));
    },
    "with": function(transaction) {
      return this.transaction = transaction;
    },
    where: function(conditions) {
      if (conditions instanceof Tower.Model.Cursor) {
        return this.merge(conditions);
      } else {
        return this._where.push(conditions);
      }
    },
    order: function(attribute, direction) {
      if (direction == null) {
        direction = 'asc';
      }
      return this._order.push([attribute, direction]);
    },
    reverseSort: function() {
      var i, order, set, _j, _len1;
      order = this.get('order');
      for (i = _j = 0, _len1 = order.length; _j < _len1; i = ++_j) {
        set = order[i];
        set[1] = set[1] === 'asc' ? 'desc' : 'asc';
      }
      return order;
    },
    asc: function() {
      var attribute, attributes, _j, _len1;
      attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_j = 0, _len1 = attributes.length; _j < _len1; _j++) {
        attribute = attributes[_j];
        this.order(attribute);
      }
      return this._order;
    },
    desc: function() {
      var attribute, attributes, _j, _len1;
      attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_j = 0, _len1 = attributes.length; _j < _len1; _j++) {
        attribute = attributes[_j];
        this.order(attribute, 'desc');
      }
      return this._order;
    },
    gte: function() {},
    lte: function() {},
    gt: function() {},
    lt: function() {},
    allIn: function(attributes) {
      return this._whereOperator('$all', attributes);
    },
    anyIn: function(attributes) {
      return this._whereOperator('$any', attributes);
    },
    notIn: function(attributes) {
      return this._whereOperator('$nin', attributes);
    },
    offset: function(number) {
      return this._offset = number;
    },
    limit: function(number) {
      return this._limit = number;
    },
    select: function() {
      return this._fields = _.flatten(_.args(fields));
    },
    includes: function() {
      return this._includes = _.flatten(_.args(arguments));
    },
    uniq: function(value) {
      return this._uniq = value;
    },
    page: function(page) {
      var limit;
      limit = this.limit(this._limit || this.defaultLimit);
      return this.offset((Math.max(1, page) - 1) * limit);
    },
    paginate: function(options) {
      var limit, page;
      limit = options.perPage || options.limit;
      page = options.page || 1;
      this.limit(limit);
      return this.offset((page - 1) * limit);
    },
    near: function(coordinates) {
      return this.where({
        coordinates: {
          $near: coordinates
        }
      });
    },
    within: function(bounds) {
      return this.where({
        coordinates: {
          $maxDistance: bounds
        }
      });
    },
    test: function(record) {
      return Tower.Store.Operators.test(record, this.conditions());
    },
    _whereOperator: function(operator, attributes) {
      var key, query, value;
      query = {};
      for (key in attributes) {
        value = attributes[key];
        query[key] = {};
        query[key][operator] = value;
      }
      return this.where(query);
    }
  };

  Tower.Model.Cursor.Operations.sort = Tower.Model.Cursor.Operations.order;

  Tower.Model.Cursor.Persistence = {
    build: function(callback) {
      return this._build(callback);
    },
    _build: function(callback) {
      var attributes, data, item, result, store, _j, _len1;
      store = this.store;
      attributes = this.attributes();
      data = this.data || (this.data = []);
      if (!data.length) {
        data.push({});
      }
      result = [];
      for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
        item = data[_j];
        if (item instanceof Tower.Model) {
          item.setProperties(attributes);
        } else {
          item = store.serializeModel(_.extend({}, attributes, item));
        }
        result.push(item);
      }
      result = this.returnArray ? result : result[0];
      if (callback) {
        callback.call(this, null, result);
      }
      return result;
    },
    insert: function(callback) {
      return this._insert(callback);
    },
    _insert: function(callback) {
      var iterator, records, returnArray,
        _this = this;
      records = void 0;
      if (this.instantiate) {
        returnArray = this.returnArray;
        this.returnArray = true;
        records = this.build();
        this.returnArray = returnArray;
        iterator = function(record, next) {
          if (record) {
            return record.save(next);
          } else {
            return next();
          }
        };
        Tower.async(records, iterator, function(error) {
          Tower.cb(error, records);
          if (!callback) {
            if (error) {
              throw error;
            }
            if (!returnArray) {
              return records = records[0];
            }
          } else {
            if (error) {
              return callback(error);
            }
            if (!returnArray) {
              records = records[0];
            }
            return callback(error, records);
          }
        });
      } else {
        Tower.Model.Cursor.pushMatching(this.data);
        this.store.insert(this, callback);
      }
      return this;
    },
    update: function(callback) {
      return this._update(callback);
    },
    _update: function(callback) {
      var iterator, updates,
        _this = this;
      updates = this.data[0];
      if (this.instantiate) {
        iterator = function(record, next) {
          return record.updateAttributes(updates, next);
        };
        this._each(this, iterator, callback);
      } else {
        this.store.update(updates, this, callback);
      }
      return this;
    },
    destroy: function(callback) {
      return this._destroy(callback);
    },
    _destroy: function(callback) {
      var iterator;
      if (this.instantiate) {
        iterator = function(record, next) {
          return record.destroy(next);
        };
        this._each(this, iterator, callback);
      } else {
        this.store.destroy(this, callback);
      }
      return this;
    },
    add: function(callback) {},
    remove: function(callback) {}
  };

  Tower.Model.Cursor.Serialization = {
    defaultLimit: 20,
    make: function(options) {
      if (options == null) {
        options = {};
      }
      _.extend(this, options);
      this.model || (this.model = options.model);
      this.store = this.model ? this.model.store() : void 0;
      this.instantiate = options.instantiate !== false;
      this._where = options.where || [];
      this._joins = options.joins || {};
      this._order = this._array(options.order);
      this._data = this._array(options.data);
      this._except = this._array(options.except, true);
      this._includes = this._array(options.except, true);
      this._offset = options.offset;
      this._limit = options.limit;
      this._fields = options.fields;
      this._uniq = options.uniq;
      this._eagerLoad = options.eagerLoad || {};
      return this._near = options.near;
    },
    get: function(key) {
      return this["_" + key];
    },
    "export": function(result) {
      if (this.returnArray === false) {
        result = result[0];
      }
      delete this.data;
      delete this.returnArray;
      return result;
    },
    addData: function(args) {
      if (args.length && args.length > 1 || _.isArray(args[0])) {
        this.data = _.flatten(args);
        return this.returnArray = true;
      } else {
        this.data = _.flatten([args]);
        return this.returnArray = false;
      }
    },
    addIds: function(args) {
      var id, ids, object, _j, _len1;
      ids = this.ids || (this.ids = []);
      if (args.length) {
        for (_j = 0, _len1 = args.length; _j < _len1; _j++) {
          object = args[_j];
          if (object == null) {
            continue;
          }
          id = object instanceof Tower.Model ? object.get('id') : object;
          if (ids.indexOf(id) === -1) {
            ids.push(id);
          }
        }
      }
      return ids;
    },
    has: function(object) {
      return false;
    },
    compile: function() {},
    explain: function(callback) {},
    clone: function() {
      var clone;
      clone = this.constructor.create();
      clone.make({
        model: this.model,
        instantiate: this.instantiate
      });
      clone.merge(this);
      return clone;
    },
    merge: function(cursor) {
      this._where = this._where.concat(cursor._where);
      this._order = this._order.concat(cursor._order);
      this._offset = cursor._offset;
      this._limit = cursor._limit;
      this._fields = cursor._fields;
      this._except = cursor._except;
      this._includes = cursor._includes;
      this._joins = _.extend({}, cursor._joins);
      this._eagerLoad = _.extend({}, cursor._eagerLoad);
      this._near = cursor._near;
      return this;
    },
    toJSON: function() {
      return {
        where: this._where,
        order: this._order,
        offset: this._offset,
        limit: this._limit,
        fields: this._fields,
        except: this._except,
        includes: this._includes,
        joins: this._joins,
        eagerLoad: this._eagerLoad,
        near: this._near
      };
    },
    _compileAttributes: function(object, conditions) {
      var key, oldValue, value, _results;
      _results = [];
      for (key in conditions) {
        value = conditions[key];
        oldValue = result[key];
        if (oldValue) {
          if (_.isArray(oldValue)) {
            _results.push(object[key] = oldValue.concat(value));
          } else if (typeof oldValue === 'object' && typeof value === 'object') {
            _results.push(object[key] = Tower.Support.Object.deepMergeWithArrays(object[key], value));
          } else {
            _results.push(object[key] = value);
          }
        } else {
          _results.push(object[key] = value);
        }
      }
      return _results;
    },
    conditions: function() {
      var args, conditions, ids, result, _j, _len1, _ref1;
      result = {};
      args = _.args(arguments, 1);
      _ref1 = this._where;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        conditions = _ref1[_j];
        _.deepMergeWithArrays(result, conditions);
      }
      if (this.ids && this.ids.length) {
        delete result.id;
        if (this.ids.length === 1) {
          this.returnArray = false;
        } else {
          this.returnArray = true;
        }
        ids = this.ids;
        if (this.store.constructor.className() === 'Memory') {
          ids = _.map(ids, function(id) {
            return id.toString();
          });
        }
        result.id = {
          $in: ids
        };
      }
      return result;
    },
    attributes: function() {
      var attributes, conditions, key, value, _j, _key, _len1, _ref1, _value;
      attributes = {};
      _ref1 = this._where;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        conditions = _ref1[_j];
        for (key in conditions) {
          value = conditions[key];
          if (Tower.Store.isKeyword(key)) {
            for (_key in value) {
              _value = value[_key];
              attributes[_key] = _value;
            }
          } else if (_.isHash(value) && value.constructor.name === 'Object' && Tower.Store.hasKeyword(value)) {
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
        if (value === void 0) {
          delete attributes[key];
        }
      }
      return attributes;
    },
    _each: function(cursor, iterator, callback) {
      var data,
        _this = this;
      data = !!cursor.data;
      return this.store.find(cursor, function(error, records) {
        if (error) {
          return callback.call(_this, error, records);
        } else {
          return Tower.parallel(records, iterator, function(error) {
            if (!callback) {
              if (error) {
                throw error;
              }
            } else {
              if (callback) {
                return callback.call(_this, error, _this["export"](records));
              }
            }
          });
        }
      });
    },
    _array: function(existing, orNull) {
      if (existing && existing.length) {
        return existing.concat();
      } else {
        if (orNull) {
          return null;
        } else {
          return [];
        }
      }
    }
  };

  Tower.Model.Cursor.include(Tower.Model.Cursor.Finders);

  Tower.Model.Cursor.include(Tower.Model.Cursor.Operations);

  Tower.Model.Cursor.include(Tower.Model.Cursor.Persistence);

  Tower.Model.Cursor.include(Tower.Model.Cursor.Serialization);

  Tower.Model.Data = (function() {

    function Data(record) {
      if (!record) {
        throw new Error('Data must be passed a record');
      }
      this.record = record;
      this.savedData = {};
      this.unsavedData = {};
    }

    __defineProperty(Data,  "get", function(key) {
      var result;
      result = Ember.get(this.unsavedData, key);
      if (result === void 0) {
        result = Ember.get(this.savedData, key);
      }
      return result;
    });

    __defineProperty(Data,  "set", function(key, value) {
      if (Tower.Store.Modifiers.MAP.hasOwnProperty(key)) {
        this[key.replace('$', '')](value);
      } else {
        if (!this.record.get('isNew') && key === 'id') {
          return this.savedData[key] = value;
        }
        if (value === void 0 || this.savedData[key] === value) {
          delete this.unsavedData[key];
        } else {
          this.unsavedData[key] = value;
        }
      }
      this.record.set('isDirty', _.isPresent(this.unsavedData));
      return value;
    });

    __defineProperty(Data,  "setSavedAttributes", function(object) {
      return _.extend(this.savedData, object);
    });

    __defineProperty(Data,  "commit", function() {
      _.extend(this.savedData, this.unsavedData);
      this.record.set('isDirty', false);
      return this.unsavedData = {};
    });

    __defineProperty(Data,  "rollback", function() {
      return this.unsavedData = {};
    });

    __defineProperty(Data,  "attributes", function() {
      return _.extend(this.savedData, this.unsavedData);
    });

    __defineProperty(Data,  "unsavedRelations", function() {
      var key, relations, result, value, _ref1;
      relations = this.record.constructor.relations();
      result = {};
      _ref1 = this.unsavedData;
      for (key in _ref1) {
        value = _ref1[key];
        if (relations.hasOwnProperty(key)) {
          result[key] = value;
        }
      }
      return result;
    });

    __defineProperty(Data,  "push", function(key, value) {
      return _.oneOrMany(this, this._push, key, value);
    });

    __defineProperty(Data,  "pushEach", function(key, value) {
      return _.oneOrMany(this, this._push, key, value, true);
    });

    __defineProperty(Data,  "pull", function(key, value) {
      return _.oneOrMany(this, this._pull, key, value);
    });

    __defineProperty(Data,  "pullEach", function(key, value) {
      return _.oneOrMany(this, this._pull, key, value, true);
    });

    __defineProperty(Data,  "remove", Data.prototype.pull);

    __defineProperty(Data,  "removeEach", Data.prototype.pullEach);

    __defineProperty(Data,  "inc", function(key, value) {
      return _.oneOrMany(this, this._inc, key, value);
    });

    __defineProperty(Data,  "add", function(key, value) {
      return _.oneOrMany(this, this._add, key, value);
    });

    __defineProperty(Data,  "addEach", function(key, value) {
      return _.oneOrMany(this, this._add, key, value, true);
    });

    __defineProperty(Data,  "unset", function() {
      var key, keys, _j, _len1;
      keys = _.flatten(_.args(arguments));
      for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
        key = keys[_j];
        delete this[key];
      }
      return;
    });

    __defineProperty(Data,  "_set", function(key, value) {
      if (Tower.Store.Modifiers.MAP.hasOwnProperty(key)) {
        return this[key.replace('$', '')](value);
      } else {
        if (value === void 0) {
          return delete this.unsavedData[key];
        } else {
          return Ember.setPath(this.unsavedData, key, value);
        }
      }
    });

    __defineProperty(Data,  "_push", function(key, value, array) {
      var currentValue;
      if (array == null) {
        array = false;
      }
      currentValue = this.get(key);
      currentValue || (currentValue = []);
      if (array) {
        currentValue = currentValue.concat(_.castArray(value));
      } else {
        currentValue.push(value);
      }
      return Ember.set(this.unsavedData, key, currentValue);
    });

    __defineProperty(Data,  "_pull", function(key, value, array) {
      var currentValue, item, _j, _len1, _ref1;
      if (array == null) {
        array = false;
      }
      currentValue = this.get(key);
      if (!currentValue) {
        return null;
      }
      if (array) {
        _ref1 = _.castArray(value);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          item = _ref1[_j];
          currentValue.splice(_.toStringIndexOf(currentValue, item), 1);
        }
      } else {
        currentValue.splice(_.toStringIndexOf(currentValue, value), 1);
      }
      return Ember.set(this.unsavedData, key, currentValue);
    });

    __defineProperty(Data,  "_add", function(key, value, array) {
      var currentValue, item, _j, _len1, _ref1;
      if (array == null) {
        array = false;
      }
      currentValue = this.get(key);
      currentValue || (currentValue = []);
      if (array) {
        _ref1 = _.castArray(value);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          item = _ref1[_j];
          if (_.indexOf(currentValue, item) === -1) {
            currentValue.push(item);
          }
        }
      } else {
        if (_.indexOf(currentValue, value) === -1) {
          currentValue.push(value);
        }
      }
      return Ember.set(this.unsavedData, key, currentValue);
    });

    __defineProperty(Data,  "_inc", function(key, value) {
      var currentValue;
      currentValue = this.get(key);
      currentValue || (currentValue = 0);
      currentValue += value;
      return Ember.set(this.unsavedData, key, currentValue);
    });

    __defineProperty(Data,  "_getField", function(key) {
      return this.record.constructor.fields()[key];
    });

    __defineProperty(Data,  "_getRelation", function(key) {
      return this.record.constructor.relations()[key];
    });

    return Data;

  })();

  Tower.Model.Dirty = {
    InstanceMethods: {
      attributeChanged: function(name) {
        return this.get('changes').hasOwnProperty(name);
      },
      attributeChange: function(name) {},
      attributeWas: function(name) {
        return this.get('data').savedData[name];
      },
      resetAttribute: function(name) {
        return this.get('data').set(name, void 0);
      }
    }
  };

  Tower.Model.Indexing = {
    ClassMethods: {
      index: function(name, options) {
        if (options == null) {
          options = {};
        }
        this.store().addIndex(name);
        return this.indexes()[name] = options;
      },
      indexes: function() {
        return this.metadata().indexes;
      }
    }
  };

  Tower.Model.Inheritance = {
    _computeType: function() {}
  };

  Tower.Model.Metadata = {
    ClassMethods: {
      baseClass: function() {
        if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Model) {
          return this.__super__.constructor.baseClass();
        } else {
          return this;
        }
      },
      parentClass: function() {
        if (this.__super__ && this.__super__.constructor.parentClass) {
          return this.__super__.constructor;
        } else {
          return this;
        }
      },
      isSubClass: function() {
        return this.baseClass().className() !== this.className();
      },
      toParam: function() {
        if (this === Tower.Model) {
          return;
        }
        return this.metadata().paramNamePlural;
      },
      toKey: function() {
        return this.metadata().paramName;
      },
      url: function(options) {
        var url;
        return this._url = (function() {
          switch (typeof options) {
            case 'object':
              if (options.parent) {
                return url = "/" + (Tower.Support.String.parameterize(Tower.Support.String.pluralize(options.parent))) + "/:" + (Tower.Support.String.camelize(options.parent, true)) + "/" + (this.toParam());
              }
              break;
            default:
              return options;
          }
        }).call(this);
      },
      _relationship: false,
      relationship: function(value) {
        if (value == null) {
          value = true;
        }
        return this._relationship = value;
      },
      defaults: function(object) {
        var key, value;
        if (object) {
          for (key in object) {
            value = object[key];
            this["default"](key, value);
          }
        }
        return this.metadata().defaults;
      },
      "default": function(key, value) {
        var method;
        if (arguments.length === 1) {
          return this.metadata().defaults[key];
        } else {
          method = "_setDefault" + (Tower.Support.String.camelize(key));
          if (this[method]) {
            return this[method](value);
          } else {
            return this.metadata().defaults[key] = value;
          }
        }
      },
      metadata: function() {
        var baseClassName, callbacks, className, classNamePlural, controllerName, defaults, fields, indexes, metadata, modelName, name, namePlural, namespace, paramName, paramNamePlural, relations, superMetadata, validators;
        className = this.className();
        metadata = this.metadata[className];
        if (metadata) {
          return metadata;
        }
        baseClassName = this.parentClass().className();
        if (baseClassName !== className) {
          superMetadata = this.parentClass().metadata();
        } else {
          superMetadata = {};
        }
        namespace = Tower.namespace();
        name = Tower.Support.String.camelize(className, true);
        namePlural = Tower.Support.String.pluralize(name);
        classNamePlural = Tower.Support.String.pluralize(className);
        paramName = Tower.Support.String.parameterize(name);
        paramNamePlural = Tower.Support.String.parameterize(namePlural);
        modelName = "" + namespace + "." + className;
        controllerName = "" + namespace + "." + classNamePlural + "Controller";
        fields = superMetadata.fields ? _.clone(superMetadata.fields) : {};
        indexes = superMetadata.indexes ? _.clone(superMetadata.indexes) : {};
        validators = superMetadata.validators ? _.clone(superMetadata.validators) : [];
        relations = superMetadata.relations ? _.clone(superMetadata.relations) : {};
        defaults = superMetadata.defaults ? _.clone(superMetadata.defaults) : {};
        callbacks = superMetadata.callbacks ? _.clone(superMetadata.callbacks) : {};
        return this.metadata[className] = {
          name: name,
          namePlural: namePlural,
          className: className,
          classNamePlural: classNamePlural,
          paramName: paramName,
          paramNamePlural: paramNamePlural,
          modelName: modelName,
          controllerName: controllerName,
          indexes: indexes,
          validators: validators,
          fields: fields,
          relations: relations,
          defaults: defaults,
          callbacks: callbacks
        };
      },
      _setDefaultScope: function(scope) {
        return this.metadata().defaults.scope = scope instanceof Tower.Model.Scope ? scope : this.where(scope);
      },
      callbacks: function() {
        return this.metadata().callbacks;
      }
    },
    InstanceMethods: {
      toLabel: function() {
        return this.metadata().className;
      },
      toPath: function() {
        var param, result;
        result = this.constructor.toParam();
        if (result === void 0) {
          return '/';
        }
        param = this.toParam();
        if (param) {
          result += "/" + param;
        }
        return result;
      },
      toParam: function() {
        var id;
        id = this.get('id');
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
      metadata: function() {
        return this.constructor.metadata();
      },
      toString: function() {
        var array, attributes, key, result, value;
        attributes = this.get('data').attributes();
        array = [];
        if (attributes.hasOwnProperty('id')) {
          array.push("id=" + (JSON.stringify(attributes.id)));
          delete attributes.id;
        }
        result = [];
        for (key in attributes) {
          value = attributes[key];
          result.push("" + key + "=" + (JSON.stringify(value)));
        }
        result = array.concat(result.sort()).join(', ');
        return "#<" + (this.constructor.toString()) + ":" + (Ember.guidFor(this)) + " " + result + ">";
      }
    }
  };

  Tower.Model.Relation = (function(_super) {
    var Relation;

    function Relation() {
      return Relation.__super__.constructor.apply(this, arguments);
    }

    Relation = __extends(Relation, _super);

    __defineProperty(Relation,  "init", function(owner, name, options) {
      var key, value;
      if (options == null) {
        options = {};
      }
      this._super();
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.owner = owner;
      this.name = name;
      return this.initialize(options);
    });

    __defineProperty(Relation,  "initialize", function(options) {
      var name, owner;
      owner = this.owner;
      name = this.name;
      this.type = options.type || Tower.Support.String.camelize(Tower.Support.String.singularize(name));
      this.ownerType = Tower.namespaced(owner.className());
      this.dependent || (this.dependent = false);
      this.counterCache || (this.counterCache = false);
      if (!this.hasOwnProperty('idCache')) {
        this.idCache = false;
      }
      if (!this.hasOwnProperty('readonly')) {
        this.readonly = false;
      }
      if (!this.hasOwnProperty('validate')) {
        this.validate = false;
      }
      if (!this.hasOwnProperty('autosave')) {
        this.autosave = false;
      }
      if (!this.hasOwnProperty('touch')) {
        this.touch = false;
      }
      this.inverseOf || (this.inverseOf = void 0);
      this.polymorphic = options.hasOwnProperty('as') || !!options.polymorphic;
      if (!this.hasOwnProperty('default')) {
        this["default"] = false;
      }
      this.singularName = Tower.Support.String.camelize(owner.className(), true);
      this.pluralName = Tower.Support.String.pluralize(owner.className());
      this.singularTargetName = Tower.Support.String.singularize(name);
      this.pluralTargetName = Tower.Support.String.pluralize(name);
      this.targetType = this.type;
      if (!this.foreignKey) {
        if (this.as) {
          this.foreignKey = "" + this.as + "Id";
        } else {
          if (this.className() === 'BelongsTo') {
            this.foreignKey = "" + this.singularTargetName + "Id";
          } else {
            this.foreignKey = "" + this.singularName + "Id";
          }
        }
      }
      if (this.polymorphic) {
        this.foreignType || (this.foreignType = "" + this.as + "Type");
      }
      if (this.idCache) {
        if (typeof this.idCache === 'string') {
          this.idCacheKey = this.idCache;
          this.idCache = true;
        } else {
          this.idCacheKey = "" + this.singularTargetName + "Ids";
        }
        this.owner.field(this.idCacheKey, {
          type: 'Array',
          "default": []
        });
      }
      if (this.counterCache) {
        if (typeof this.counterCache === 'string') {
          this.counterCacheKey = this.counterCache;
          this.counterCache = true;
        } else {
          this.counterCacheKey = "" + this.singularTargetName + "Count";
        }
        this.owner.field(this.counterCacheKey, {
          type: 'Integer',
          "default": 0
        });
      }
      return this._defineRelation(name);
    });

    __defineProperty(Relation,  "_defineRelation", function(name) {
      var object;
      object = {};
      object[name] = Ember.computed(function(key, value) {
        var data;
        if (arguments.length === 2) {
          data = Ember.get(this, 'data');
          return data.set(key, value);
        } else {
          data = Ember.get(this, 'data');
          value = data.get(key);
          value || (value = this.constructor.relation(name).scoped(this));
          return value;
        }
      }).property('data').cacheable();
      return this.owner.reopen(object);
    });

    __defineProperty(Relation,  "scoped", function(record) {
      var cursor;
      cursor = this.constructor.Cursor.create();
      cursor.make({
        model: this.klass(),
        owner: record,
        relation: this
      });
      return new Tower.Model.Scope(cursor);
    });

    __defineProperty(Relation,  "targetKlass", function() {
      return Tower.constant(this.targetType);
    });

    __defineProperty(Relation,  "klass", function() {
      return Tower.constant(this.type);
    });

    __defineProperty(Relation,  "inverse", function(type) {
      var name, relation, relations;
      if (this._inverse) {
        return this._inverse;
      }
      relations = this.targetKlass().relations();
      if (this.inverseOf) {
        return relations[this.inverseOf];
      } else {
        for (name in relations) {
          relation = relations[name];
          if (relation.inverseOf === this.name) {
            return relation;
          }
        }
        for (name in relations) {
          relation = relations[name];
          if (relation.targetType === this.ownerType) {
            return relation;
          }
        }
      }
      return null;
    });

    __defineProperty(Relation,  "_setForeignKey", function() {});

    __defineProperty(Relation,  "_setForeignType", function() {});

    return Relation;

  })(Tower.Class);

  Tower.Model.Relation.Cursor = (function(_super) {
    var Cursor;

    function Cursor() {
      return Cursor.__super__.constructor.apply(this, arguments);
    }

    Cursor = __extends(Cursor, _super);

    __defineProperty(Cursor,  "isConstructable", function() {
      return !!!this.relation.polymorphic;
    });

    __defineProperty(Cursor,  "init", function(options) {
      if (options == null) {
        options = {};
      }
      this._super.apply(this, arguments);
      this.owner = options.owner;
      this.relation = options.relation;
      return this.records = [];
    });

    __defineProperty(Cursor,  "clone", function() {
      var cursor;
      cursor = this.constructor.create();
      cursor.make({
        model: this.model,
        owner: this.owner,
        relation: this.relation,
        records: this.records.concat(),
        instantiate: this.instantiate
      });
      return cursor.merge(this);
    });

    __defineProperty(Cursor,  "setInverseInstance", function(record) {
      var inverse;
      if (record && this.invertibleFor(record)) {
        inverse = record.relation(this.inverseReflectionFor(record).name);
        return inverse.target = owner;
      }
    });

    __defineProperty(Cursor,  "invertibleFor", function(record) {
      return true;
    });

    __defineProperty(Cursor,  "inverse", function(record) {});

    __defineProperty(Cursor,  "_teardown", function() {
      return _.teardown(this, 'relation', 'records', 'owner', 'model', 'criteria');
    });

    return Cursor;

  })(Tower.Model.Cursor);

  _ref1 = ['Before', 'After'];
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    phase = _ref1[_j];
    _ref2 = ['Insert', 'Update', 'Destroy', 'Find'];
    _fn1 = function(phase, action) {
      return Tower.Model.Relation.Cursor.prototype["_run" + phase + action + "CallbacksOnStore"] = function(done) {
        return this.store["run" + phase + action](this, done);
      };
    };
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      action = _ref2[_k];
      _fn1(phase, action);
    }
  }

  Tower.Model.Relation.BelongsTo = (function(_super) {
    var BelongsTo;

    function BelongsTo() {
      return BelongsTo.__super__.constructor.apply(this, arguments);
    }

    BelongsTo = __extends(BelongsTo, _super);

    __defineProperty(BelongsTo,  "init", function(owner, name, options) {
      if (options == null) {
        options = {};
      }
      this._super.apply(this, arguments);
      this.foreignKey = "" + name + "Id";
      owner.field(this.foreignKey, {
        type: "Id"
      });
      if (this.polymorphic) {
        this.foreignType = "" + name + "Type";
        owner.field(this.foreignType, {
          type: 'String'
        });
      }
      return owner.prototype[name] = function() {
        return this.relation(name);
      };
    });

    return BelongsTo;

  })(Tower.Model.Relation);

  Tower.Model.Relation.BelongsTo.Cursor = (function(_super) {
    var Cursor;

    function Cursor() {
      return Cursor.__super__.constructor.apply(this, arguments);
    }

    Cursor = __extends(Cursor, _super);

    __defineProperty(Cursor,  "isBelongsTo", true);

    __defineProperty(Cursor,  "toCursor", function() {
      var cursor, relation;
      cursor = Cursor.__super__[ "toCursor"].apply(this, arguments);
      relation = this.relation;
      cursor.where({
        id: {
          $in: [this.owner.get(relation.foreignKey)]
        }
      });
      return cursor;
    });

    return Cursor;

  })(Tower.Model.Relation.Cursor);

  Tower.Model.Relation.HasMany = (function(_super) {
    var HasMany;

    function HasMany() {
      return HasMany.__super__.constructor.apply(this, arguments);
    }

    HasMany = __extends(HasMany, _super);

    return HasMany;

  })(Tower.Model.Relation);

  Tower.Model.Relation.HasMany.Cursor = (function(_super) {
    var Cursor;

    function Cursor() {
      return Cursor.__super__.constructor.apply(this, arguments);
    }

    Cursor = __extends(Cursor, _super);

    __defineProperty(Cursor,  "isHasMany", true);

    __defineProperty(Cursor,  "init", function() {
      return this._super.apply(this, arguments);
    });

    __defineProperty(Cursor,  "has", function(object) {
      var records;
      object = _.castArray(object);
      records = [];
      if (!records.length) {
        return false;
      }
      return false;
    });

    __defineProperty(Cursor,  "validate", function(callback) {
      if (this.owner.get('isNew')) {
        throw new Error('You cannot call insert unless the parent is saved');
      }
      return callback.call(this);
    });

    __defineProperty(Cursor,  "build", function(callback) {
      this.compileForInsert();
      return this._build(callback);
    });

    __defineProperty(Cursor,  "insert", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.insertReferenced(callback);
      });
    });

    __defineProperty(Cursor,  "update", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.updateReferenced(callback);
      });
    });

    __defineProperty(Cursor,  "destroy", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.destroyReferenced(callback);
      });
    });

    __defineProperty(Cursor,  "find", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        return _this.findReferenced(callback);
      });
    });

    __defineProperty(Cursor,  "count", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        _this.compileForFind();
        return _this._runBeforeFindCallbacksOnStore(function() {
          return _this._count(function(error, record) {
            if (!error) {
              return _this._runAfterFindCallbacksOnStore(function() {
                if (callback) {
                  return callback.call(_this, error, record);
                }
              });
            } else {
              if (callback) {
                return callback.call(_this, error, record);
              }
            }
          });
        });
      });
    });

    __defineProperty(Cursor,  "exists", function(callback) {
      var _this = this;
      return this.validate(function(error) {
        _this.compileForFind();
        return _this._runBeforeFindCallbacksOnStore(function() {
          return _this._exists(function(error, record) {
            if (!error) {
              return _this._runAfterFindCallbacksOnStore(function() {
                if (callback) {
                  return callback.call(_this, error, record);
                }
              });
            } else {
              if (callback) {
                return callback.call(_this, error, record);
              }
            }
          });
        });
      });
    });

    __defineProperty(Cursor,  "insertReferenced", function(callback) {
      var _this = this;
      this.compileForInsert();
      return this._runBeforeInsertCallbacksOnStore(function() {
        return _this._insert(function(error, record) {
          if (!error) {
            return _this._runAfterInsertCallbacksOnStore(function() {
              if (_this.updateOwnerRecord()) {
                return _this.owner.updateAttributes(_this.ownerAttributes(record), function(error) {
                  if (callback) {
                    return callback.call(_this, error, record);
                  }
                });
              } else {
                if (callback) {
                  return callback.call(_this, error, record);
                }
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Cursor,  "updateReferenced", function(callback) {
      var _this = this;
      this.compileForUpdate();
      return this._runBeforeUpdateCallbacksOnStore(function() {
        return _this._update(function(error, record) {
          if (!error) {
            return _this._runAfterUpdateCallbacksOnStore(function() {
              if (callback) {
                return callback.call(_this, error, record);
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Cursor,  "destroyReferenced", function(callback) {
      var _this = this;
      this.compileForDestroy();
      return this._runBeforeDestroyCallbacksOnStore(function() {
        return _this._destroy(function(error, record) {
          if (!error) {
            return _this._runAfterDestroyCallbacksOnStore(function() {
              if (_this.updateOwnerRecord()) {
                return _this.owner.updateAttributes(_this.ownerAttributesForDestroy(record), function(error) {
                  if (callback) {
                    return callback.call(_this, error, record);
                  }
                });
              } else {
                if (callback) {
                  return callback.call(_this, error, record);
                }
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Cursor,  "findReferenced", function(callback) {
      var _this = this;
      this.compileForFind();
      return this._runBeforeFindCallbacksOnStore(function() {
        return _this._find(function(error, record) {
          if (!error) {
            return _this._runAfterFindCallbacksOnStore(function() {
              if (callback) {
                return callback.call(_this, error, record);
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Cursor,  "add", function(callback) {
      var _this = this;
      if (!this.relation.idCache) {
        throw new Error;
      }
      return this.owner.updateAttributes(this.ownerAttributes(), function(error) {
        if (callback) {
          return callback.call(_this, error, _this.data);
        }
      });
    });

    __defineProperty(Cursor,  "remove", function(callback) {
      var _this = this;
      if (!this.relation.idCache) {
        throw new Error;
      }
      return this.owner.updateAttributes(this.ownerAttributesForDestroy(), function(error) {
        if (callback) {
          return callback.call(_this, error, _this.data);
        }
      });
    });

    __defineProperty(Cursor,  "compile", function() {
      var array, data, id, inverseRelation, owner, relation, _name;
      owner = this.owner;
      relation = this.relation;
      inverseRelation = relation.inverse();
      id = owner.get('id');
      data = {};
      if (inverseRelation && inverseRelation.idCache) {
        array = data[inverseRelation.idCacheKey] || [];
        if (array.indexOf(id) === -1) {
          array.push(id);
        }
        data[inverseRelation.idCacheKey] = array;
      } else if (relation.foreignKey && !relation.idCache) {
        if (id !== void 0) {
          data[relation.foreignKey] = id;
        }
        if (relation.foreignType) {
          data[_name = relation.foreignType] || (data[_name] = owner.constructor.className());
        }
      }
      if (inverseRelation && inverseRelation.counterCacheKey) {
        data[inverseRelation.counterCacheKey] = 1;
      }
      return this.where(data);
    });

    __defineProperty(Cursor,  "compileForInsert", function() {
      return this.compile();
    });

    __defineProperty(Cursor,  "compileForUpdate", function() {
      this.compileForFind();
      if (!(this.ids && this.ids.length)) {
        return this.returnArray = true;
      }
    });

    __defineProperty(Cursor,  "compileForDestroy", function() {
      return this.compileForFind();
    });

    __defineProperty(Cursor,  "compileForFind", function() {
      var relation;
      this.compile();
      relation = this.relation;
      if (relation.idCache) {
        return this.where({
          id: {
            $in: this.owner.get(relation.idCacheKey)
          }
        });
      }
    });

    __defineProperty(Cursor,  "updateOwnerRecord", function() {
      var relation;
      relation = this.relation;
      return !!(relation && (relation.idCache || relation.counterCache));
    });

    __defineProperty(Cursor,  "ownerAttributes", function(record) {
      var data, inc, push, relation, updates;
      relation = this.relation;
      if (relation.idCache) {
        push = {};
        data = record ? record.get('id') : this.store._mapKeys('id', this.data);
        push[relation.idCacheKey] = data;
      }
      if (relation.counterCacheKey) {
        inc = {};
        inc[relation.counterCacheKey] = 1;
      }
      updates = {};
      if (push) {
        if (_.isArray(push)) {
          updates['$addEach'] = push;
        } else {
          updates['$add'] = push;
        }
      }
      if (inc) {
        updates['$inc'] = inc;
      }
      return updates;
    });

    __defineProperty(Cursor,  "ownerAttributesForDestroy", function(record) {
      var inc, pull, relation, updates;
      relation = this.relation;
      if (relation.idCache) {
        pull = {};
        pull[relation.idCacheKey] = this.ids && this.ids.length ? this.ids : this.owner.get(relation.idCacheKey);
      }
      if (relation.counterCacheKey) {
        inc = {};
        inc[relation.counterCacheKey] = -1;
      }
      updates = {};
      if (pull) {
        updates['$pullEach'] = pull;
      }
      if (inc) {
        updates['$inc'] = inc;
      }
      return updates;
    });

    __defineProperty(Cursor,  "_idCacheRecords", function(records) {
      var rootRelation;
      rootRelation = this.owner.relation(this.relation.name);
      return rootRelation.cursor.records = rootRelation.cursor.records.concat(_.castArray(records));
    });

    return Cursor;

  })(Tower.Model.Relation.Cursor);

  Tower.Model.Relation.HasManyThrough = (function(_super) {
    var HasManyThrough;

    function HasManyThrough() {
      return HasManyThrough.__super__.constructor.apply(this, arguments);
    }

    HasManyThrough = __extends(HasManyThrough, _super);

    __defineProperty(HasManyThrough,  "init", function(options) {
      var throughRelation;
      this._super.apply(this, arguments);
      if (this.through && !options.type) {
        this.throughRelation = throughRelation = this.owner.relation(this.through);
        return options.type || (options.type = throughRelation.targetType);
      }
    });

    __defineProperty(HasManyThrough,  "inverseThrough", function(relation) {
      var name, relations, type;
      relations = relation.targetKlass().relations();
      if (relation.inverseOf) {
        return relations[relation.inverseOf];
      } else {
        name = this.name;
        type = this.type;
        for (name in relations) {
          relation = relations[name];
          if (relation.inverseOf === name) {
            return relation;
          }
        }
        for (name in relations) {
          relation = relations[name];
          if (relation.targetType === type) {
            return relation;
          }
        }
      }
    });

    return HasManyThrough;

  })(Tower.Model.Relation.HasMany);

  Tower.Model.Relation.HasManyThrough.Cursor = (function(_super) {
    var Cursor;

    function Cursor() {
      return Cursor.__super__.constructor.apply(this, arguments);
    }

    Cursor = __extends(Cursor, _super);

    __defineProperty(Cursor,  "isHasManyThrough", true);

    __defineProperty(Cursor,  "make", function(options) {
      if (options == null) {
        options = {};
      }
      this._super.apply(this, arguments);
      if (this.relation.through) {
        this.throughRelation = this.owner.constructor.relation(this.relation.through);
        return this.inverseRelation = this.relation.inverseThrough(this.throughRelation);
      }
    });

    __defineProperty(Cursor,  "compile", function() {
      return this;
    });

    __defineProperty(Cursor,  "insert", function(callback) {
      var _this = this;
      return this._runBeforeInsertCallbacksOnStore(function() {
        return _this._insert(function(error, record) {
          if (!error) {
            return _this._runAfterInsertCallbacksOnStore(function() {
              return _this.insertThroughRelation(record, function(error, throughRecord) {
                if (callback) {
                  return callback.call(_this, error, record);
                }
              });
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Cursor,  "add", function(callback) {
      var _this = this;
      return this._build(function(error, record) {
        if (!error) {
          return _this.insertThroughRelation(record, function(error, throughRecord) {
            if (callback) {
              return callback.call(_this, error, record);
            }
          });
        } else {
          if (callback) {
            return callback.call(_this, error, record);
          }
        }
      });
    });

    __defineProperty(Cursor,  "remove", function(callback) {
      var _this = this;
      if (!this.relation.idCache) {
        throw new Error;
      }
      return this.owner.updateAttributes(this.ownerAttributesForDestroy(), function(error) {
        if (callback) {
          return callback.call(_this, error, _this.data);
        }
      });
    });

    __defineProperty(Cursor,  "count", function(callback) {
      var _this = this;
      return this._runBeforeFindCallbacksOnStore(function() {
        return _this._count(function(error, record) {
          if (!error) {
            return _this._runAfterFindCallbacksOnStore(function() {
              if (callback) {
                return callback.call(_this, error, record);
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Cursor,  "exists", function(callback) {
      var _this = this;
      return this._runBeforeFindCallbacksOnStore(function() {
        return _this._exists(function(error, record) {
          if (!error) {
            return _this._runAfterFindCallbacksOnStore(function() {
              if (callback) {
                return callback.call(_this, error, record);
              }
            });
          } else {
            if (callback) {
              return callback.call(_this, error, record);
            }
          }
        });
      });
    });

    __defineProperty(Cursor,  "appendThroughConditions", function(callback) {
      var _this = this;
      return this.owner.get(this.relation.through).all(function(error, records) {
        var ids;
        ids = _this.store._mapKeys(_this.inverseRelation.foreignKey, records);
        _this.where({
          'id': {
            $in: ids
          }
        });
        return callback();
      });
    });

    __defineProperty(Cursor,  "insertThroughRelation", function(records, callback) {
      var attributes, data, record, returnArray, _l, _len3,
        _this = this;
      returnArray = _.isArray(records);
      records = _.castArray(records);
      data = [];
      key = this.inverseRelation.foreignKey;
      for (_l = 0, _len3 = records.length; _l < _len3; _l++) {
        record = records[_l];
        attributes = {};
        attributes[key] = record.get('id');
        data.push(attributes);
      }
      return this.owner.get(this.relation.through).insert(data, function(error, throughRecords) {
        if (!returnArray) {
          throughRecords = throughRecords[0];
        }
        if (callback) {
          return callback.call(_this, error, throughRecords);
        }
      });
    });

    return Cursor;

  })(Tower.Model.Relation.HasMany.Cursor);

  Tower.Model.Relation.HasOne = (function(_super) {
    var HasOne;

    function HasOne() {
      return HasOne.__super__.constructor.apply(this, arguments);
    }

    HasOne = __extends(HasOne, _super);

    return HasOne;

  })(Tower.Model.Relation);

  Tower.Model.Relation.HasOne.Cursor = (function(_super) {
    var Cursor;

    function Cursor() {
      return Cursor.__super__.constructor.apply(this, arguments);
    }

    Cursor = __extends(Cursor, _super);

    __defineProperty(Cursor,  "isHasOne", true);

    return Cursor;

  })(Tower.Model.Relation.Cursor);

  Tower.Model.Relations = {
    ClassMethods: {
      hasOne: function(name, options) {
        if (options == null) {
          options = {};
        }
        return this.relations()[name] = new Tower.Model.Relation.HasOne(this, name, options);
      },
      hasMany: function(name, options) {
        if (options == null) {
          options = {};
        }
        if (options.hasOwnProperty('through')) {
          return this.relations()[name] = new Tower.Model.Relation.HasManyThrough(this, name, options);
        } else {
          return this.relations()[name] = new Tower.Model.Relation.HasMany(this, name, options);
        }
      },
      belongsTo: function(name, options) {
        return this.relations()[name] = new Tower.Model.Relation.BelongsTo(this, name, options);
      },
      relations: function() {
        return this.metadata().relations;
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
    InstanceMethods: {
      getRelation: function(key) {
        return this.get(key);
      },
      relation: function(name) {
        var _base;
        return (_base = this.relations)[name] || (_base[name] = this.constructor.relation(name).scoped(this));
      },
      destroyRelations: function(callback) {
        var dependents, iterator, name, relation, relations,
          _this = this;
        relations = this.constructor.relations();
        dependents = [];
        for (name in relations) {
          relation = relations[name];
          if (relation.dependent === true || relation.dependent === 'destroy') {
            dependents.push(name);
          }
        }
        iterator = function(name, next) {
          return _this.get(name).destroy(next);
        };
        return Tower.async(dependents, iterator, callback);
      }
    }
  };

  Tower.Model.Attribute = (function() {

    function Attribute(owner, name, options, block) {
      var type;
      if (options == null) {
        options = {};
      }
      this.owner = owner;
      this.name = key = name;
      if (typeof options === 'string') {
        options = {
          type: options
        };
      } else if (typeof options === 'function') {
        block = options;
        options = {};
      }
      this.type = type = options.type || 'String';
      if (typeof type !== 'string') {
        this.itemType = type[0];
        this.type = type = 'Array';
      }
      this.encodingType = (function() {
        switch (type) {
          case 'Id':
          case 'Date':
          case 'Array':
          case 'String':
          case 'Integer':
          case 'Float':
          case 'BigDecimal':
          case 'Time':
          case 'DateTime':
          case 'Boolean':
          case 'Object':
          case 'Number':
          case 'Geo':
            return type;
          default:
            return 'Model';
        }
      })();
      this._setDefault(options);
      this._defineAccessors(options);
      this._defineAttribute(options);
      this._addValidations(options);
      this._addIndex(options);
    }

    __defineProperty(Attribute,  "_setDefault", function(options) {
      this._default = options["default"];
      if (!this._default) {
        if (this.type === 'Geo') {
          return this._default = {
            lat: null,
            lng: null
          };
        } else if (this.type === 'Array') {
          return this._default = [];
        }
      }
    });

    __defineProperty(Attribute,  "_defineAccessors", function(options) {
      var name, serializer, type;
      name = this.name;
      type = this.type;
      serializer = Tower.Store.Serializer[type];
      this.get = options.get || (serializer ? serializer.from : void 0);
      this.set = options.set || (serializer ? serializer.to : void 0);
      if (this.get === true) {
        this.get = "get" + (Tower.Support.String.camelize(name));
      }
      if (this.set === true) {
        return this.set = "set" + (Tower.Support.String.camelize(name));
      }
    });

    __defineProperty(Attribute,  "_defineAttribute", function(options) {
      var attribute, field, name;
      name = this.name;
      attribute = {};
      field = this;
      attribute[name] = Ember.computed(function(key, value) {
        var data;
        if (arguments.length === 2) {
          data = Ember.get(this, 'data');
          return data.set(key, field.encode(value, this));
        } else {
          data = Ember.get(this, 'data');
          value = data.get(key);
          if (value === void 0) {
            value = field.defaultValue(this);
          }
          return field.decode(value, this);
        }
      }).property('data').cacheable();
      return this.owner.reopen(attribute);
    });

    __defineProperty(Attribute,  "_addValidations", function(options) {
      var key, normalizedKey, validations, _ref3;
      validations = {};
      _ref3 = Tower.Model.Validator.keys;
      for (key in _ref3) {
        normalizedKey = _ref3[key];
        if (options.hasOwnProperty(key)) {
          validations[normalizedKey] = options[key];
        }
      }
      if (_.isPresent(validations)) {
        return this.owner.validates(this.name, validations);
      }
    });

    __defineProperty(Attribute,  "_addIndex", function(options) {
      var index, name, type;
      type = this.type;
      name = this.name;
      if (type === 'Geo' && !options.index) {
        index = {};
        index[name] = '2d';
        options.index = index;
      }
      if (options.index) {
        if (options.index === true) {
          return this.owner.index(this.name);
        } else {
          return this.owner.index(options.index);
        }
      }
    });

    __defineProperty(Attribute,  "validators", function() {
      var result, validator, _l, _len3, _ref3;
      result = [];
      _ref3 = this.owner.validators();
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        validator = _ref3[_l];
        if (validator.attributes.indexOf(this.name) !== -1) {
          result.push(validator);
        }
      }
      return result;
    });

    __defineProperty(Attribute,  "defaultValue", function(record) {
      var _default;
      _default = this._default;
      if (_.isArray(_default)) {
        return _default.concat();
      } else if (_.isHash(_default)) {
        return _.extend({}, _default);
      } else if (typeof _default === 'function') {
        return _default.call(record);
      } else {
        return _default;
      }
    });

    __defineProperty(Attribute,  "encode", function(value, binding) {
      return this.code(this.set, value, binding);
    });

    __defineProperty(Attribute,  "decode", function(value, binding) {
      return this.code(this.get, value, binding);
    });

    __defineProperty(Attribute,  "code", function(type, value, binding) {
      switch (typeof type) {
        case 'string':
          return binding[type].call(binding[type], value);
        case 'function':
          return type.call(binding, value);
        default:
          return value;
      }
    });

    return Attribute;

  })();

  Tower.Model.Attributes = {
    Serialization: {},
    ClassMethods: {
      dynamicFields: true,
      destructiveFields: ['id', 'push', 'isValid', 'data', 'changes', 'getAttribute', 'setAttribute', 'unknownProperty', 'setUnknownProperty'],
      field: function(name, options) {
        return this.fields()[name] = new Tower.Model.Attribute(this, name, options);
      },
      fields: function() {
        var fields, name, names, options, _l, _len3, _ref3;
        fields = this.metadata().fields;
        switch (arguments.length) {
          case 0:
            fields;

            break;
          case 1:
            _ref3 = arguments[0];
            for (name in _ref3) {
              options = _ref3[name];
              this.field(name, options);
            }
            break;
          default:
            names = _.args(arguments);
            options = _.extractOptions(names);
            for (_l = 0, _len3 = names.length; _l < _len3; _l++) {
              name = names[_l];
              this.field(name, options);
            }
        }
        return fields;
      }
    },
    InstanceMethods: {
      dynamicFields: true,
      data: Ember.computed(function() {
        return new Tower.Model.Data(this);
      }).cacheable(),
      changes: Ember.computed(function() {
        return Ember.get(this.get('data'), 'unsavedData');
      }),
      setSavedAttributes: function(object) {
        return this.get('data').setSavedAttributes(object);
      },
      unknownProperty: function(key) {
        if (this.get('dynamicFields')) {
          return this.get('data').get(key);
        }
      },
      setUnknownProperty: function(key, value) {
        if (this.get('dynamicFields')) {
          return this.get('data').set(key, value);
        }
      }
    }
  };

  _ref3 = Tower.Store.Modifiers.SET;
  _fn2 = function(method) {
    return Tower.Model.Attributes.InstanceMethods[method] = function() {
      var _ref4;
      return (_ref4 = Ember.get(this, 'data'))[method].apply(_ref4, arguments);
    };
  };
  for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
    method = _ref3[_l];
    _fn2(method);
  }

  Tower.Model.Persistence = {
    ClassMethods: {
      "new": Ember.Object.create,
      build: Ember.Object.create,
      store: function(value) {
        var defaultStore, metadata, store, type;
        metadata = this.metadata();
        store = metadata.store;
        if (arguments.length === 0 && store) {
          return store;
        }
        defaultStore = this["default"]('store') || Tower.Store.Memory;
        type = typeof value;
        if (type === 'function') {
          store = new value({
            name: metadata.namePlural,
            type: Tower.namespaced(metadata.className)
          });
        } else if (type === 'object') {
          store || (store = new defaultStore({
            name: metadata.namePlural,
            type: Tower.namespaced(metadata.className)
          }));
          _.extend(store, value);
        } else if (value) {
          store = value;
        }
        store || (store = new defaultStore({
          name: metadata.namePlural,
          type: Tower.namespaced(metadata.className)
        }));
        return metadata.store = store;
      },
      load: function(records) {
        return this.store().load(records);
      }
    },
    InstanceMethods: {
      store: Ember.computed(function() {
        return this.constructor.store();
      }),
      save: function(options, callback) {
        var _this = this;
        this.set('isSaving', true);
        this.get('transaction').adopt(this);
        if (this.readOnly) {
          throw new Error('Record is read only');
        }
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options || (options = {});
        if (options.validate !== false) {
          return this.validate(function(error) {
            if (error) {
              _this.set('isValid', false);
              if (callback) {
                return callback.call(_this, null);
              }
            } else {
              _this.set('isValid', true);
              return _this._save(callback);
            }
          });
        } else {
          return this._save(callback);
        }
      },
      updateAttributes: function(attributes, callback) {
        this.setProperties(attributes);
        return this.save(callback);
      },
      destroy: function(callback) {
        if (this.get('isNew')) {
          callback.call(this, callback ? null : void 0);
        } else {
          this._destroy(callback);
        }
        return this;
      },
      reload: function() {},
      _save: function(callback) {
        var _this = this;
        this.runCallbacks('save', function(block) {
          var complete;
          complete = Tower.callbackChain(block, callback);
          if (_this.get('isNew')) {
            return _this._create(complete);
          } else {
            return _this._update(complete);
          }
        });
        return;
      },
      _create: function(callback) {
        var _this = this;
        this.runCallbacks('create', function(block) {
          var complete;
          complete = Tower.callbackChain(block, callback);
          return _this.constructor.scoped({
            instantiate: false
          }).insert(_this, function(error) {
            if (error && !callback) {
              throw error;
            }
            _this.set('isSaving', false);
            if (!error) {
              _this.set('isNew', false);
              _this.get('data').commit();
            }
            return complete.call(_this, error);
          });
        });
        return;
      },
      _update: function(callback) {
        var _this = this;
        this.runCallbacks('update', function(block) {
          var complete;
          complete = Tower.callbackChain(block, callback);
          return _this.constructor.scoped({
            instantiate: false
          }).update(_this.get('id'), _this, function(error) {
            if (error && !callback) {
              throw error;
            }
            _this.set('isSaving', false);
            if (!error) {
              _this.set('isNew', false);
              _this.get('data').commit();
            }
            return complete.call(_this, error);
          });
        });
        return;
      },
      _destroy: function(callback) {
        var _this = this;
        this.runCallbacks('destroy', function(block) {
          var complete;
          complete = Tower.callbackChain(block, callback);
          return _this.constructor.scoped({
            instantiate: false
          }).destroy(_this, function(error) {
            if (error && !callback) {
              throw error;
            }
            if (!error) {
              return _this.destroyRelations(function(error) {
                _this.set('isNew', false);
                _this.set('isDeleted', true);
                _this.set('id', void 0);
                return complete.call(_this, error);
              });
            } else {
              return complete.call(_this, error);
            }
          });
        });
        return;
      }
    }
  };

  Tower.Model.Scopes = {
    ClassMethods: {
      scope: function(name, scope) {
        scope = scope instanceof Tower.Model.Scope ? scope : this.where(scope);
        return this[name] = function() {
          return this.scoped().where(scope.cursor);
        };
      },
      scoped: function(options) {
        var cursor, defaultScope;
        cursor = this.cursor(options);
        defaultScope = this.defaults().scope;
        if (defaultScope) {
          return defaultScope.where(cursor);
        } else {
          return new Tower.Model.Scope(cursor);
        }
      },
      cursor: function(options) {
        var cursor;
        if (options == null) {
          options = {};
        }
        options.model = this;
        cursor = Tower.Model.Cursor.create();
        cursor.make(options);
        if (this.baseClass().className() !== this.className()) {
          cursor.where({
            type: this.className()
          });
        }
        return cursor;
      }
    }
  };

  _ref4 = Tower.Model.Scope.queryMethods;
  _fn3 = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref5;
      return (_ref5 = this.scoped())[key].apply(_ref5, arguments);
    };
  };
  for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
    key = _ref4[_m];
    _fn3(key);
  }

  _ref5 = Tower.Model.Scope.finderMethods;
  _fn4 = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref6;
      return (_ref6 = this.scoped())[key].apply(_ref6, arguments);
    };
  };
  for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
    key = _ref5[_n];
    _fn4(key);
  }

  _ref6 = Tower.Model.Scope.persistenceMethods;
  _fn5 = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref7;
      return (_ref7 = this.scoped())[key].apply(_ref7, arguments);
    };
  };
  for (_o = 0, _len6 = _ref6.length; _o < _len6; _o++) {
    key = _ref6[_o];
    _fn5(key);
  }

  Tower.Model.Serialization = {
    ClassMethods: {
      fromJSON: function(data) {
        var i, record, records, _len7, _p;
        records = JSON.parse(data);
        if (!(records instanceof Array)) {
          records = [records];
        }
        for (i = _p = 0, _len7 = records.length; _p < _len7; i = ++_p) {
          record = records[i];
          records[i] = new this(record);
        }
        return records;
      },
      toJSON: function(records, options) {
        var record, result, _len7, _p;
        if (options == null) {
          options = {};
        }
        result = [];
        for (_p = 0, _len7 = records.length; _p < _len7; _p++) {
          record = records[_p];
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
      var attributeNames, except, i, include, includes, methodNames, methods, name, only, opts, record, records, result, tmp, _len10, _len7, _len8, _len9, _p, _q, _r, _s;
      if (options == null) {
        options = {};
      }
      result = {};
      attributeNames = _.keys(this.constructor.fields());
      if (only = options.only) {
        attributeNames = _.union(_.toArray(only), attributeNames);
      } else if (except = options.except) {
        attributeNames = _.difference(_.toArray(except), attributeNames);
      }
      for (_p = 0, _len7 = attributeNames.length; _p < _len7; _p++) {
        name = attributeNames[_p];
        result[name] = this._readAttributeForSerialization(name);
      }
      if (methods = options.methods) {
        methodNames = _.toArray(methods);
        for (_q = 0, _len8 = methods.length; _q < _len8; _q++) {
          name = methods[_q];
          result[name] = this[name]();
        }
      }
      if (includes = options.include) {
        includes = _.toArray(includes);
        for (_r = 0, _len9 = includes.length; _r < _len9; _r++) {
          include = includes[_r];
          if (!_.isHash(include)) {
            tmp = {};
            tmp[include] = {};
            include = tmp;
            tmp = void 0;
          }
          for (name in include) {
            opts = include[name];
            records = this[name]().all();
            for (i = _s = 0, _len10 = records.length; _s < _len10; i = ++_s) {
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
      if (type == null) {
        type = 'json';
      }
      return this.get(name);
    }
  };

  Tower.Model.States = {
    isLoaded: false,
    isDirty: false,
    isSaving: false,
    isDeleted: false,
    isError: false,
    isNew: true,
    isValid: true
  };

  Tower.Model.Validator = (function() {

    __defineStaticProperty(Validator,  "keys", {
      presence: 'presence',
      required: 'required',
      count: 'length',
      length: 'length',
      min: 'min',
      max: 'max',
      gte: 'gte',
      '>=': 'gte',
      gt: 'gt',
      '>': 'gt',
      lte: 'lte',
      '<=': 'lte',
      lt: 'lt',
      '<': 'lt',
      format: 'format',
      unique: 'uniqueness',
      uniqueness: 'uniqueness',
      "in": 'in',
      notIn: 'notIn',
      except: 'except',
      only: 'only',
      accepts: 'accepts'
    });

    __defineStaticProperty(Validator,  "createAll", function(attributes, validations) {
      var key, options, validatorOptions, validators, value;
      if (validations == null) {
        validations = {};
      }
      options = _.moveProperties({}, validations, 'on', 'if', 'unless', 'allow');
      validators = [];
      for (key in validations) {
        value = validations[key];
        validatorOptions = _.clone(options);
        if (_.isHash(value)) {
          validatorOptions = _.moveProperties(validatorOptions, value, 'on', 'if', 'unless', 'allow');
        }
        validators.push(Tower.Model.Validator.create(key, value, attributes, validatorOptions));
      }
      return validators;
    });

    __defineStaticProperty(Validator,  "create", function(name, value, attributes, options) {
      var key, _results;
      if (typeof name === 'object') {
        attributes = value;
        _results = [];
        for (key in name) {
          value = name[key];
          _results.push(this._create(key, value, attributes, options));
        }
        return _results;
      } else {
        return this._create(name, value, attributes, options);
      }
    });

    __defineStaticProperty(Validator,  "_create", function(name, value, attributes, options) {
      switch (name) {
        case 'presence':
        case 'required':
          return new this.Presence(name, value, attributes, options);
        case 'count':
        case 'length':
        case 'min':
        case 'max':
        case 'gte':
        case 'gt':
        case 'lte':
        case 'lt':
          return new this.Length(name, value, attributes, options);
        case 'format':
          return new this.Format(name, value, attributes, options);
        case 'in':
        case 'except':
        case 'only':
        case 'notIn':
        case 'values':
        case 'accepts':
          return new this.Set(name, value, attributes, options);
        case 'uniqueness':
        case 'unique':
          return new this.Uniqueness(name, value, attributes, options);
      }
    });

    function Validator(name, value, attributes, options) {
      if (options == null) {
        options = {};
      }
      this.name = name;
      this.value = value;
      this.attributes = _.castArray(attributes);
      this.options = options;
    }

    __defineProperty(Validator,  "validateEach", function(record, errors, callback) {
      var success,
        _this = this;
      success = void 0;
      this.check(record, function(error, result) {
        var iterator;
        success = result;
        if (success) {
          iterator = function(attribute, next) {
            return _this.validate(record, attribute, errors, function(error) {
              return next();
            });
          };
          return Tower.parallel(_this.attributes, iterator, function(error) {
            success = !error;
            if (callback) {
              return callback.call(_this, error);
            }
          });
        } else {
          if (callback) {
            return callback.call(_this, error);
          }
        }
      });
      return success;
    });

    __defineProperty(Validator,  "check", function(record, callback) {
      var options,
        _this = this;
      options = this.options;
      if (options["if"]) {
        return this._callMethod(record, options["if"], function(error, result) {
          return callback.call(_this, error, !!result);
        });
      } else if (options.unless) {
        return this._callMethod(record, options.unless, function(error, result) {
          return callback.call(_this, error, !!!result);
        });
      } else {
        return callback.call(this, null, true);
      }
    });

    __defineProperty(Validator,  "success", function(callback) {
      if (callback) {
        callback.call(this);
      }
      return true;
    });

    __defineProperty(Validator,  "failure", function(record, attribute, errors, message, callback) {
      errors[attribute] || (errors[attribute] = []);
      errors[attribute].push(message);
      if (callback) {
        callback.call(this, message);
      }
      return false;
    });

    __defineProperty(Validator,  "getValue", function(binding) {
      if (typeof this.value === 'function') {
        return this.value.call(binding);
      } else {
        return this.value;
      }
    });

    __defineProperty(Validator,  "_callMethod", function(binding, method, callback) {
      var _this = this;
      if (typeof method === 'string') {
        method = binding[method];
      }
      switch (method.length) {
        case 0:
          callback.call(this, null, method.call(binding));
          break;
        default:
          method.call(binding, function(error, result) {
            return callback.call(_this, error, result);
          });
      }
      return;
    });

    return Validator;

  })();

  Tower.Model.Validator.Format = (function(_super) {
    var Format;

    Format = __extends(Format, _super);

    function Format(name, value, attributes, options) {
      Format.__super__.constructor.call(this, name, value, attributes, options);
      if (this.value.hasOwnProperty('value')) {
        this.value = this.value.value;
      }
      if (typeof this.value === 'string') {
        this.matcher = "is" + (_.camelCase(value, true));
      }
    }

    __defineProperty(Format,  "validate", function(record, attribute, errors, callback) {
      var success, value;
      value = record.get(attribute);
      success = this.matcher ? !!_[this.matcher](value) : !!this.value.exec(value);
      if (!success) {
        return this.failure(record, attribute, errors, Tower.t('model.errors.format', {
          attribute: attribute,
          value: this.value.toString()
        }), callback);
      } else {
        return this.success(callback);
      }
    });

    return Format;

  })(Tower.Model.Validator);

  Tower.Model.Validator.Length = (function(_super) {
    var Length;

    Length = __extends(Length, _super);

    function Length(name, value, attributes, options) {
      Length.__super__.constructor.apply(this, arguments);
      this.validate = (function() {
        switch (name) {
          case 'min':
            return this.validateMinimum;
          case 'max':
            return this.validateMaximum;
          case 'gte':
            return this.validateGreaterThanOrEqual;
          case 'gt':
            return this.validateGreaterThan;
          case 'lte':
            return this.validateLessThanOrEqual;
          case 'lt':
            return this.validateLessThan;
          default:
            return this.validateLength;
        }
      }).call(this);
    }

    __defineProperty(Length,  "validateGreaterThanOrEqual", function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value >= this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    });

    __defineProperty(Length,  "validateGreaterThan", function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value > this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    });

    __defineProperty(Length,  "validateLessThanOrEqual", function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value <= this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    });

    __defineProperty(Length,  "validateLessThan", function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value < this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    });

    __defineProperty(Length,  "validateMinimum", function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(typeof value === 'number' && value >= this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t('model.errors.minimum', {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    });

    __defineProperty(Length,  "validateMaximum", function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(typeof value === 'number' && value <= this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t('model.errors.maximum', {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    });

    __defineProperty(Length,  "validateLength", function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(typeof value === 'number' && value === this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t('model.errors.length', {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    });

    return Length;

  })(Tower.Model.Validator);

  Tower.Model.Validator.Presence = (function(_super) {
    var Presence;

    function Presence() {
      return Presence.__super__.constructor.apply(this, arguments);
    }

    Presence = __extends(Presence, _super);

    __defineProperty(Presence,  "validate", function(record, attribute, errors, callback) {
      if (!_.isPresent(record.get(attribute))) {
        return this.failure(record, attribute, errors, Tower.t('model.errors.presence', {
          attribute: attribute
        }), callback);
      }
      return this.success(callback);
    });

    return Presence;

  })(Tower.Model.Validator);

  Tower.Model.Validator.Set = (function(_super) {
    var Set;

    Set = __extends(Set, _super);

    function Set(name, value, attributes, options) {
      Set.__super__.constructor.call(this, name, _.castArray(value), attributes, options);
    }

    __defineProperty(Set,  "validate", function(record, attribute, errors, callback) {
      var success, testValue, value;
      value = record.get(attribute);
      testValue = this.getValue(record);
      success = (function() {
        switch (this.name) {
          case 'in':
            return testValue.indexOf(value) > -1;
          case 'notIn':
            return testValue.indexOf(value) === -1;
          default:
            return false;
        }
      }).call(this);
      if (!success) {
        return this.failure(record, attribute, errors, Tower.t('model.errors.format', {
          attribute: attribute,
          value: testValue.toString()
        }), callback);
      } else {
        return this.success(callback);
      }
    });

    return Set;

  })(Tower.Model.Validator);

  Tower.Model.Validator.Uniqueness = (function(_super) {
    var Uniqueness;

    function Uniqueness() {
      return Uniqueness.__super__.constructor.apply(this, arguments);
    }

    Uniqueness = __extends(Uniqueness, _super);

    __defineProperty(Uniqueness,  "validate", function(record, attribute, errors, callback) {
      var conditions, value,
        _this = this;
      value = record.get(attribute);
      conditions = {};
      conditions[attribute] = value;
      return record.constructor.where(conditions).exists(function(error, result) {
        if (result) {
          return _this.failure(record, attribute, errors, Tower.t('model.errors.uniqueness', {
            attribute: attribute,
            value: value
          }), callback);
        } else {
          return _this.success(callback);
        }
      });
    });

    return Uniqueness;

  })(Tower.Model.Validator);

  Tower.Model.Validations = {
    ClassMethods: {
      validates: function() {
        var attributes, newValidators, options, validator, validators, _len7, _p;
        attributes = _.args(arguments);
        options = attributes.pop();
        validators = this.validators();
        newValidators = Tower.Model.Validator.createAll(attributes, options);
        for (_p = 0, _len7 = newValidators.length; _p < _len7; _p++) {
          validator = newValidators[_p];
          validators.push(validator);
        }
        return this;
      },
      validators: function() {
        var fields;
        switch (arguments.length) {
          case 0:
            return this.metadata().validators;
          case 1:
            return this.fields()[arguments[0]].validators();
          default:
            fields = this.fields();
            return _.inject(_.args(arguments), (function(name) {
              return fields[name].validators();
            }), {});
        }
      }
    },
    InstanceMethods: {
      validate: function(callback) {
        var success,
          _this = this;
        success = false;
        this.runCallbacks('validate', function(block) {
          var complete, errors, iterator, validators;
          complete = _this._callback(block, callback);
          validators = _this.constructor.validators();
          errors = _this.errors = {};
          iterator = function(validator, next) {
            return validator.validateEach(_this, errors, next);
          };
          Tower.async(validators, iterator, function(error) {
            if (!(_.isPresent(errors) || error)) {
              success = true;
            }
            return complete.call(_this, !success);
          });
          return success;
        });
        return success;
      }
    }
  };

  Tower.Model.Timestamp = {
    ClassMethods: {
      timestamps: function() {
        this.include(Tower.Model.Timestamp.CreatedAt);
        this.include(Tower.Model.Timestamp.UpdatedAt);
        this.field('createdAt', {
          type: 'Date'
        });
        this.field('updatedAt', {
          type: 'Date'
        });
        this.before('create', 'setCreatedAt');
        return this.before('save', 'setUpdatedAt');
      }
    },
    CreatedAt: {
      setCreatedAt: function() {
        return this.set('createdAt', new Date);
      }
    },
    UpdatedAt: {
      setUpdatedAt: function() {
        return this.set('updatedAt', new Date);
      }
    }
  };

  Tower.Model.Transactions = {
    ClassMethods: {
      transaction: function(block) {
        var transaction;
        transaction = new Tower.Store.Transaction;
        if (block) {
          block.call(this, transaction);
        }
        return transaction;
      }
    },
    InstanceMethods: {
      transaction: Ember.computed(function() {
        return new Tower.Store.Transaction;
      }).cacheable(),
      save: function() {
        this.get('transaction').adopt(this);
        return this._super.apply(this, arguments);
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
        format: "%{attribute} must match the format %{value}",
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

  Tower.Model.include(Tower.Model.Metadata);

  Tower.Model.include(Tower.Model.Dirty);

  Tower.Model.include(Tower.Model.Indexing);

  Tower.Model.include(Tower.Model.Scopes);

  Tower.Model.include(Tower.Model.Persistence);

  Tower.Model.include(Tower.Model.Inheritance);

  Tower.Model.include(Tower.Model.Serialization);

  Tower.Model.include(Tower.Model.States);

  Tower.Model.include(Tower.Model.Relations);

  Tower.Model.include(Tower.Model.Validations);

  Tower.Model.include(Tower.Model.Attributes);

  Tower.Model.include(Tower.Model.Timestamp);

  Tower.Model.include(Tower.Model.Transactions);

  Tower.View = (function(_super) {
    var View;

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View = __extends(View, _super);

    View.reopenClass({
      cache: {},
      engine: 'coffee',
      prettyPrint: false,
      loadPaths: ['app/views'],
      componentSuffix: 'widget',
      hintClass: 'hint',
      hintTag: 'figure',
      labelClass: 'control-label',
      requiredClass: 'required',
      requiredAbbr: '*',
      requiredTitle: 'Required',
      errorClass: 'error',
      errorTag: 'output',
      validClass: null,
      optionalClass: 'optional',
      optionalAbbr: '',
      optionalTitle: 'Optional',
      labelMethod: 'humanize',
      labelAttribute: 'toLabel',
      validationMaxLimit: 255,
      defaultTextFieldSize: null,
      defaultTextAreaWidth: 300,
      allFieldsRequiredByDefault: true,
      fieldListTag: 'ol',
      fieldListClass: 'fields',
      fieldTag: 'li',
      separator: '-',
      breadcrumb: ' - ',
      includeBlankForSelectByDefault: true,
      collectionLabelMethods: ['toLabel', 'displayName', 'fullName', 'name', 'title', 'toString'],
      i18nLookupsByDefault: true,
      escapeHtmlEntitiesInHintsAndLabels: false,
      renameNestedAttributes: true,
      inlineValidations: true,
      autoIdForm: true,
      fieldsetClass: 'fieldset',
      fieldClass: 'field control-group',
      validateClass: 'validate',
      legendClass: 'legend',
      formClass: 'form',
      idEnabledOn: ['input', 'field'],
      widgetsPath: 'shared/widgets',
      navClass: 'list-item',
      includeAria: true,
      activeClass: 'active',
      navTag: 'li',
      termsTag: 'dl',
      termClass: 'term',
      termKeyClass: 'key',
      termValueClass: 'value',
      hintIsPopup: false,
      listTag: 'ul',
      pageHeaderId: 'header',
      pageTitleId: 'title',
      autoIdNav: false,
      pageSubtitleId: 'subtitle',
      widgetClass: 'widget',
      headerClass: 'header',
      titleClass: 'title',
      subtitleClass: 'subtitle',
      contentClass: 'content',
      defaultHeaderLevel: 3,
      termSeparator: ':',
      richInput: false,
      submitFieldsetClass: 'submit-fieldset',
      addLabel: '+',
      removeLabel: '-',
      cycleFields: false,
      alwaysIncludeHintTag: false,
      alwaysIncludeErrorTag: true,
      requireIfValidatesPresence: true,
      localizeWithNamespace: false,
      localizeWithNestedModel: false,
      localizeWithInheritance: true,
      defaultComponentHeaderLevel: 3,
      helpers: [],
      metaTags: ['description', 'keywords', 'author', 'copyright', 'category', 'robots'],
      store: function(store) {
        if (store) {
          this._store = store;
        }
        return this._store || (this._store = new Tower.Store.Memory({
          name: 'view'
        }));
      },
      renderers: {}
    });

    __defineProperty(View,  "init", function(context) {
      if (context == null) {
        context = {};
      }
      this._super.apply(this, arguments);
      return this._context = context;
    });

    return View;

  })(Tower.Class);

  Tower.View.Rendering = {
    render: function(options, callback) {
      var type,
        _this = this;
      if (!options.type && options.template && typeof options.template === 'string' && !options.inline) {
        type = options.template.split('/');
        type = type[type.length - 1].split(".");
        type = type.slice(1).join();
        options.type = type !== '' ? type : this.constructor.engine;
      }
      options.type || (options.type = this.constructor.engine);
      if (!options.hasOwnProperty("layout") && this._context.layout) {
        options.layout = this._context.layout();
      }
      options.locals = this._renderingContext(options);
      return this._renderBody(options, function(error, body) {
        if (error) {
          return callback(error, body);
        }
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
      if (this._context) {
        prefixes || (prefixes = [this._context.collectionName]);
      }
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
          if (error) {
            return console.log(error);
          }
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
      var coffeekup, e, engine, hardcode, helper, locals, mint, result, tags, _len7, _p, _ref7;
      if (options == null) {
        options = {};
      }
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
          _ref7 = Tower.View.helpers;
          for (_p = 0, _len7 = _ref7.length; _p < _len7; _p++) {
            helper = _ref7[_p];
            hardcode = _.extend(hardcode, helper);
          }
          tags = coffeekup.tags;
          hardcode = _.extend(hardcode, {
            tags: tags
          });
          locals.hardcode = hardcode;
          locals._ = _;
          result = coffeekup.render(string, locals);
        } catch (error) {
          e = error;
          console.log(e.stack);
        }
        return callback(e, result);
      } else if (options.type) {
        mint = require("mint");
        if (typeof string === 'function') {
          string = string();
        }
        engine = mint.engine(options.type);
        if (engine.match(/(eco|mustache)/)) {
          return mint[engine](string, options, callback);
        } else {
          return mint[engine](string, options.locals, callback);
        }
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
        if (!key.match(/^(constructor|head)/)) {
          locals[key] = value;
        }
      }
      locals = _.modules(locals, options.locals);
      if (this.constructor.prettyPrint) {
        locals.pretty = true;
      }
      return locals;
    },
    _readTemplate: function(template, prefixes, ext) {
      var cachePath, options, path, result, store;
      if (typeof template !== "string") {
        return template;
      }
      options = {
        path: template,
        ext: ext,
        prefixes: prefixes
      };
      store = this.constructor.store();
      if (typeof store.findPath !== 'undefined') {
        path = store.findPath(options);
        path || (path = store.defaultPath(options));
      } else {
        path = template;
      }
      cachePath = path;
      result = this.constructor.cache[cachePath] || require('fs').readFileSync(path, 'utf-8').toString();
      if (!result) {
        throw new Error("Template '" + template + "' was not found.");
      }
      return result;
    }
  };

  Tower.View.Component = (function() {

    __defineStaticProperty(Component,  "render", function() {
      var args, block, options, template;
      args = _.args(arguments);
      template = args.shift();
      block = _.extractBlock(args);
      if (!(args[args.length - 1] instanceof Tower.Model || typeof args[args.length - 1] !== "object")) {
        options = args.pop();
      }
      options || (options = {});
      options.template = template;
      return (new this(args, options)).render(block);
    });

    function Component(args, options) {
      var key, value;
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
    }

    __defineProperty(Component,  "tag", function() {
      var args, key;
      key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.template.tag(key, args);
    });

    __defineProperty(Component,  "addClass", function(string, args) {
      var arg, result, _len7, _p;
      result = string ? string.split(/\s+/g) : [];
      for (_p = 0, _len7 = args.length; _p < _len7; _p++) {
        arg = args[_p];
        if (!arg) {
          continue;
        }
        if (!(result.indexOf(arg) > -1)) {
          result.push(arg);
        }
      }
      return result.join(" ");
    });

    return Component;

  })();

  Tower.View.Table = (function(_super) {
    var Table;

    Table = __extends(Table, _super);

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
      if (options.hasOwnProperty("total")) {
        data.total = options.total;
      }
      if (options.hasOwnProperty("page")) {
        data.page = options.page;
      }
      if (options.hasOwnProperty("count")) {
        data.count = options.count;
      }
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

    __defineProperty(Table,  "render", function(block) {
      var _this = this;
      return this.tag("table", this.options, function() {
        if (block) {
          block(_this);
        }
        return null;
      });
    });

    __defineProperty(Table,  "tableQueryRowClass", function() {
      return ["search-row", queryParams.except("page", "sort").blank != null ? null : "search-results"].compact.join(" ");
    });

    __defineProperty(Table,  "linkToSort", function(title, attribute, options) {
      var sortParam;
      if (options == null) {
        options = {};
      }
      sortParam = sortValue(attribute, oppositeSortDirection(attribute));
      return linkTo(title, withParams(request.path, {
        sort: sortParam
      }), options);
    });

    __defineProperty(Table,  "nextPagePath", function(collection) {
      return withParams(request.path, {
        page: collection.nextPage
      });
    });

    __defineProperty(Table,  "prevPagePath", function(collection) {
      return withParams(request.path, {
        page: collection.prevPage
      });
    });

    __defineProperty(Table,  "firstPagePath", function(collection) {
      return withParams(request.path, {
        page: 1
      });
    });

    __defineProperty(Table,  "lastPagePath", function(collection) {
      return withParams(request.path, {
        page: collection.lastPage
      });
    });

    __defineProperty(Table,  "currentPageNum", function() {
      var page;
      page = params.page ? params.page : 1;
      if (page < 1) {
        page = 1;
      }
      return page;
    });

    __defineProperty(Table,  "caption", function() {});

    __defineProperty(Table,  "head", function(attributes, block) {
      if (attributes == null) {
        attributes = {};
      }
      this.hideHeader = attributes.visible === false;
      delete attributes.visible;
      return this._section("head", attributes, block);
    });

    __defineProperty(Table,  "body", function(attributes, block) {
      if (attributes == null) {
        attributes = {};
      }
      return this._section("body", attributes, block);
    });

    __defineProperty(Table,  "foot", function(attributes, block) {
      if (attributes == null) {
        attributes = {};
      }
      return this._section("foot", attributes, block);
    });

    __defineProperty(Table,  "_section", function(scope, attributes, block) {
      this.rowIndex = 0;
      this.scope = scope;
      this.tag("t" + scope, attributes, block);
      this.rowIndex = 0;
      return this.scope = "table";
    });

    __defineProperty(Table,  "row", function() {
      var args, attributes, block, _p;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _p = arguments.length - 1) : (_p = 0, []), block = arguments[_p++];
      attributes = _.extractOptions(args);
      attributes.scope = "row";
      if (this.scope === "body") {
        attributes.role = "row";
      }
      this.rowIndex += 1;
      this.cellIndex = 0;
      this.tag("tr", attributes, block);
      return this.cellIndex = 0;
    });

    __defineProperty(Table,  "column", function() {
      var args, attributes, block, value, _base, _p;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _p = arguments.length - 1) : (_p = 0, []), block = arguments[_p++];
      attributes = _.extractOptions(args);
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
    });

    __defineProperty(Table,  "header", function() {
      var args, attributes, block, direction, label, sort, value, _base,
        _this = this;
      args = _.args(arguments);
      block = _.extractBlock(args);
      attributes = _.extractOptions(args);
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
    });

    __defineProperty(Table,  "linkToSort", function(label, value) {
      var direction,
        _this = this;
      direction = "+";
      return this.tag("a", {
        href: "?sort=" + direction
      }, function() {
        return _this.tag("span", label);
      });
    });

    __defineProperty(Table,  "cell", function() {
      var args, attributes, block, value, _base, _p;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _p = arguments.length - 1) : (_p = 0, []), block = arguments[_p++];
      attributes = _.extractOptions(args);
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
    });

    __defineProperty(Table,  "recordKey", function(recordOrKey) {
      if (typeof recordOrKey === "string") {
        return recordOrKey;
      } else {
        return recordOrKey.constructor.name;
      }
    });

    __defineProperty(Table,  "idFor", function(type, key, value, row_index, column_index) {
      if (row_index == null) {
        row_index = this.row_index;
      }
      if (column_index == null) {
        column_index = this.column_index;
      }
      [key, type, row_index, column_index].compact.map(function(node) {
        return node.replace(/[\s_]/, "-");
      });
      return end.join("-");
    });

    __defineProperty(Table,  "pixelate", function(value) {
      if (typeof value === "string") {
        return value;
      } else {
        return "" + value + "px";
      }
    });

    return Table;

  })(Tower.View.Component);

  Tower.View.Form = (function(_super) {
    var Form;

    Form = __extends(Form, _super);

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

    __defineProperty(Form,  "render", function(callback) {
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
    });

    __defineProperty(Form,  "_extractAttributes", function(options) {
      var attributes;
      if (options == null) {
        options = {};
      }
      attributes = options.html || {};
      attributes.action = options.url || Tower.urlFor(this.model);
      if (options.hasOwnProperty("class")) {
        attributes["class"] = options["class"];
      }
      if (options.hasOwnProperty("id")) {
        attributes.id = options.id;
      }
      attributes.id || (attributes.id = Tower.Support.String.parameterize("" + (this.model.constructor.className()) + "-form"));
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
    });

    return Form;

  })(Tower.View.Component);

  Tower.View.Form.Builder = (function(_super) {
    var Builder;

    Builder = __extends(Builder, _super);

    function Builder(args, options) {
      if (options == null) {
        options = {};
      }
      this.template = options.template;
      this.model = options.model;
      this.attribute = options.attribute;
      this.parentIndex = options.parentIndex;
      this.index = options.index;
      this.tabindex = options.tabindex;
      this.accessKeys = options.accessKeys;
    }

    __defineProperty(Builder,  "defaultOptions", function(options) {
      if (options == null) {
        options = {};
      }
      options.model || (options.model = this.model);
      options.index || (options.index = this.index);
      options.attribute || (options.attribute = this.attribute);
      options.template || (options.template = this.template);
      return options;
    });

    __defineProperty(Builder,  "fieldset", function() {
      var args, block, options;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      block = args.pop();
      options = this.defaultOptions(_.extractOptions(args));
      options.label || (options.label = args.shift());
      return new Tower.View.Form.Fieldset([], options).render(block);
    });

    __defineProperty(Builder,  "fields", function() {
      var args, attribute, block, options,
        _this = this;
      args = _.args(arguments);
      block = _.extractBlock(args);
      options = _.extractOptions(args);
      options.as = "fields";
      options.label || (options.label = false);
      attribute = args.shift() || this.attribute;
      return this.field(attribute, options, function(_field) {
        return _this.fieldset(block);
      });
    });

    __defineProperty(Builder,  "fieldsFor", function() {
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
    });

    __defineProperty(Builder,  "field", function() {
      var args, attributeName, block, defaults, last, options;
      args = _.args(arguments);
      last = args[args.length - 1];
      if (last === null || last === void 0) {
        args.pop();
      }
      block = _.extractBlock(args);
      options = _.extractOptions(args);
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
    });

    __defineProperty(Builder,  "button", function() {
      var args, block, options;
      args = _.args(arguments);
      block = _.extractBlock(args);
      options = _.extractOptions(args);
      options.as || (options.as = "submit");
      options.value = args.shift() || "Submit";
      if (options.as === "submit") {
        options["class"] = Tower.View.submitFieldsetClass;
      }
      return this.field(options.value, options, block);
    });

    __defineProperty(Builder,  "submit", Builder.prototype.button);

    __defineProperty(Builder,  "partial", function(path, options) {
      if (options == null) {
        options = {};
      }
      return this.template.render({
        partial: path,
        locals: options.merge({
          fields: self
        })
      });
    });

    __defineProperty(Builder,  "tag", function() {
      var args, key;
      key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.template.tag(key, args);
    });

    __defineProperty(Builder,  "render", function(block) {
      return block(this);
    });

    return Builder;

  })(Tower.View.Component);

  Tower.View.Form.Field = (function(_super) {
    var Field;

    Field = __extends(Field, _super);

    __defineProperty(Field,  "addClass", function(string, args) {
      var arg, result, _len7, _p;
      result = string ? string.split(/\s+/g) : [];
      for (_p = 0, _len7 = args.length; _p < _len7; _p++) {
        arg = args[_p];
        if (!arg) {
          continue;
        }
        if (!(result.indexOf(arg) > -1)) {
          result.push(arg);
        }
      }
      return result.join(" ");
    });

    __defineProperty(Field,  "toId", function(options) {
      var result;
      if (options == null) {
        options = {};
      }
      result = Tower.Support.String.parameterize(this.model.constructor.className());
      if (options.parentIndex) {
        result += "-" + options.parentIndex;
      }
      result += "-" + (Tower.Support.String.parameterize(this.attribute));
      result += "-" + (options.type || "field");
      if (this.index != null) {
        result += "-" + this.index;
      }
      return result;
    });

    __defineProperty(Field,  "toParam", function(options) {
      var result;
      if (options == null) {
        options = {};
      }
      result = Tower.Support.String.camelize(this.model.constructor.className(), true);
      if (options.parentIndex) {
        result += "[" + options.parentIndex + "]";
      }
      result += "[" + this.attribute + "]";
      if (this.index != null) {
        result += "[" + this.index + "]";
      }
      return result;
    });

    function Field(args, options) {
      var classes, field, inputType, pattern, value, _base, _base1, _base2, _base3, _base4, _base5, _base6;
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
          this.labelValue || (this.labelValue = _.humanize(this.attribute.toString()));
        }
        if (options.hint !== false) {
          this.errorHTML["class"] = this.addClass(this.errorHTML["class"], [Tower.View.errorClass]);
          if (Tower.View.includeAria && Tower.View.hintIsPopup) {
            (_base1 = this.errorHTML).role || (_base1.role = "tooltip");
          }
        }
      }
      this.attributes = this.fieldHTML;
      if (inputType !== "submit") {
        (_base2 = this.inputHTML).name || (_base2.name = this.toParam());
      }
      (_base3 = this.inputHTML).value || (_base3.value = options.value);
      (_base4 = this.inputHTML).value || (_base4.value = this.value);
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
      if (options.placeholder) {
        this.inputHTML.placeholder = options.placeholder;
      }
      value = void 0;
      if (options.hasOwnProperty("value")) {
        value = options.value;
      }
      if (!value && this.inputHTML.hasOwnProperty('value')) {
        value = this.inputHTML.value;
      }
      value || (value = this.model.get(this.attribute));
      if (value) {
        if (this.inputType === "array") {
          value = _.castArray(value).join(", ");
        } else {
          value = value.toString();
        }
      }
      this.inputHTML.value = value;
      if (options.hasOwnProperty("max")) {
        (_base5 = this.inputHTML).maxlength || (_base5.maxlength = options.max);
      }
      pattern = options.match;
      if (_.isRegExp(pattern)) {
        pattern = pattern.toString();
      }
      if (pattern != null) {
        this.inputHTML["data-match"] = pattern;
      }
      this.inputHTML["aria-required"] = this.required.toString();
      if (this.required === true) {
        this.inputHTML.required = "true";
      }
      if (this.disabled) {
        this.inputHTML.disabled = "true";
      }
      if (this.autofocus === true) {
        this.inputHTML.autofocus = "true";
      }
      if (this.dynamic) {
        this.inputHTML["data-dynamic"] = "true";
      }
      if (this.inputHTML.placeholder) {
        (_base6 = this.inputHTML).title || (_base6.title = this.inputHTML.placeholder);
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

    __defineProperty(Field,  "input", function() {
      var args, options;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      options = _.extend(this.inputHTML, _.extractOptions(args));
      key = args.shift() || this.attribute;
      return this["" + this.inputType + "Input"](key, options);
    });

    __defineProperty(Field,  "checkboxInput", function(key, options) {
      return this.tag("input", _.extend({
        type: "checkbox"
      }, options));
    });

    __defineProperty(Field,  "stringInput", function(key, options) {
      return this.tag("input", _.extend({
        type: "text"
      }, options));
    });

    __defineProperty(Field,  "submitInput", function(key, options) {
      var value;
      value = options.value;
      delete options.value;
      return this.tag("button", _.extend({
        type: "submit"
      }, options), value);
    });

    __defineProperty(Field,  "fileInput", function(key, options) {
      return this.tag("input", _.extend({
        type: "file"
      }, options));
    });

    __defineProperty(Field,  "textInput", function(key, options) {
      var value;
      value = options.value;
      delete options.value;
      return this.tag("textarea", options, value);
    });

    __defineProperty(Field,  "passwordInput", function(key, options) {
      return this.tag("input", _.extend({
        type: "password"
      }, options));
    });

    __defineProperty(Field,  "emailInput", function(key, options) {
      return this.tag("input", _.extend({
        type: "email"
      }, options));
    });

    __defineProperty(Field,  "urlInput", function(key, options) {
      return this.tag("input", _.extend({
        type: "url"
      }, options));
    });

    __defineProperty(Field,  "numberInput", function(key, options) {
      return this.tag("input", _.extend({
        type: "string",
        "data-type": "numeric"
      }, options));
    });

    __defineProperty(Field,  "searchInput", function(key, options) {
      return this.tag("input", _.extend({
        type: "search",
        "data-type": "search"
      }, options));
    });

    __defineProperty(Field,  "phoneInput", function(key, options) {
      return this.tag("input", _.extend({
        type: "tel",
        "data-type": "phone"
      }, options));
    });

    __defineProperty(Field,  "arrayInput", function(key, options) {
      return this.tag("input", _.extend({
        "data-type": "array"
      }, options));
    });

    __defineProperty(Field,  "label", function() {
      var _this = this;
      if (!this.labelValue) {
        return;
      }
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
    });

    __defineProperty(Field,  "render", function(block) {
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
    });

    __defineProperty(Field,  "extractElements", function(options) {
      var elements, _base;
      if (options == null) {
        options = {};
      }
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
    });

    return Field;

  })(Tower.View.Component);

  Tower.View.Form.Fieldset = (function(_super) {
    var Fieldset;

    Fieldset = __extends(Fieldset, _super);

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

    __defineProperty(Fieldset,  "render", function(block) {
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
    });

    return Fieldset;

  })(Tower.View.Component);

  Tower.View.AssetHelper = {
    javascripts: function() {
      var options, path, paths, sources, _len7, _p;
      sources = _.args(arguments);
      options = _.extractOptions(sources);
      options.namespace = "javascripts";
      options.extension = "js";
      paths = _extractAssetPaths(sources, options);
      for (_p = 0, _len7 = paths.length; _p < _len7; _p++) {
        path = paths[_p];
        javascriptTag(path);
      }
      return null;
    },
    javascript: function() {
      return javascripts.apply(this, arguments);
    },
    stylesheets: function() {
      var options, path, paths, sources, _len7, _p;
      sources = _.args(arguments);
      options = _.extractOptions(sources);
      options.namespace = "stylesheets";
      options.extension = "css";
      paths = _extractAssetPaths(sources, options);
      for (_p = 0, _len7 = paths.length; _p < _len7; _p++) {
        path = paths[_p];
        stylesheetTag(path);
      }
      return null;
    },
    stylesheet: function() {
      return stylesheets.apply(this, arguments);
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
    },
    _extractAssetPaths: function(sources, options) {
      var extension, manifest, namespace, path, paths, result, source, _len7, _len8, _len9, _p, _q, _r;
      if (options == null) {
        options = {};
      }
      namespace = options.namespace;
      extension = options.extension;
      result = [];
      if (Tower.env === "production") {
        manifest = Tower.assetManifest;
        for (_p = 0, _len7 = sources.length; _p < _len7; _p++) {
          source = sources[_p];
          if (!source.match(/^(http|\/{2})/)) {
            source = "" + source + "." + extension;
            if (manifest[source]) {
              source = manifest[source];
            }
            source = "/assets/" + source;
            if (Tower.assetHost) {
              source = "" + Tower.assetHost + source;
            }
          }
          result.push(source);
        }
      } else {
        for (_q = 0, _len8 = sources.length; _q < _len8; _q++) {
          source = sources[_q];
          if (!!source.match(/^(http|\/{2})/)) {
            result.push(source);
          } else {
            paths = Tower.config.assets[namespace][source];
            if (paths) {
              for (_r = 0, _len9 = paths.length; _r < _len9; _r++) {
                path = paths[_r];
                result.push("/" + namespace + path + "." + extension);
              }
            }
          }
        }
      }
      return result;
    }
  };

  Tower.View.ComponentHelper = {
    formFor: function() {
      var _ref7;
      return (_ref7 = Tower.View.Form).render.apply(_ref7, [__ck].concat(__slice.call(arguments)));
    },
    tableFor: function() {
      var _ref7;
      return (_ref7 = Tower.View.Table).render.apply(_ref7, [__ck].concat(__slice.call(arguments)));
    },
    widget: function() {},
    linkTo: function(title, path, options) {
      if (options == null) {
        options = {};
      }
      return a(_.extend(options, {
        href: path,
        title: title
      }), title.toString());
    },
    navItem: function(title, path, options) {
      if (options == null) {
        options = {};
      }
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
      var classes, part, parts, string, _len7, _p;
      string = arguments[0], parts = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      classes = string.split(/\ +/);
      for (_p = 0, _len7 = parts.length; _p < _len7; _p++) {
        part = parts[_p];
        if (classes.indexOf(part) > -1) {
          classes.push(part);
        }
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
      var i, item, result, _len7, _p;
      result = this.elementNameComponents.apply(this, arguments);
      i = 1;
      for (i = _p = 0, _len7 = result.length; _p < _len7; i = ++_p) {
        item = result[i];
        result[i] = "[" + item + "]";
      }
      return Tower.Support.String.parameterize(result.join(""));
    },
    elementNameComponents: function() {
      var args, item, result, _len7, _p;
      args = _.args(arguments);
      result = [];
      for (_p = 0, _len7 = args.length; _p < _len7; _p++) {
        item = args[_p];
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

  Tower.View.EmberHelper = {
    hEach: function() {
      return hBlock.apply(null, ['each'].concat(__slice.call(arguments)));
    },
    hWith: function() {
      return hBlock.apply(null, ['with'].concat(__slice.call(arguments)));
    },
    hIf: function() {
      return hBlock.apply(null, ['if'].concat(__slice.call(arguments)));
    },
    hElse: function() {
      return text('{{else}}');
    },
    hUnless: function() {
      return hBlock.apply(null, ['unless'].concat(__slice.call(arguments)));
    },
    hView: function() {
      return hBlock.apply(null, ['view'].concat(__slice.call(arguments)));
    },
    hBindAttr: function() {
      return hAttr.apply(null, ['bindAttr'].concat(__slice.call(arguments)));
    },
    hAction: function() {
      return hAttr.apply(null, ['action'].concat(__slice.call(arguments)));
    },
    hAttr: function(key, string, options) {
      var k, v;
      if (typeof string === 'object') {
        options = string;
        string = "";
      } else {
        string = " \"" + string + "\"";
      }
      if (options) {
        for (k in options) {
          v = options[k];
          string += " " + k + "=\"" + v + "\"";
        }
      }
      return text("{{" + key + string + "}}");
    },
    hBlock: function(key, string, options, block) {
      var k, v;
      if (typeof options === 'function') {
        block = options;
        options = {};
      }
      options || (options = {});
      if (!_.isBlank(string)) {
        string = " " + string;
        for (k in options) {
          v = options[k];
          string += " " + k + "=\"" + v + "\"";
        }
      }
      text("{{#" + key + string + "}}" + (block ? "\n" : ""));
      if (block) {
        block();
        return text("{{/" + key + "}}");
      }
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
      if (charset == null) {
        charset = "UTF-8";
      }
      if (type == null) {
        type = "text/html";
      }
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
      if (charset == null) {
        charset = "UTF-8";
      }
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
      if (favicon == null) {
        favicon = "/favicon.ico";
      }
      return linkTag({
        rel: "shortcut icon",
        href: favicon,
        type: "image/x-icon"
      });
    },
    linkTag: function(options) {
      if (options == null) {
        options = {};
      }
      return link(options);
    },
    ieApplicationMetaTags: function(title, options) {
      var result;
      if (options == null) {
        options = {};
      }
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
      if (icon == null) {
        icon = null;
      }
      content = [];
      content.push("name=" + name);
      content.push("uri=" + path);
      if (icon) {
        content.push("icon-uri=" + icon);
      }
      return this.metaTag("msapplication-task", content.join(";"));
    },
    appleMetaTags: function(options) {
      var result;
      if (options == null) {
        options = {};
      }
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
      if (options == null) {
        options = {};
      }
      viewport = [];
      if (options.hasOwnProperty("width")) {
        viewport.push("width=" + options.width);
      }
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
      if (options == null) {
        options = {};
      }
      rel = ["apple-touch-icon"];
      if (options.hasOwnProperty("size")) {
        rel.push("" + options.size + "x" + options.size);
      }
      if (options.precomposed) {
        rel.push("precomposed");
      }
      return linkTag({
        rel: rel.join("-"),
        href: path
      });
    },
    appleTouchIconLinkTags: function() {
      var options, path, result, size, sizes, _len7, _p;
      path = arguments[0], sizes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof sizes[sizes.length - 1] === "object") {
        options = sizes.pop();
      } else {
        options = {};
      }
      result = [];
      for (_p = 0, _len7 = sizes.length; _p < _len7; _p++) {
        size = sizes[_p];
        result.push(appleTouchIconLinkTag(path, _.extend({
          size: size
        }, options)));
      }
      return result.join();
    },
    openGraphMetaTags: function(options) {
      if (options == null) {
        options = {};
      }
      if (options.title) {
        openGraphMetaTag("og:title", options.title);
      }
      if (options.type) {
        openGraphMetaTag("og:type", options.type);
      }
      if (options.image) {
        openGraphMetaTag("og:image", options.image);
      }
      if (options.site) {
        openGraphMetaTag("og:siteName", options.site);
      }
      if (options.description) {
        openGraphMetaTag("og:description", options.description);
      }
      if (options.email) {
        openGraphMetaTag("og:email", options.email);
      }
      if (options.phone) {
        openGraphMetaTag("og:phoneNumber", options.phone);
      }
      if (options.fax) {
        openGraphMetaTag("og:faxNumber", options.fax);
      }
      if (options.lat) {
        openGraphMetaTag("og:latitude", options.lat);
      }
      if (options.lng) {
        openGraphMetaTag("og:longitude", options.lng);
      }
      if (options.street) {
        openGraphMetaTag("og:street-address", options.street);
      }
      if (options.city) {
        openGraphMetaTag("og:locality", options.city);
      }
      if (options.state) {
        openGraphMetaTag("og:region", options.state);
      }
      if (options.zip) {
        openGraphMetaTag("og:postal-code", options.zip);
      }
      if (options.country) {
        openGraphMetaTag("og:country-name", options.country);
      }
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
      var item, locals, name, prefixes, template, tmpl, _len7, _p, _ref7;
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
        if (this._context) {
          prefixes || (prefixes = [this._context.collectionName]);
        }
        template = this._readTemplate(path, prefixes, options.type || Tower.View.engine);
        template = this.renderWithEngine(String(template));
        if (options.collection) {
          name = options.as || Tower.Support.String.camelize(options.collection[0].constructor.name, true);
          tmpl = eval("(function(data) { with(data) { this." + name + " = " + name + "; " + (String(template)) + " } })");
          _ref7 = options.collection;
          for (_p = 0, _len7 = _ref7.length; _p < _len7; _p++) {
            item = _ref7[_p];
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
      args = _.args(arguments);
      options = _.extractOptions(args);
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

  Tower.View.include(Tower.View.AssetHelper);

  Tower.View.include(Tower.View.ComponentHelper);

  Tower.View.include(Tower.View.EmberHelper);

  Tower.View.include(Tower.View.HeadHelper);

  Tower.View.include(Tower.View.RenderingHelper);

  Tower.View.include(Tower.View.StringHelper);

  Tower.View.helpers.push(Tower.View.AssetHelper);

  Tower.View.helpers.push(Tower.View.ComponentHelper);

  Tower.View.helpers.push(Tower.View.EmberHelper);

  Tower.View.helpers.push(Tower.View.HeadHelper);

  Tower.View.helpers.push(Tower.View.RenderingHelper);

  Tower.View.helpers.push(Tower.View.StringHelper);

  $.fn.serializeParams = function(coerce) {
    return $.serializeParams($(this).serialize(), coerce);
  };

  $.serializeParams = function(params, coerce) {
    var array, coerce_types, cur, i, index, item, keys, keys_last, obj, param, val, _len7, _p;
    obj = {};
    coerce_types = {
      "true": !0,
      "false": !1,
      "null": null
    };
    array = params.replace(/\+/g, " ").split("&");
    for (index = _p = 0, _len7 = array.length; _p < _len7; index = ++_p) {
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
        if (key) {
          obj[key] = (coerce ? undefined : "");
        }
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
      var attribute, element, errors, field, _ref7, _results;
      element = $("#" + this.resourceName + "-" + this.elementName);
      _ref7 = this.resource.errors;
      _results = [];
      for (attribute in _ref7) {
        errors = _ref7[attribute];
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
    var Controller;

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller = __extends(Controller, _super);

    Controller.include(Tower.Support.Callbacks);

    Controller.reopenClass(Tower.Support.EventEmitter);

    Controller.include(Tower.Support.EventEmitter);

    __defineStaticProperty(Controller,  "instance", function() {
      return this._instance || (this._instance = new this);
    });

    __defineProperty(Controller,  "init", function() {
      var metadata;
      this._super.apply(this, arguments);
      this.constructor._instance = this;
      this.headers = {};
      this.status = 200;
      this.request = null;
      this.response = null;
      this.params = {};
      this.query = {};
      metadata = this.constructor.metadata();
      this.resourceName = metadata.resourceName;
      this.resourceType = metadata.resourceType;
      this.collectionName = metadata.collectionName;
      this.formats = _.keys(metadata.mimes);
      return this.hasParent = this.constructor.hasParent();
    });

    return Controller;

  })(Tower.Class);

  Tower.Controller.Callbacks = {
    ClassMethods: {
      beforeAction: function() {
        return this.before.apply(this, ['action'].concat(__slice.call(arguments)));
      },
      afterAction: function() {
        return this.after.apply(this, ['action'].concat(__slice.call(arguments)));
      },
      callbacks: function() {
        return this.metadata().callbacks;
      }
    }
  };

  Tower.Controller.Errors = {
    ClassMethods: {
      rescue: function(type, method, options) {
        var app, handlers,
          _this = this;
        app = Tower.Application.instance();
        handlers = app.currentErrorHandlers || (app.currentErrorHandlers = []);
        return handlers.push(function(error) {
          var errorType;
          errorType = typeof type === 'string' ? global[type] : type;
          if (error instanceof errorType) {
            return _this.instance()[method](error);
          }
        });
      }
    }
  };

  Tower.Controller.Errors.ClassMethods.rescueFrom = Tower.Controller.Errors.ClassMethods.rescue;

  Tower.Controller.Helpers = {
    ClassMethods: {
      helper: function(object) {
        return this.helpers().push(object);
      },
      helpers: function() {
        return this.metadata().helpers;
      },
      layout: function(layout) {
        return this._layout = layout;
      }
    },
    InstanceMethods: {
      layout: function() {
        var layout;
        layout = this.constructor._layout;
        if (typeof layout === 'function') {
          return layout.call(this);
        } else {
          return layout;
        }
      }
    }
  };

  Tower.Controller.Instrumentation = {
    InstanceMethods: {
      call: function(request, response, next) {
        var _base;
        this.request = request;
        this.response = response;
        this.params = this.request.params || {};
        this.cookies = this.request.cookies || {};
        this.query = this.request.query || {};
        this.session = this.request.session || {};
        if (!this.params.format) {
          try {
            this.params.format = require('mime').extension(this.request.header('content-type'));
          } catch (_error) {}
          (_base = this.params).format || (_base.format = 'html');
        }
        this.format = this.params.format;
        this.action = this.params.action;
        this.headers = {};
        this.callback = next;
        return this.process();
      },
      process: function() {
        var _this = this;
        if (!Tower.env.match(/(test|production)/)) {
          console.log("  Processing by " + (this.constructor.className()) + "#" + this.action + " as " + (this.format.toUpperCase()));
          console.log("  Parameters:");
          console.log(this.params);
        }
        return this.runCallbacks('action', {
          name: this.action
        }, function(callback) {
          return _this[_this.action].call(_this, callback);
        });
      },
      clear: function() {
        this.request = null;
        return this.response = null;
      },
      metadata: function() {
        return this.constructor.metadata();
      }
    }
  };

  Tower.Controller.Metadata = {
    ClassMethods: {
      baseClass: function() {
        if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Controller) {
          return this.__super__.constructor.baseClass();
        } else {
          return this;
        }
      },
      metadata: function() {
        var action, baseClassName, belongsTo, callbackChain, callbacks, className, collectionName, helpers, metadata, mimes, params, renderers, resourceName, resourceType, result, superMetadata, _ref7;
        className = this.className();
        metadata = this.metadata[className];
        if (metadata) {
          return metadata;
        }
        baseClassName = this.baseClass().className();
        if (baseClassName !== className) {
          superMetadata = this.baseClass().metadata();
        } else {
          superMetadata = {};
        }
        resourceType = _.singularize(className.replace(/(Controller)$/, ''));
        resourceName = this._compileResourceName(resourceType);
        collectionName = Tower.Support.String.camelize(className.replace(/(Controller)$/, ''), true);
        params = _.copyObject(superMetadata.params);
        renderers = _.copyObject(superMetadata.renderers);
        mimes = superMetadata.mimes ? _.clone(superMetadata.mimes) : {
          json: {},
          html: {}
        };
        helpers = _.copyArray(superMetadata.helpers);
        belongsTo = _.copyArray(superMetadata.belongsTo);
        callbacks = {};
        if (superMetadata.callbacks) {
          _ref7 = superMetadata.callbacks;
          for (action in _ref7) {
            callbackChain = _ref7[action];
            callbacks[action] = callbackChain.clone();
          }
        }
        result = this.metadata[className] = {
          className: className,
          resourceName: resourceName,
          resourceType: resourceType,
          collectionName: collectionName,
          params: params,
          renderers: renderers,
          mimes: mimes,
          callbacks: callbacks,
          helpers: helpers,
          belongsTo: belongsTo
        };
        return result;
      },
      _compileResourceName: function(type) {
        var parts, resourceName;
        parts = type.split('.');
        return resourceName = Tower.Support.String.camelize(parts[parts.length - 1], true);
      }
    }
  };

  Tower.Controller.Params = {
    ClassMethods: {
      param: function(key, options) {
        return this.params()[key] = Tower.HTTP.Param.create(key, options);
      },
      params: function() {
        var arg, key, value, _len7, _p;
        if (arguments.length) {
          for (_p = 0, _len7 = arguments.length; _p < _len7; _p++) {
            arg = arguments[_p];
            if (typeof arg === 'object') {
              for (key in arg) {
                value = arg[key];
                this.param(key, value);
              }
            } else {
              this.param(arg);
            }
          }
        }
        return this.metadata().params;
      }
    },
    InstanceMethods: {
      cursor: function() {
        var cursor, name, params, parser, parsers;
        if (this._cursor) {
          return this._cursor;
        }
        this._cursor = cursor = Tower.Model.Cursor.create();
        cursor.make();
        parsers = this.constructor.params();
        params = this.params;
        for (name in parsers) {
          parser = parsers[name];
          if (params.hasOwnProperty(name)) {
            cursor.where(parser.toCursor(params[name]));
          }
        }
        return cursor;
      }
    }
  };

  Tower.Controller.Redirecting = {
    InstanceMethods: {
      redirectTo: function() {
        return this.redirect.apply(this, arguments);
      },
      redirect: function() {
        var args, options, url;
        try {
          args = _.args(arguments);
          options = _.extractOptions(args);
          url = args.shift();
          if (!url && options.hasOwnProperty('action')) {
            url = (function() {
              switch (options.action) {
                case 'index':
                case 'new':
                  return Tower.urlFor(this.resourceType, {
                    action: options.action
                  });
                case 'edit':
                case 'show':
                  return Tower.urlFor(this.resource, {
                    action: options.action
                  });
              }
            }).call(this);
          }
          url || (url = '/');
          if (Tower.env === 'test') {
            if (options.action === 'index') {
              url = '/custom';
            } else {
              url = "/custom/" + (this.resource.get('id'));
            }
          }
          this.response.redirect(url);
        } catch (error) {
          console.log(error);
        }
        if (this.callback) {
          return this.callback();
        }
      }
    }
  };

  Tower.Controller.Rendering = {
    ClassMethods: {
      addRenderer: function(key, block) {
        return this.renderers()[key] = block;
      },
      addRenderers: function(renderers) {
        var block, key;
        if (renderers == null) {
          renderers = {};
        }
        for (key in renderers) {
          block = renderers[key];
          this.addRenderer(key, block);
        }
        return this;
      },
      renderers: function() {
        return this.metadata().renderers;
      }
    },
    InstanceMethods: {
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
        if (options == null) {
          options = {};
        }
      },
      sendData: function(data, options) {
        if (options == null) {
          options = {};
        }
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
          if (error) {
            console.log(_this.body);
          }
          if (_callback) {
            _callback.apply(_this, arguments);
          }
          if (_this.callback) {
            return _this.callback();
          }
        };
        if (this._handleRenderers(options, callback)) {
          return;
        }
        (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = "text/html");
        view = new Tower.View(this);
        try {
          return view.render.call(view, options, callback);
        } catch (error) {
          return callback(error);
        }
      },
      _handleRenderers: function(options, callback) {
        var name, renderer, _ref7;
        _ref7 = Tower.Controller.renderers();
        for (name in _ref7) {
          renderer = _ref7[name];
          if (options.hasOwnProperty(name)) {
            renderer.call(this, options[name], options, callback);
            return true;
          }
        }
        return false;
      },
      _processRenderOptions: function(options) {
        if (options == null) {
          options = {};
        }
        if (options.status) {
          this.status = options.status;
        }
        if (options.contentType) {
          this.headers["Content-Type"] = options.contentType;
        }
        if (options.location) {
          this.headers["Location"] = this.urlFor(options.location);
        }
        return this;
      },
      _normalizeRender: function() {
        return this._normalizeOptions(this._normalizeArgs.apply(this, arguments));
      },
      _normalizeArgs: function() {
        var args, callback, options;
        args = _.args(arguments);
        if (typeof args[0] === "string") {
          action = args.shift();
        }
        if (typeof args[0] === "object") {
          options = args.shift();
        }
        if (typeof args[0] === "function") {
          callback = args.shift();
        }
        options || (options = {});
        if (action) {
          key = !!action.match(/\//) ? "file" : "action";
          options[key] = action;
        }
        if (callback) {
          options.callback = callback;
        }
        return options;
      },
      _normalizeOptions: function(options) {
        if (options == null) {
          options = {};
        }
        if (options.partial === true) {
          options.partial = this.action;
        }
        options.prefixes || (options.prefixes = []);
        options.prefixes.push(this.collectionName);
        options.template || (options.template = options.file || (options.action || this.action));
        return options;
      }
    }
  };

  Tower.Controller.Resourceful = {
    ClassMethods: {
      resource: function(options) {
        var metadata;
        metadata = this.metadata();
        if (typeof options === "string") {
          options = {
            name: options,
            type: Tower.Support.String.camelize(options),
            collectionName: _.pluralize(options)
          };
        }
        if (options.name) {
          metadata.resourceName = options.name;
        }
        if (options.type) {
          metadata.resourceType = options.type;
          if (!options.name) {
            metadata.resourceName = this._compileResourceName(options.type);
          }
        }
        if (options.collectionName) {
          metadata.collectionName = options.collectionName;
        }
        return this;
      },
      belongsTo: function(key, options) {
        var belongsTo;
        belongsTo = this.metadata().belongsTo;
        if (!key) {
          return belongsTo;
        }
        options || (options = {});
        options.key = key;
        options.type || (options.type = Tower.Support.String.camelize(options.key));
        return belongsTo.push(options);
      },
      hasParent: function() {
        var belongsTo;
        belongsTo = this.belongsTo();
        return belongsTo.length > 0;
      },
      actions: function() {
        var action, actions, actionsToRemove, args, options, _len7, _p;
        args = _.args(arguments);
        if (typeof args[args.length - 1] === "object") {
          options = args.pop();
        } else {
          options = {};
        }
        actions = ["index", "new", "create", "show", "edit", "update", "destroy"];
        actionsToRemove = _.difference(actions, args, options.except || []);
        for (_p = 0, _len7 = actionsToRemove.length; _p < _len7; _p++) {
          action = actionsToRemove[_p];
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
    respondWithScoped: function(callback) {
      var _this = this;
      return this.scoped(function(error, scope) {
        if (error) {
          return _this.failure(error, callback);
        }
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
        if (error) {
          return callback.call(_this, error, null);
        }
        _this[_this.resourceName] = _this.resource = resource = scope.build(_this.params[_this.resourceName]);
        if (callback) {
          callback.call(_this, null, resource);
        }
        return resource;
      });
    },
    createResource: function(callback) {
      var _this = this;
      return this.scoped(function(error, scope) {
        var resource;
        if (error) {
          return callback.call(_this, error, null);
        }
        resource = null;
        scope.insert(_this.params[_this.resourceName], function(error, record) {
          _this[_this.resourceName] = _this.resource = record;
          if (callback) {
            return callback.call(_this, null, record);
          }
        });
        return resource;
      });
    },
    findResource: function(callback) {
      var _this = this;
      return this.scoped(function(error, scope) {
        if (error) {
          return callback.call(_this, error, null);
        }
        return scope.find(_this.params.id, function(error, resource) {
          _this[_this.resourceName] = _this.resource = resource;
          return callback.call(_this, error, resource);
        });
      });
    },
    findCollection: function(callback) {
      var _this = this;
      return this.scoped(function(error, scope) {
        if (error) {
          return callback.call(_this, error, null);
        }
        return scope.all(function(error, collection) {
          _this[_this.collectionName] = _this.collection = collection;
          if (callback) {
            return callback.call(_this, error, collection);
          }
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
          if (error && !callback) {
            throw error;
          }
          if (!error) {
            _this.parent = _this[relation.key] = parent;
          }
          if (callback) {
            return callback.call(_this, error, parent);
          }
        });
      } else {
        if (callback) {
          callback.call(this, null, false);
        }
        return false;
      }
    },
    findParentRelation: function() {
      var belongsTo, param, params, relation, _len7, _p;
      belongsTo = this.constructor.belongsTo();
      params = this.params;
      if (belongsTo.length > 0) {
        for (_p = 0, _len7 = belongsTo.length; _p < _len7; _p++) {
          relation = belongsTo[_p];
          param = relation.param || ("" + relation.key + "Id");
          if (params.hasOwnProperty(param)) {
            relation = _.extend({}, relation);
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
        return callback.call(_this, error, scope.where(_this.cursor()));
      };
      if (this.hasParent) {
        this.findParent(function(error, parent) {
          if (error || !parent) {
            return callbackWithScope(error, Tower.constant(_this.resourceType));
          } else {
            return callbackWithScope(error, parent.get(_this.collectionName));
          }
        });
      } else {
        callbackWithScope(null, Tower.constant(this.resourceType));
      }
      return;
    },
    resourceKlass: function() {
      return Tower.constant(Tower.namespaced(this.resourceType));
    },
    failure: function(resource, callback) {
      callback();
      return;
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
        if (!resource) {
          return _this.failure(error);
        }
        return _this.respondWith(resource, callback);
      });
    },
    _create: function(callback) {
      var _this = this;
      return this.createResource(function(error, resource) {
        if (!resource) {
          return _this.failure(error, callback);
        }
        return _this.respondWithStatus(_.isBlank(resource.errors), callback);
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
        if (error) {
          return _this.failure(error, callback);
        }
        return resource.updateAttributes(_this.params[_this.resourceName], function(error) {
          return _this.respondWithStatus(!!!error && _.isBlank(resource.errors), callback);
        });
      });
    },
    _destroy: function(callback) {
      var _this = this;
      return this.findResource(function(error, resource) {
        if (error) {
          return _this.failure(error, callback);
        }
        return resource.destroy(function(error) {
          return _this.respondWithStatus(!!!error, callback);
        });
      });
    }
  };

  Tower.Controller.Responder = (function() {

    __defineStaticProperty(Responder,  "respond", function(controller, options, callback) {
      var responder;
      responder = new this(controller, options);
      return responder.respond(callback);
    });

    function Responder(controller, options) {
      var format, _len7, _p, _ref7;
      if (options == null) {
        options = {};
      }
      this.controller = controller;
      this.options = options;
      _ref7 = this.controller.formats;
      for (_p = 0, _len7 = _ref7.length; _p < _len7; _p++) {
        format = _ref7[_p];
        this.accept(format);
      }
    }

    __defineProperty(Responder,  "accept", function(format) {
      return this[format] = function(callback) {
        return this["_" + format] = callback;
      };
    });

    __defineProperty(Responder,  "respond", function(callback) {
      if (callback) {
        callback.call(this.controller, this);
      }
      method = this["_" + this.controller.format];
      if (method) {
        return method.call(this);
      } else {
        return this.toFormat();
      }
    });

    __defineProperty(Responder,  "_html", function() {
      return this.controller.render({
        action: this.controller.action
      });
    });

    __defineProperty(Responder,  "_json", function() {
      return this.controller.render({
        json: this.options.records
      });
    });

    __defineProperty(Responder,  "toFormat", function() {
      try {
        if ((typeof get !== "undefined" && get !== null) || !(typeof hasErrors !== "undefined" && hasErrors !== null)) {
          return this.defaultRender();
        } else {
          return this.displayErrors();
        }
      } catch (error) {
        return this._apiBehavior(error);
      }
    });

    __defineProperty(Responder,  "_navigationBehavior", function(error) {
      if (typeof get !== "undefined" && get !== null) {
        throw error;
      } else if ((typeof hasErrors !== "undefined" && hasErrors !== null) && defaultAction) {
        return this.render({
          action: this.defaultAction
        });
      } else {
        return this.redirectTo(this.navigationLocation);
      }
    });

    __defineProperty(Responder,  "_apiBehavior", function(error) {
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
    });

    __defineProperty(Responder,  "isResourceful", function() {
      return this.resource.hasOwnProperty("to" + (this.format.toUpperCase()));
    });

    __defineProperty(Responder,  "resourceLocation", function() {
      return this.options.location || this.resources;
    });

    __defineProperty(Responder,  "defaultRender", function() {
      return this.defaultResponse.call(options);
    });

    __defineProperty(Responder,  "display", function(resource, givenOptions) {
      if (givenOptions == null) {
        givenOptions = {};
      }
      return this.controller.render(_.extend(givenOptions, this.options, {
        format: this.resource
      }));
    });

    __defineProperty(Responder,  "displayErrors", function() {
      return this.controller.render({
        format: this.resourceErrors,
        status: "unprocessableEntity"
      });
    });

    __defineProperty(Responder,  "hasErrors", function() {
      var _base;
      return (typeof (_base = this.resource).respondTo === "function" ? _base.respondTo("errors") : void 0) && !(this.resource.errors.empty != null);
    });

    __defineProperty(Responder,  "defaultAction", function() {
      return this.action || (this.action = ACTIONS_FOR_VERBS[request.requestMethodSymbol]);
    });

    __defineProperty(Responder,  "resourceErrors", function() {
      if (this.hasOwnProperty("" + format + "ResourceErrors")) {
        return this["" + format + "RresourceErrors"];
      } else {
        return this.resource.errors;
      }
    });

    __defineProperty(Responder,  "jsonResourceErrors", function() {
      return {
        errors: this.resource.errors
      };
    });

    return Responder;

  })();

  Tower.Controller.Responding = {
    ClassMethods: {
      respondTo: function() {
        var args, except, mimes, name, only, options, _len7, _p;
        mimes = this.mimes();
        args = _.args(arguments);
        if (typeof args[args.length - 1] === "object") {
          options = args.pop();
        } else {
          options = {};
        }
        if (options.only) {
          only = _.toArray(options.only);
        }
        if (options.except) {
          except = _.toArray(options.except);
        }
        for (_p = 0, _len7 = args.length; _p < _len7; _p++) {
          name = args[_p];
          mimes[name] = {};
          if (only) {
            mimes[name].only = only;
          }
          if (except) {
            mimes[name].except = except;
          }
        }
        return this;
      },
      mimes: function() {
        return this.metadata().mimes;
      }
    },
    InstanceMethods: {
      respondTo: function(block) {
        return Tower.Controller.Responder.respond(this, {}, block);
      },
      respondWith: function() {
        var args, callback, options;
        args = _.args(arguments);
        callback = null;
        if (typeof args[args.length - 1] === "function") {
          callback = args.pop();
        }
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
        var config, mime, mimes, result, success;
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
          if (success) {
            result.push(mime);
          }
        }
        return result;
      }
    }
  };

  Tower.Controller.include(Tower.Controller.Callbacks);

  Tower.Controller.include(Tower.Controller.Errors);

  Tower.Controller.include(Tower.Controller.Helpers);

  Tower.Controller.include(Tower.Controller.Instrumentation);

  Tower.Controller.include(Tower.Controller.Metadata);

  Tower.Controller.include(Tower.Controller.Params);

  Tower.Controller.include(Tower.Controller.Redirecting);

  Tower.Controller.include(Tower.Controller.Rendering);

  Tower.Controller.include(Tower.Controller.Resourceful);

  Tower.Controller.include(Tower.Controller.Responding);

  Tower.Controller.Elements = {
    ClassMethods: {
      extractElements: function(target, options) {
        var key, method, result, selector, selectors;
        if (options == null) {
          options = {};
        }
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
        if (options == null) {
          options = {};
        }
        return this.elements = this.extractElements(target, options);
      },
      clickHandler: function(name, handler, options) {
        var _this = this;
        return $(this.dispatcher).on(name, options.target, function(event) {
          return _this._dispatch(event, handler);
        });
      },
      submitHandler: function(name, handler, options) {
        var _this = this;
        return $(this.dispatcher).on(name, options.target, function(event) {
          var elements, form, params, target;
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
            _this._dispatch(event, handler, {
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
        var attribute, element, errors, field, _ref7, _results;
        element = $("#" + this.resourceName + "-" + this.elementName);
        _ref7 = this.resource.errors;
        _results = [];
        for (attribute in _ref7) {
          errors = _ref7[attribute];
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
        return Tower.Support.String.pluralize(Tower.Support.String.camelize(this.className().replace(/(Controller)$/, ""), false));
      },
      addSocketEventHandler: function(name, handler, options) {
        var _this = this;
        this.io || (this.io = Tower.Application.instance().io.connect("/" + this.socketNamespace()));
        return this.io.on(name, function(data) {
          return _this._dispatch(_this.io, handler, {
            params: data
          });
        });
      },
      addDomEventHandler: function(name, handler, options) {
        var eventType, parts, selector,
          _this = this;
        parts = name.split(/\ +/);
        name = parts.shift();
        selector = parts.join(" ");
        if (selector && selector !== "") {
          options.target = selector;
        }
        options.target || (options.target = "body");
        eventType = name.split(/[\.:]/)[0];
        method = this["" + eventType + "Handler"];
        if (method) {
          method.call(this, name, handler, options);
        } else {
          $(this.dispatcher).on(name, options.target, function(event) {
            return _this._dispatch(event, handler, options);
          });
        }
        return this;
      },
      _dispatch: function(event, handler, options) {
        var controller;
        if (options == null) {
          options = {};
        }
        controller = this.instance();
        controller.elements || (controller.elements = {});
        controller.params || (controller.params = {});
        if (options.params) {
          _.extend(controller.params, options.params);
        }
        if (options.elements) {
          _.extend(controller.elements, options.elements);
        }
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
          var elements, form, params, target;
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
    var array, coerce_types, cur, i, index, item, keys, keys_last, obj, param, val, _len7, _p;
    obj = {};
    coerce_types = {
      "true": !0,
      "false": !1,
      "null": null
    };
    array = params.replace(/\+/g, " ").split("&");
    for (index = _p = 0, _len7 = array.length; _p < _len7; index = ++_p) {
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
        if (key) {
          obj[key] = (coerce ? undefined : "");
        }
      }
    }
    return obj;
  };

  Tower.HTTP = {};

  Tower.HTTP.Agent = (function() {

    function Agent(attributes) {
      if (attributes == null) {
        attributes = {};
      }
      _.extend(this, attributes);
    }

    __defineProperty(Agent,  "toJSON", function() {
      return {
        family: this.family,
        major: this.major,
        minor: this.minor,
        patch: this.patch,
        version: this.version,
        os: this.os,
        name: this.name
      };
    });

    return Agent;

  })();

  Tower.HTTP.Cookies = (function() {

    __defineStaticProperty(Cookies,  "parse", function(string) {
      var eqlIndex, pair, pairs, result, value, _len7, _p;
      if (string == null) {
        string = document.cookie;
      }
      result = {};
      pairs = string.split(/[;,] */);
      for (_p = 0, _len7 = pairs.length; _p < _len7; _p++) {
        pair = pairs[_p];
        eqlIndex = pair.indexOf('=');
        key = pair.substring(0, eqlIndex).trim().toLowerCase();
        value = pair.substring(++eqlIndex, pair.length).trim();
        if ('"' === value[0]) {
          value = value.slice(1, -1);
        }
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
    });

    function Cookies(attributes) {
      var key, value;
      if (attributes == null) {
        attributes = {};
      }
      for (key in attributes) {
        value = attributes[key];
        this[key] = value;
      }
    }

    return Cookies;

  })();

  Tower.HTTP.Param = (function() {

    __defineStaticProperty(Param,  "perPage", 20);

    __defineStaticProperty(Param,  "sortDirection", "ASC");

    __defineStaticProperty(Param,  "sortKey", "sort");

    __defineStaticProperty(Param,  "limitKey", "limit");

    __defineStaticProperty(Param,  "pageKey", "page");

    __defineStaticProperty(Param,  "separator", "_");

    __defineStaticProperty(Param,  "create", function(key, options) {
      if (options == null) {
        options = {};
      }
      if (typeof options === "string") {
        options = {
          type: options
        };
      }
      options.type || (options.type = "String");
      return new Tower.HTTP.Param[options.type](key, options);
    });

    function Param(key, options) {
      if (options == null) {
        options = {};
      }
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

    __defineProperty(Param,  "parse", function(value) {
      return value;
    });

    __defineProperty(Param,  "render", function(value) {
      return value;
    });

    __defineProperty(Param,  "toCursor", function(value) {
      var attribute, conditions, criteria, node, nodes, operator, set, _len7, _len8, _p, _q;
      nodes = this.parse(value);
      criteria = Tower.Model.Cursor.create();
      criteria.make();
      for (_p = 0, _len7 = nodes.length; _p < _len7; _p++) {
        set = nodes[_p];
        for (_q = 0, _len8 = set.length; _q < _len8; _q++) {
          node = set[_q];
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
    });

    __defineProperty(Param,  "parseValue", function(value, operators) {
      return {
        namespace: this.namespace,
        key: this.key,
        operators: operators,
        value: value,
        attribute: this.attribute
      };
    });

    __defineProperty(Param,  "_clean", function(string) {
      return string.replace(/^-/, "").replace(/^\+-/, "").replace(/^'|'$/, "").replace("+", " ").replace(/^\^/, "").replace(/\$$/, "").replace(/^\s+|\s+$/, "");
    });

    return Param;

  })();

  Tower.HTTP.Param.Array = (function(_super) {
    var Array;

    function Array() {
      return Array.__super__.constructor.apply(this, arguments);
    }

    Array = __extends(Array, _super);

    __defineProperty(Array,  "parse", function(value) {
      var array, isSet, negated, negatedSet, operators, set, string, token, tokens, values, _len7, _len8, _p, _q;
      values = [];
      array = value.toString().split(/(-?\[[^\]]+\]|-?\w+)/g);
      for (_p = 0, _len7 = array.length; _p < _len7; _p++) {
        string = array[_p];
        negatedSet = false;
        isSet = false;
        if (_.isBlank(string)) {
          continue;
        }
        string = string.replace(/^(-)/, function(_, $1) {
          negatedSet = !!($1 && $1.length > 0);
          return "";
        });
        string = string.replace(/([\[\]])/g, function(_, $1) {
          isSet = !!($1 && $1.length > 0);
          return "";
        });
        if (_.isBlank(string)) {
          continue;
        }
        tokens = string.split(/,/g);
        set = [];
        for (_q = 0, _len8 = tokens.length; _q < _len8; _q++) {
          token = tokens[_q];
          negated = false;
          token = token.replace(/^(-)/, function(_, $1) {
            negated = !!($1 && $1.length > 0);
            return "";
          });
          if (_.isBlank(token)) {
            continue;
          }
          if (isSet) {
            operators = [negated || negatedSet ? '$notInAll' : '$allIn'];
          } else {
            operators = [negated || negatedSet ? '$notInAny' : '$anyIn'];
          }
          set.push(this.parseValue([token], operators));
        }
        values.push(set);
      }
      return values;
    });

    return Array;

  })(Tower.HTTP.Param);

  Tower.HTTP.Param.Date = (function(_super) {
    var Date;

    function Date() {
      return Date.__super__.constructor.apply(this, arguments);
    }

    Date = __extends(Date, _super);

    __defineProperty(Date,  "parse", function(value) {
      var array, isRange, string, values, _len7, _p,
        _this = this;
      values = [];
      array = value.toString().split(/[\s,\+]/);
      for (_p = 0, _len7 = array.length; _p < _len7; _p++) {
        string = array[_p];
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
        if (!isRange) {
          values.push([this.parseValue(string, ["$eq"])]);
        }
      }
      return values;
    });

    __defineProperty(Date,  "parseValue", function(value, operators) {
      return Date.__super__[ "parseValue"].call(this, _.toDate(value), operators);
    });

    return Date;

  })(Tower.HTTP.Param);

  Tower.HTTP.Param.Number = (function(_super) {
    var Number;

    function Number() {
      return Number.__super__.constructor.apply(this, arguments);
    }

    Number = __extends(Number, _super);

    __defineProperty(Number,  "parse", function(value) {
      var array, isRange, negation, string, values, _len7, _p,
        _this = this;
      values = [];
      array = value.toString().split(/[,\|]/);
      for (_p = 0, _len7 = array.length; _p < _len7; _p++) {
        string = array[_p];
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
        if (!isRange) {
          values.push([this.parseValue(string, ["$eq"])]);
        }
      }
      return values;
    });

    __defineProperty(Number,  "parseValue", function(value, operators) {
      return Number.__super__[ "parseValue"].call(this, parseFloat(value), operators);
    });

    return Number;

  })(Tower.HTTP.Param);

  Tower.HTTP.Param.String = (function(_super) {
    var String;

    function String() {
      return String.__super__.constructor.apply(this, arguments);
    }

    String = __extends(String, _super);

    __defineProperty(String,  "parse", function(value) {
      var arrays, i, node, values, _len7, _p,
        _this = this;
      arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/g);
      for (i = _p = 0, _len7 = arrays.length; _p < _len7; i = ++_p) {
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
          if (!!token.match(/^\+?\-?\^/)) {
            operators.push("^");
          }
          if (!!token.match(/\$$/)) {
            operators.push("$");
          }
          values.push(_this.parseValue([_this._clean(token)], operators));
          return _;
        });
        arrays[i] = values;
      }
      return arrays;
    });

    return String;

  })(Tower.HTTP.Param);

  Tower.HTTP.Route = (function(_super) {
    var Route;

    function Route() {
      return Route.__super__.constructor.apply(this, arguments);
    }

    Route = __extends(Route, _super);

    __defineStaticProperty(Route,  "store", function() {
      return this._store || (this._store = []);
    });

    __defineStaticProperty(Route,  "byName", {});

    __defineStaticProperty(Route,  "create", function(route) {
      this.byName[route.name] = route;
      return this.store().push(route);
    });

    __defineStaticProperty(Route,  "find", function(name) {
      return this.byName[name];
    });

    __defineStaticProperty(Route,  "findByControllerOptions", function(options) {
      var controller, key, route, success, value, _len7, _p, _ref7;
      _ref7 = this.all();
      for (_p = 0, _len7 = _ref7.length; _p < _len7; _p++) {
        route = _ref7[_p];
        controller = route.controller;
        success = true;
        for (key in options) {
          value = options[key];
          success = controller[key] === value;
          if (!success) {
            break;
          }
        }
        if (success) {
          return route;
        }
      }
      return null;
    });

    __defineStaticProperty(Route,  "all", function() {
      return this.store();
    });

    __defineStaticProperty(Route,  "clear", function() {
      return this._store = [];
    });

    __defineStaticProperty(Route,  "reload", function() {
      this.clear();
      return this.draw();
    });

    __defineStaticProperty(Route,  "draw", function(callback) {
      this._defaultCallback || (this._defaultCallback = callback);
      if (!callback) {
        callback = this._defaultCallback;
      }
      return callback.apply(new Tower.HTTP.Route.DSL(this));
    });

    __defineStaticProperty(Route,  "findController", function(request, response, callback) {
      var controller, route, routes, _len7, _p;
      routes = Tower.Route.all();
      for (_p = 0, _len7 = routes.length; _p < _len7; _p++) {
        route = routes[_p];
        controller = route.toController(request);
        if (controller) {
          break;
        }
      }
      if (controller) {
        controller.call(request, response, function() {
          return callback(controller);
        });
      } else {
        callback(null);
      }
      return controller;
    });

    __defineProperty(Route,  "toController", function(request) {
      var capture, controller, i, keys, match, params, _len7, _p;
      match = this.match(request);
      if (!match) {
        return null;
      }
      method = request.method.toLowerCase();
      keys = this.keys;
      params = _.extend({}, this.defaults, request.query || {}, request.body || {});
      match = match.slice(1);
      for (i = _p = 0, _len7 = match.length; _p < _len7; i = ++_p) {
        capture = match[i];
        key = keys[i].name;
        if (capture && !(params[key] != null)) {
          capture = decodeURIComponent(capture);
          try {
            params[key] = JSON.parse(capture);
          } catch (error) {
            params[key] = capture;
          }
        }
      }
      controller = this.controller;
      if (controller) {
        params.action = controller.action;
      }
      request.params = params;
      if (controller) {
        controller = Tower.constant(Tower.namespaced(this.controller.className)).create();
      }
      return controller;
    });

    __defineProperty(Route,  "init", function(options) {
      options || (options = options);
      this.path = options.path;
      this.name = options.name;
      this.methods = _.map(_.castArray(options.method || "GET"), function(i) {
        return i.toUpperCase();
      });
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
      return this._super();
    });

    __defineProperty(Route,  "get", function(name) {
      return this[name];
    });

    __defineProperty(Route,  "match", function(requestOrPath) {
      var match, path;
      if (typeof requestOrPath === "string") {
        return this.pattern.exec(requestOrPath);
      }
      path = requestOrPath.location.path;
      if (!(_.indexOf(this.methods, requestOrPath.method.toUpperCase()) > -1)) {
        return null;
      }
      match = this.pattern.exec(path);
      if (!match) {
        return null;
      }
      if (!this.matchConstraints(requestOrPath)) {
        return null;
      }
      return match;
    });

    __defineProperty(Route,  "matchConstraints", function(request) {
      var constraints, key, value;
      constraints = this.constraints;
      switch (typeof constraints) {
        case "object":
          for (key in constraints) {
            value = constraints[key];
            switch (typeof value) {
              case "string":
              case "number":
                if (request[key] !== value) {
                  return false;
                }
                break;
              case "function":
              case "object":
                if (!request.location[key].match(value)) {
                  return false;
                }
            }
          }
          break;
        case "function":
          return constraints.call(request, request);
        default:
          return false;
      }
      return true;
    });

    __defineProperty(Route,  "urlFor", function(options) {
      var key, result, value;
      if (options == null) {
        options = {};
      }
      result = this.path;
      for (key in options) {
        value = options[key];
        result = result.replace(new RegExp(":" + key + "\\??", "g"), value);
      }
      result = result.replace(new RegExp("\\.?:\\w+\\??", "g"), "");
      return result;
    });

    __defineProperty(Route,  "extractPattern", function(path, caseSensitive, strict) {
      var self;
      if (path instanceof RegExp) {
        return path;
      }
      self = this;
      if (path === "/") {
        return new RegExp('^' + path + '$');
      }
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
        if (!optional || !splat) {
          result += slash;
        }
        result += "(?:";
        if (format != null) {
          result += splat ? "\\.([^.]+?)" : "\\.([^/.]+?)";
        } else {
          result += splat ? "/?(.+)" : "([^/\\.]+)";
        }
        result += ")";
        if (optional) {
          result += "?";
        }
        return result;
      });
      return new RegExp('^' + path + '$', !!caseSensitive ? '' : 'i');
    });

    return Route;

  })(Tower.Class);

  Tower.Route = Tower.HTTP.Route;

  Tower.HTTP.Route.DSL = (function() {

    function DSL() {
      this._scope = {};
    }

    __defineProperty(DSL,  "match", function() {
      this.scope || (this.scope = {});
      return Tower.HTTP.Route.create(new Tower.HTTP.Route(this._extractOptions.apply(this, arguments)));
    });

    __defineProperty(DSL,  "get", function() {
      return this.matchMethod("get", _.args(arguments));
    });

    __defineProperty(DSL,  "post", function() {
      return this.matchMethod("post", _.args(arguments));
    });

    __defineProperty(DSL,  "put", function() {
      return this.matchMethod("put", _.args(arguments));
    });

    __defineProperty(DSL,  "delete", function() {
      return this.matchMethod("delete", _.args(arguments));
    });

    __defineProperty(DSL,  "matchMethod", function(method, args) {
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
      if (this._scope.path) {
        path = this._scope.path + path;
      }
      this.match(path, options);
      return this;
    });

    __defineProperty(DSL,  "scope", function(options, block) {
      var originalScope;
      if (options == null) {
        options = {};
      }
      originalScope = this._scope || (this._scope = {});
      this._scope = _.extend({}, originalScope, options);
      block.call(this);
      this._scope = originalScope;
      return this;
    });

    __defineProperty(DSL,  "controller", function(controller, options, block) {
      options.controller = controller;
      return this.scope(options, block);
    });

    __defineProperty(DSL,  "namespace", function(path, options, block) {
      if (typeof options === 'function') {
        block = options;
        options = {};
      } else {
        options = {};
      }
      options = _.extend({
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
    });

    __defineProperty(DSL,  "constraints", function(options, block) {
      return this.scope({
        constraints: options
      }, block);
    });

    __defineProperty(DSL,  "defaults", function(options, block) {
      return this.scope({
        defaults: options
      }, block);
    });

    __defineProperty(DSL,  "resource", function(name, options) {
      var path;
      if (options == null) {
        options = {};
      }
      options.controller = name;
      path = "/" + name;
      if (this._scope.path) {
        path = this._scope.path + path;
      }
      if (this._scope.name) {
        name = this._scope.name + Tower.Support.String.camelize(name);
      }
      this.match("" + path + "/new", _.extend({
        name: "new" + (Tower.Support.String.camelize(name)),
        action: "new"
      }, options));
      this.match("" + path, _.extend({
        action: "create",
        method: "POST"
      }, options));
      this.match("" + path, _.extend({
        name: name,
        action: "show"
      }, options));
      this.match("" + path + "/edit", _.extend({
        name: "edit" + (Tower.Support.String.camelize(name)),
        action: "edit"
      }, options));
      this.match("" + path, _.extend({
        action: "update",
        method: "PUT"
      }, options));
      return this.match("" + path, _.extend({
        action: "destroy",
        method: "DELETE"
      }, options));
    });

    __defineProperty(DSL,  "resources", function(name, options, callback) {
      var many, one, path;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else {
        options = {};
      }
      options.controller || (options.controller = name);
      path = "/" + name;
      if (this._scope.path) {
        path = this._scope.path + path;
      }
      if (this._scope.name) {
        many = this._scope.name + Tower.Support.String.camelize(name);
      } else {
        many = name;
      }
      one = Tower.Support.String.singularize(many);
      this.match("" + path, _.extend({
        name: "" + many,
        action: "index"
      }, options));
      this.match("" + path + "/new", _.extend({
        name: "new" + (Tower.Support.String.camelize(one)),
        action: "new"
      }, options));
      this.match("" + path, _.extend({
        action: "create",
        method: "POST"
      }, options));
      this.match("" + path + "/:id", _.extend({
        name: "" + one,
        action: "show"
      }, options));
      this.match("" + path + "/:id/edit", _.extend({
        name: "edit" + (Tower.Support.String.camelize(one)),
        action: "edit"
      }, options));
      this.match("" + path + "/:id", _.extend({
        action: "update",
        method: "PUT"
      }, options));
      this.match("" + path + "/:id", _.extend({
        action: "destroy",
        method: "DELETE"
      }, options));
      if (callback) {
        this.scope(_.extend({
          path: "" + path + "/:" + (Tower.Support.String.singularize(name)) + "Id",
          name: one
        }, options), callback);
      }
      return this;
    });

    __defineProperty(DSL,  "collection", function() {});

    __defineProperty(DSL,  "member", function() {});

    __defineProperty(DSL,  "root", function(options) {
      return this.match('/', _.extend({
        as: "root"
      }, options));
    });

    __defineProperty(DSL,  "_extractOptions", function() {
      var anchor, args, constraints, controller, defaults, format, name, options, path;
      args = _.args(arguments);
      path = "/" + args.shift().replace(/^\/|\/$/, "");
      if (typeof args[args.length - 1] === "object") {
        options = args.pop();
      } else {
        options = {};
      }
      if (args.length > 0) {
        options.to || (options.to = args.shift());
      }
      options.path = path;
      format = this._extractFormat(options);
      options.path = this._extractPath(options);
      method = this._extractRequestMethod(options);
      constraints = this._extractConstraints(options);
      defaults = this._extractDefaults(options);
      controller = this._extractController(options);
      anchor = this._extractAnchor(options);
      name = this._extractName(options);
      options = _.extend(options, {
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
    });

    __defineProperty(DSL,  "_extractFormat", function(options) {});

    __defineProperty(DSL,  "_extractName", function(options) {
      return options.as || options.name;
    });

    __defineProperty(DSL,  "_extractConstraints", function(options) {
      return _.extend(this._scope.constraints || {}, options.constraints || {});
    });

    __defineProperty(DSL,  "_extractDefaults", function(options) {
      return options.defaults || {};
    });

    __defineProperty(DSL,  "_extractPath", function(options) {
      return "" + options.path + ".:format?";
    });

    __defineProperty(DSL,  "_extractRequestMethod", function(options) {
      return options.method || options.via || "GET";
    });

    __defineProperty(DSL,  "_extractAnchor", function(options) {
      return options.anchor;
    });

    __defineProperty(DSL,  "_extractController", function(options) {
      var controller, to;
      if (options == null) {
        options = {};
      }
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
      controller = Tower.Support.String.camelize(controller).replace(/(?:[cC]ontroller)?$/, "Controller");
      return {
        name: controller,
        action: action,
        className: controller
      };
    });

    return DSL;

  })();

  Tower.HTTP.Route.Urls = {
    ClassMethods: {
      urlFor: function(options) {
        var anchor, controller, host, port;
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
      if (data == null) {
        data = {};
      }
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

    __defineProperty(Request,  "header", function() {});

    return Request;

  })();

  Tower.HTTP.Response = (function() {

    function Response(data) {
      if (data == null) {
        data = {};
      }
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

    __defineProperty(Response,  "writeHead", function(statusCode, headers) {
      this.statusCode = statusCode;
      return this.headers = headers;
    });

    __defineProperty(Response,  "setHeader", function(key, value) {
      if (this.headerSent) {
        throw new Error("Headers already sent");
      }
      return this.headers[key] = value;
    });

    __defineProperty(Response,  "write", function(body) {
      if (body == null) {
        body = '';
      }
      return this.body += body;
    });

    __defineProperty(Response,  "end", function(body) {
      if (body == null) {
        body = '';
      }
      this.body += body;
      this.sent = true;
      return this.headerSent = true;
    });

    __defineProperty(Response,  "redirect", function(path, options) {
      if (options == null) {
        options = {};
      }
      if (global.History) {
        return global.History.push(options, null, path);
      }
    });

    return Response;

  })();

  Tower.HTTP.Url = (function() {

    __defineStaticProperty(Url,  "key", ["source", "protocol", "host", "userInfo", "user", "password", "hostname", "port", "relative", "path", "directory", "file", "query", "fragment"]);

    __defineStaticProperty(Url,  "aliases", {
      anchor: "fragment"
    });

    __defineStaticProperty(Url,  "parser", {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    });

    __defineStaticProperty(Url,  "querystringParser", /(?:^|&|;)([^&=;]*)=?([^&;]*)/g);

    __defineStaticProperty(Url,  "fragmentParser", /(?:^|&|;)([^&=;]*)=?([^&;]*)/g);

    __defineStaticProperty(Url,  "typeParser", /(youtube|vimeo|eventbrite)/);

    __defineProperty(Url,  "parse", function(string) {
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
        if ($1) {
          return params[$1] = $2;
        }
      });
      attributes["fragment"].replace(this.constructor.fragmentParser, function($0, $1, $2) {
        if ($1) {
          return fragment.params[$1] = $2;
        }
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
      if (this.port != null) {
        return this.port = parseInt(this.port);
      }
    });

    function Url(url, depth, strictMode) {
      if (depth == null) {
        depth = 1;
      }
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
    attributes = _.extend(require('useragent').is(request.headers['user-agent']), {
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
    if (next) {
      return next();
    }
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
        if (Tower.env === "test") {
          Tower.Controller.testCase = controller;
        }
        if (response.statusCode !== 302) {
          response.controller = controller;
          response.writeHead(controller.status, controller.headers);
          response.write(controller.body);
          response.end();
          return controller.clear();
        }
      } else {
        return Tower.Middleware.Router.error(request, response);
      }
    });
    return response;
  };

  _.extend(Tower.Middleware.Router, {
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
