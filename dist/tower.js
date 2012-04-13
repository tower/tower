/*!
 * Tower.js v0.4.0-3
 * http://towerjs.org/
 *
 * Copyright 2012, Lance Pollard
 * MIT License.
 * http://towerjs.org/license
 *
 * Date: Fri, 13 Apr 2012 03:05:19 GMT
 */
(function() {
  var Tower, action, key, module, phase, specialProperties, _fn, _fn2, _fn3, _fn4, _fn5, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _m, _n, _ref, _ref2, _ref3, _ref4, _ref5, _ref6,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = Array.prototype.slice,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    _this = this;

  window.global || (window.global = window);

  module = global.module || {};

  global.Tower = Tower = {};

  Tower.version = "0.4.0-3";

  Tower.logger = console;

  Tower.modules = {
    validator: global,
    accounting: global.accounting,
    moment: global.moment,
    geo: global.geolib,
    inflector: global.inflector,
    async: global.async
  };

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
    modules: function(object) {
      var args, key, node, value, _i, _len;
      args = _.args(arguments, 1);
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
      var i, item, result, _len;
      result = value.concat();
      for (i = 0, _len = result.length; i < _len; i++) {
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
          if (!(__indexOf.call(specialProperties, key) < 0)) continue;
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
      if (options == null) options = {};
      return Object.defineProperty(object, key, options);
    },
    functionName: function(fn) {
      var _ref;
      if (fn.__name__) return fn.__name__;
      if (fn.name) return fn.name;
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
      var key, type, value;
      type = typeof object;
      if (type === "string") return object === "";
      if (type === "object") {
        for (key in object) {
          value = object[key];
          return false;
        }
        return true;
      }
      if (object === null || object === void 0) return true;
      return false;
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
        if (from[property] !== void 0) to[property] = from[property];
      }
      return to;
    },
    moveProperties: function(to, from) {
      var properties, property, _i, _len;
      properties = _.args(arguments, 2);
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        property = properties[_i];
        if (from[property] !== void 0) to[property] = from[property];
        delete from[property];
      }
      return to;
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
    },
    grep: function(object, regex, iterator, context) {
      var found;
      regex = _.isRegExp(regex) ? regex : RegExp(String(regex).replace(/([{.(|}:)$+?=^*!\/[\]\\])/g, "\\$1"));
      found = _.select(object, function(s) {
        return regex.test(s);
      }, context);
      if (iterator) return _.map(found, iterator, context);
      return found;
    }
  };

  Tower.Support.String.toQueryValue = function(value, negate) {
    var item, items, result, _i, _len;
    if (negate == null) negate = "";
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
      if (_.isHash(value)) {
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
    if (!_.isBlank(params)) {
      result += "?" + (Tower.Support.String.toQuery(params, schema));
    }
    if (options.anchor) {
      result += "#" + (Tower.Support.String.toQuery(options.anchor));
    }
    return result;
  };

  Tower.urlFor = function() {
    var args, item, last, options, result, route, _i, _len;
    args = _.args(arguments);
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
    if (options.route) {
      route = Tower.Route.find(options.route);
      if (route) result = route.urlFor();
    } else if (options.controller && options.action) {
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
        conditions.only = _.castArray(conditions.only);
      }
      if (conditions.hasOwnProperty("except")) {
        conditions.except = _.castArray(conditions.except);
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
      extended = object.extended;
      delete object.extended;
      this.mixin(this, object);
      if (extended) extended.apply(object);
      return object;
    };

    Class.self = Class.extend;

    Class.include = function(object) {
      var included;
      included = object.included;
      delete object.included;
      if (object.hasOwnProperty("ClassMethods")) this.extend(object.ClassMethods);
      if (object.hasOwnProperty("InstanceMethods")) {
        this.include(object.InstanceMethods);
      }
      this.mixin(this.prototype, object);
      if (included) included.apply(object);
      return object;
    };

    Class.className = function() {
      return _.functionName(this);
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
      if (language == null) language = this.defaultLanguage;
      store = this.store();
      language = store[language] || (store[language] = {});
      _.deepMerge(language, typeof pathOrObject === "string" ? require(pathOrObject) : pathOrObject);
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
        if (time._wrapped) time = time.value();
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
        if (as == null) as = 'days';
        if (from._wrapped) from = from.value();
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
        if (!result._errors.length) return true;
        return false;
      },
      isUUID: function(value) {
        var result;
        try {
          result = check(value).isUUID();
        } catch (_error) {}
        if (!result._errors.length) return true;
        return result;
      },
      isAccept: function(value, param) {
        param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";
        return !!value.match(new RegExp(".(" + param + ")$", "i"));
      },
      isPhone: function(value, options) {
        var pattern;
        if (options == null) options = {};
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
        if (!value) return false;
        number = value.toString().replace(/\D/g, "");
        length = number.length;
        parity = length % 2;
        total = 0;
        i = 0;
        while (i < length) {
          digit = number.charAt(i);
          if (i % 2 === parity) {
            digit *= 2;
            if (digit > 9) digit -= 9;
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
        if (country == null) country = 'us';
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
        var _ref2;
        return (_ref2 = Tower.modules.async).series.apply(_ref2, arguments);
      },
      parallel: function() {
        var _ref2;
        return (_ref2 = Tower.modules.async).parallel.apply(_ref2, arguments);
      }
    };
    _.mixin(casting);
    _.mixin(sanitizing);
    _.mixin(inflections);
    _.mixin(validating);
    return _.mixin(asyncing);
  })();

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

  _.extend(Tower, {
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
      location = new Tower.HTTP.Url(url);
      request = new Tower.HTTP.Request({
        url: url,
        location: location,
        method: method
      });
      response = new Tower.HTTP.Response({
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
      string = _.args(arguments).join("_");
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
      return _.none(value);
    },
    oneOrMany: function() {
      return _.oneOrMany.apply(_, arguments);
    },
    args: function(args) {
      return _.args(args);
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

    Application.before('initialize', 'setDefaults');

    Application.prototype.setDefaults = function() {
      Tower.Model["default"]("store", Tower.Store.Ajax);
      Tower.Model.field("id", {
        type: "Id"
      });
      return true;
    };

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
      this.setDefaults();
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
    };

    Application.prototype.extractAgent = function() {
      Tower.cookies = Tower.HTTP.Cookies.parse();
      return Tower.agent = new Tower.HTTP.Agent(JSON.parse(Tower.cookies["user-agent"] || '{}'));
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
      "$pop": "$pop",
      "$addToSet": "$addToSet"
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

    Store.prototype.addIndex = function(name, options) {};

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

    Store.prototype.runBeforeCreate = function(criteria, callback) {
      return callback();
    };

    Store.prototype.runAfterCreate = function(criteria, callback) {
      return callback();
    };

    Store.prototype.runBeforeUpdate = function(criteria, callback) {
      if (criteria.throughRelation) {
        return criteria.appendThroughConditions(callback);
      } else {
        return callback();
      }
    };

    Store.prototype.runAfterUpdate = function(criteria, callback) {
      return callback();
    };

    Store.prototype.runBeforeDestroy = function(criteria, callback) {
      if (criteria.throughRelation) {
        return criteria.appendThroughConditions(callback);
      } else {
        return callback();
      }
    };

    Store.prototype.runAfterDestroy = function(criteria, callback) {
      return callback();
    };

    Store.prototype.runBeforeFind = function(criteria, callback) {
      if (criteria.throughRelation) {
        return criteria.appendThroughConditions(callback);
      } else {
        return callback();
      }
    };

    Store.prototype.runAfterFind = function(criteria, callback) {
      return callback();
    };

    return Store;

  })(Tower.Class);

  Tower.Store.Memory = (function(_super) {

    __extends(Memory, _super);

    Memory.stores = function() {
      return this._stores || (this._stores = []);
    };

    Memory.clean = function(callback) {
      var store, stores, _i, _len;
      stores = this.stores();
      for (_i = 0, _len = stores.length; _i < _len; _i++) {
        store = stores[_i];
        store.clean();
      }
      return callback();
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

    Memory.prototype.clean = function() {
      this.records = {};
      return this.lastId = 0;
    };

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
        sort = options.get('order');
        limit = options.get('limit');
        startIndex = options.get('offset') || 0;
        for (key in records) {
          record = records[key];
          if (this.matches(record, conditions)) result.push(record);
        }
        if (sort.length) result = this.sort(result, sort);
        endIndex = startIndex + (limit || result.length) - 1;
        result = result.slice(startIndex, endIndex + 1 || 9e9);
      } else {
        for (key in records) {
          record = records[key];
          result.push(record);
        }
      }
      if (callback) result = callback.call(this, null, result);
      return result;
    },
    findOne: function(criteria, callback) {
      var record,
        _this = this;
      record = void 0;
      criteria.limit(1);
      this.find(criteria, function(error, records) {
        record = records[0] || null;
        if (callback) return callback.call(_this, error, record);
      });
      return record;
    },
    count: function(criteria, callback) {
      var result,
        _this = this;
      result = void 0;
      this.find(criteria, function(error, records) {
        result = records.length;
        if (callback) return callback.call(_this, error, result);
      });
      return result;
    },
    exists: function(criteria, callback) {
      var result,
        _this = this;
      result = void 0;
      this.count(criteria, function(error, record) {
        result = !!record;
        if (callback) return callback.call(_this, error, result);
      });
      return result;
    },
    sort: function(records, sortings) {
      return _.sortBy.apply(_, [records].concat(__slice.call(sortings)));
    },
    matches: function(record, query) {
      var key, recordValue, schema, self, success, value;
      self = this;
      success = true;
      schema = this.schema();
      for (key in query) {
        value = query[key];
        recordValue = record.get(key);
        if (_.isRegExp(value)) {
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
      records = _.castArray(data);
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
    create: function(criteria, callback) {
      var object, result, _i, _len, _ref;
      result = [];
      _ref = criteria.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        result.push(this.createOne(object));
      }
      result = criteria["export"](result);
      if (callback) callback.call(this, null, result);
      return result;
    },
    createOne: function(record) {
      var attributes;
      attributes = this.deserializeModel(record);
      if (attributes.id == null) attributes.id = this.generateId();
      return this.loadOne(this.serializeModel(record));
    },
    update: function(updates, criteria, callback) {
      var _this = this;
      return this.find(criteria, function(error, records) {
        var record, _i, _len;
        if (error) return _.error(error, callback);
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          _this.updateOne(record, updates);
        }
        if (callback) callback.call(_this, error, records);
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
        if (error) return _.error(error, callback);
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
      return (this.lastId++).toString();
    },
    _updateAttribute: function(attributes, key, value) {
      var field;
      field = this.schema()[key];
      if (field && field.type === "Array" && !_.isArray(value)) {
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
    _pushAllAtomicUpdate: function(attributes, value) {
      var _key, _value;
      for (_key in value) {
        _value = value[_key];
        attributes[_key] || (attributes[_key] = []);
        attributes[_key].concat(_.castArray(_value));
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
    _pullAllAtomicUpdate: function(attributes, value) {
      var item, _attributeValue, _i, _key, _len, _value;
      return attributes;
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
    },
    _addToSetAtomicUpdate: function(attributes, value) {
      var attributeValue, item, _i, _key, _len, _ref, _value;
      for (_key in value) {
        _value = value[_key];
        attributeValue = attributes[_key] || (attributes[_key] = []);
        if (_value && _value.hasOwnProperty("$each")) {
          _ref = _value.$each;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (attributeValue.indexOf(item) === -1) attributeValue.push(item);
          }
        } else {
          if (attributeValue.indexOf(_value) === -1) attributeValue.push(_value);
        }
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

    Ajax.toJSON = function(record, method, format) {
      var data;
      data = {};
      data[Tower.Support.String.camelize(record.constructor.name, true)] = record;
      data._method = method;
      data.format = format;
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
          if (data && !_.isBlank(data)) {
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

    Ajax.prototype.create = function(criteria, callback) {
      var _this = this;
      if (criteria.sync !== false) {
        return Ajax.__super__.create.call(this, criteria, function(error, records) {
          if (callback) callback.call(_this, error, records);
          return _this.createRequest(records, options);
        });
      } else {
        return Ajax.__super__.create.apply(this, arguments);
      }
    };

    Ajax.prototype.update = function(updates, criteria, callback) {
      var _this = this;
      if (criteria.sync === true) {
        return Ajax.__super__.update.call(this, updates, criteria, function(error, result) {
          if (callback) callback.call(_this, error, result);
          return _this.updateRequest(result, options);
        });
      } else {
        return Ajax.__super__.update.apply(this, arguments);
      }
    };

    Ajax.prototype.destroy = function(criteria, callback) {
      var _this = this;
      if (criteria.sync !== false) {
        return Ajax.__super__.destroy.call(this, criteria, function(error, result) {
          _this.destroyRequest(result, criteria);
          if (callback) return callback.call(_this, error, result);
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

    Ajax.prototype.destroyRequest = function(record, criteria) {
      var _this = this;
      return this.queue(function() {
        var params, url;
        if (_.isArray(record)) record = record[0];
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
        if (_.isPresent(data)) return _this.load(data);
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

    function Model(attributes, options) {
      this.initialize(attributes, options);
    }

    Model.prototype.initialize = function(attrs, options) {
      var attributes, definition, definitions, key, name, value, _results;
      if (attrs == null) attrs = {};
      if (options == null) options = {};
      definitions = this.constructor.fields();
      attributes = {};
      for (name in definitions) {
        definition = definitions[name];
        attributes[name] = definition.defaultValue(this);
      }
      if (this.constructor.isSubClass()) {
        attributes.type || (attributes.type = this.constructor.name);
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
        _results.push(this.set(key, value));
      }
      return _results;
    };

    return Model;

  })(Tower.Class);

  Tower.Model.Scope = (function(_super) {

    __extends(Scope, _super);

    Scope.finderMethods = ["find", "all", "first", "last", "count", "exists", "instantiate", "pluck"];

    Scope.persistenceMethods = ["create", "update", "destroy", "build"];

    Scope.queryMethods = ["where", "order", "sort", "asc", "desc", "gte", "gt", "lte", "lt", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "page", "allIn", "allOf", "alsoIn", "anyIn", "anyOf", "notIn", "near", "within"];

    Scope.queryOperators = {
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
    };

    function Scope(criteria) {
      this.criteria = criteria;
    }

    Scope.prototype.has = function(object) {
      return this.criteria.has(object);
    };

    Scope.prototype.build = function() {
      var args, callback, criteria;
      criteria = this.compile();
      args = _.args(arguments);
      callback = _.extractBlock(args);
      criteria.addData(args);
      return criteria.build(callback);
    };

    Scope.prototype.create = function() {
      var args, callback, criteria;
      criteria = this.compile();
      args = _.args(arguments);
      callback = _.extractBlock(args);
      criteria.addData(args);
      return criteria.create(callback);
    };

    Scope.prototype.update = function() {
      var args, callback, criteria, updates;
      criteria = this.compile();
      args = _.flatten(_.args(arguments));
      callback = _.extractBlock(args);
      updates = args.pop();
      if (!(updates && typeof updates === "object")) {
        throw new Error("Must pass in updates hash");
      }
      criteria.addData(updates);
      criteria.addIds(args);
      return criteria.update(callback);
    };

    Scope.prototype.destroy = function() {
      var args, callback, criteria;
      criteria = this.compile();
      args = _.flatten(_.args(arguments));
      callback = _.extractBlock(args);
      criteria.addIds(args);
      return criteria.destroy(callback);
    };

    Scope.prototype.add = function() {
      var args, callback, criteria;
      criteria = this.compile();
      args = _.args(arguments);
      callback = _.extractBlock(args);
      criteria.addData(args);
      return criteria.add(callback);
    };

    Scope.prototype.remove = function() {
      var args, callback, criteria;
      criteria = this.compile();
      args = _.flatten(_.args(arguments));
      callback = _.extractBlock(args);
      criteria.addIds(args);
      return criteria.remove(callback);
    };

    Scope.prototype.find = function() {
      var args, callback, criteria;
      criteria = this.compile();
      args = _.flatten(_.args(arguments));
      callback = _.extractBlock(args);
      criteria.addIds(args);
      return criteria.find(callback);
    };

    Scope.prototype.first = function(callback) {
      var criteria;
      criteria = this.compile();
      return criteria.findOne(callback);
    };

    Scope.prototype.last = function(callback) {
      var criteria;
      criteria = this.compile();
      criteria.reverseSort();
      return criteria.findOne(callback);
    };

    Scope.prototype.all = function(callback) {
      return this.compile().find(callback);
    };

    Scope.prototype.pluck = function() {
      var attributes;
      attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.compile().find(callback);
    };

    Scope.prototype.explain = function() {
      return this.compile().explain(callback);
    };

    Scope.prototype.count = function(callback) {
      return this.compile().count(callback);
    };

    Scope.prototype.exists = function(callback) {
      return this.compile().exists(callback);
    };

    Scope.prototype.batch = function() {
      return this;
    };

    Scope.prototype.fetch = function() {};

    Scope.prototype.options = function(options) {
      return _.extend(this.criteria.options, options);
    };

    Scope.prototype.compile = function() {
      return this.criteria.clone();
    };

    Scope.prototype.clone = function() {
      return new this.constructor(this.criteria.clone());
    };

    return Scope;

  })(Tower.Class);

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

  Tower.Model.Criteria = (function(_super) {

    __extends(Criteria, _super);

    Criteria.prototype.defaultLimit = 20;

    Criteria.include(Tower.Support.Callbacks);

    function Criteria(options) {
      if (options == null) options = {};
      this.model = options.model;
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
      this._near = options.near;
    }

    Criteria.prototype["export"] = function(result) {
      if (this.returnArray === false) result = result[0];
      delete this.data;
      delete this.returnArray;
      return result;
    };

    Criteria.prototype.get = function(key) {
      return this["_" + key];
    };

    Criteria.prototype.addData = function(args) {
      if (args.length && args.length > 1 || _.isArray(args[0])) {
        this.data = _.flatten(args);
        return this.returnArray = true;
      } else {
        this.data = _.flatten([args]);
        return this.returnArray = false;
      }
    };

    Criteria.prototype.addIds = function(args) {
      var id, ids, object, _j, _len2;
      ids = this.ids || (this.ids = []);
      if (args.length) {
        for (_j = 0, _len2 = args.length; _j < _len2; _j++) {
          object = args[_j];
          if (object == null) continue;
          id = object instanceof Tower.Model ? object.get('id') : object;
          if (ids.indexOf(id) === -1) ids.push(id);
        }
      }
      return ids;
    };

    Criteria.prototype.eagerLoad = function(object) {
      return this._eagerLoad = _.extend(this._eagerLoad, object);
    };

    Criteria.prototype.has = function(object) {
      return false;
    };

    Criteria.prototype.joins = function(object) {
      var joins, key, _j, _len2;
      joins = this._joins;
      if (_.isArray(object)) {
        for (_j = 0, _len2 = object.length; _j < _len2; _j++) {
          key = object[_j];
          joins[key] = true;
        }
      } else if (typeof object === "string") {
        joins[object] = true;
      } else {
        _.extend(joins, object);
      }
      return joins;
    };

    Criteria.prototype.except = function() {
      return this._except = _.flatten(_.args(arguments));
    };

    Criteria.prototype.where = function(conditions) {
      if (conditions instanceof Tower.Model.Criteria) {
        return this.merge(conditions);
      } else {
        return this._where.push(conditions);
      }
    };

    Criteria.prototype.order = function(attribute, direction) {
      if (direction == null) direction = "asc";
      return this._order.push([attribute, direction]);
    };

    Criteria.prototype.sort = Criteria.prototype.order;

    Criteria.prototype.reverseSort = function() {
      var i, order, set, _len2;
      order = this.get('order');
      for (i = 0, _len2 = order.length; i < _len2; i++) {
        set = order[i];
        set[1] = set[1] === "asc" ? "desc" : "asc";
      }
      return order;
    };

    Criteria.prototype.asc = function() {
      var attribute, attributes, _j, _len2;
      attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_j = 0, _len2 = attributes.length; _j < _len2; _j++) {
        attribute = attributes[_j];
        this.order(attribute);
      }
      return this._order;
    };

    Criteria.prototype.desc = function() {
      var attribute, attributes, _j, _len2;
      attributes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_j = 0, _len2 = attributes.length; _j < _len2; _j++) {
        attribute = attributes[_j];
        this.order(attribute, "desc");
      }
      return this._order;
    };

    Criteria.prototype.gte = function() {};

    Criteria.prototype.lte = function() {};

    Criteria.prototype.gt = function() {};

    Criteria.prototype.lt = function() {};

    Criteria.prototype.allIn = function(attributes) {
      return this._whereOperator("$all", attributes);
    };

    Criteria.prototype.anyIn = function(attributes) {
      return this._whereOperator("$any", attributes);
    };

    Criteria.prototype.notIn = function(attributes) {
      return this._whereOperator("$nin", attributes);
    };

    Criteria.prototype.offset = function(number) {
      return this._offset = number;
    };

    Criteria.prototype.limit = function(number) {
      return this._limit = number;
    };

    Criteria.prototype.select = function() {
      return this._fields = _.flatten(_.args(fields));
    };

    Criteria.prototype.includes = function() {
      return this._includes = _.flatten(_.args(arguments));
    };

    Criteria.prototype.uniq = function(value) {
      return this._uniq = value;
    };

    Criteria.prototype.page = function(page) {
      var limit;
      limit = this.limit(this._limit || this.defaultLimit);
      return this.offset((Math.max(1, page) - 1) * limit);
    };

    Criteria.prototype.paginate = function(options) {
      var limit, page;
      limit = options.perPage || options.limit;
      page = options.page || 1;
      this.limit(limit);
      return this.offset((page - 1) * limit);
    };

    Criteria.prototype.near = function(coordinates) {
      return this.where({
        coordinates: {
          $near: coordinates
        }
      });
    };

    Criteria.prototype.within = function(bounds) {
      return this.where({
        coordinates: {
          $maxDistance: bounds
        }
      });
    };

    Criteria.prototype.build = function(callback) {
      return this._build(callback);
    };

    Criteria.prototype._build = function(callback) {
      var attributes, data, item, result, store, _j, _len2;
      store = this.store;
      attributes = this.attributes();
      data = this.data;
      if (!data.length) data.push({});
      result = [];
      for (_j = 0, _len2 = data.length; _j < _len2; _j++) {
        item = data[_j];
        if (item instanceof Tower.Model) {
          _.extend(item.attributes, attributes, item.attributes);
        } else {
          item = store.serializeModel(_.extend({}, attributes, item));
        }
        result.push(item);
      }
      result = this.returnArray ? result : result[0];
      if (callback) callback.call(this, null, result);
      return result;
    };

    Criteria.prototype.create = function(callback) {
      return this._create(callback);
    };

    Criteria.prototype._create = function(callback) {
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
          if (!callback) {
            if (error) throw error;
            if (!returnArray) return records = records[0];
          } else {
            if (error) return callback(error);
            if (!returnArray) records = records[0];
            return callback(error, records);
          }
        });
      } else {
        this.store.create(this, callback);
      }
      return records;
    };

    Criteria.prototype.update = function(callback) {
      return this._update(callback);
    };

    Criteria.prototype._update = function(callback) {
      var iterator, updates,
        _this = this;
      updates = this.data[0];
      if (this.instantiate) {
        iterator = function(record, next) {
          return record.updateAttributes(updates, next);
        };
        return this._each(this, iterator, callback);
      } else {
        return this.store.update(updates, this, callback);
      }
    };

    Criteria.prototype.destroy = function(callback) {
      return this._destroy(callback);
    };

    Criteria.prototype._destroy = function(callback) {
      var iterator;
      if (this.instantiate) {
        iterator = function(record, next) {
          return record.destroy(next);
        };
        return this._each(this, iterator, callback);
      } else {
        return this.store.destroy(this, callback);
      }
    };

    Criteria.prototype.find = function(callback) {
      return this._find(callback);
    };

    Criteria.prototype._find = function(callback) {
      var _this = this;
      if (this.one) {
        return this.store.findOne(this, callback);
      } else {
        return this.store.find(this, function(error, records) {
          if (!error && records.length) records = _this["export"](records);
          if (callback) callback.call(_this, error, records);
          return records;
        });
      }
    };

    Criteria.prototype.findOne = function(callback) {
      this.limit(1);
      this.returnArray = false;
      return this.find(callback);
    };

    Criteria.prototype.count = function(callback) {
      return this._count(callback);
    };

    Criteria.prototype._count = function(callback) {
      return this.store.count(this, callback);
    };

    Criteria.prototype.exists = function(callback) {
      return this._exists(callback);
    };

    Criteria.prototype._exists = function(callback) {
      return this.store.exists(this, callback);
    };

    Criteria.prototype.add = function(callback) {};

    Criteria.prototype.remove = function(callback) {};

    Criteria.prototype.explain = function(callback) {};

    Criteria.prototype.clone = function() {
      return (new this.constructor({
        model: this.model,
        instantiate: this.instantiate
      })).merge(this);
    };

    Criteria.prototype.merge = function(criteria) {
      this._where = this._where.concat(criteria._where);
      this._order = this._order.concat(criteria._order);
      this._offset = criteria._offset;
      this._limit = criteria._limit;
      this._fields = criteria._fields;
      this._except = criteria._except;
      this._includes = criteria._includes;
      this._joins = _.extend({}, criteria._joins);
      this._eagerLoad = _.extend({}, criteria._eagerLoad);
      this._near = criteria._near;
      return this;
    };

    Criteria.prototype.toJSON = function() {
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
    };

    Criteria.prototype.conditions = function() {
      var conditions, result, _j, _len2, _ref2;
      result = {};
      _ref2 = this._where;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        conditions = _ref2[_j];
        _.deepMergeWithArrays(result, conditions);
      }
      if (this.ids && this.ids.length) {
        delete result.id;
        if (this.ids.length === 1) {
          this.returnArray = false;
        } else {
          this.returnArray = true;
        }
        result.id = {
          $in: this.ids
        };
      }
      return result;
    };

    Criteria.prototype.attributes = function() {
      var attributes, conditions, key, value, _j, _key, _len2, _ref2, _value;
      attributes = {};
      _ref2 = this._where;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        conditions = _ref2[_j];
        for (key in conditions) {
          value = conditions[key];
          if (Tower.Store.isKeyword(key)) {
            for (_key in value) {
              _value = value[_key];
              attributes[_key] = _value;
            }
          } else if (_.isHash(value) && value.constructor.name === "Object" && Tower.Store.hasKeyword(value)) {
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

    Criteria.prototype._each = function(criteria, iterator, callback) {
      var data,
        _this = this;
      data = !!criteria.data;
      return this.store.find(criteria, function(error, records) {
        if (error) {
          return callback.call(_this, error, records);
        } else {
          return Tower.parallel(records, iterator, function(error) {
            if (!callback) {
              if (error) throw error;
            } else {
              if (callback) {
                return callback.call(_this, error, _this["export"](records));
              }
            }
          });
        }
      });
    };

    Criteria.prototype._array = function(existing, orNull) {
      if (existing && existing.length) {
        return existing.concat();
      } else {
        if (orNull) {
          return null;
        } else {
          return [];
        }
      }
    };

    return Criteria;

  })(Tower.Class);

  Tower.Model.Dirty = {
    InstanceMethods: {
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
        return _.isPresent(this.changes);
      },
      attributeChanged: function(name) {
        var after, before, key, value, _ref2;
        _ref2 = this.changes, before = _ref2.before, after = _ref2.after;
        if (_.isBlank(before)) return false;
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
      parentClass: function() {
        if (this.__super__ && this.__super__.constructor.parentClass) {
          return this.__super__.constructor;
        } else {
          return this;
        }
      },
      isSubClass: function() {
        return this.baseClass().name !== this.name;
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
      _relationship: false,
      relationship: function(value) {
        if (value == null) value = true;
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
        var baseClassName, className, classNamePlural, controllerName, defaults, fields, indexes, metadata, modelName, name, namePlural, namespace, paramName, paramNamePlural, relations, superMetadata, validators;
        className = this.name;
        metadata = this.metadata[className];
        if (metadata) return metadata;
        baseClassName = this.parentClass().name;
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
          defaults: defaults
        };
      },
      _setDefaultScope: function(scope) {
        return this.metadata().defaults.scope = scope instanceof Tower.Model.Scope ? scope : this.where(scope);
      }
    },
    InstanceMethods: {
      toLabel: function() {
        return this.metadata().className;
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
      metadata: function() {
        return this.constructor.metadata();
      }
    }
  };

  Tower.Model.Indexing = {
    ClassMethods: {
      index: function(name, options) {
        if (options == null) options = {};
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
      if (!this.hasOwnProperty("idCache")) this.idCache = false;
      if (!this.hasOwnProperty("readonly")) this.readonly = false;
      if (!this.hasOwnProperty("validate")) this.validate = false;
      if (!this.hasOwnProperty("autosave")) this.autosave = false;
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
      if (this.idCache) {
        if (typeof this.idCache === "string") {
          this.idCacheKey = this.idCache;
          this.idCache = true;
        } else {
          this.idCacheKey = "" + this.singularTargetName + "Ids";
        }
        this.owner.field(this.idCacheKey, {
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
      return (function(name) {
        return owner.prototype[name] = function() {
          return this.relation(name);
        };
      })(name);
    };

    Relation.prototype.scoped = function(record) {
      return new Tower.Model.Scope(new this.constructor.Criteria({
        model: this.klass(),
        owner: record,
        relation: this
      }));
    };

    Relation.prototype.targetKlass = function() {
      return Tower.constant(this.targetType);
    };

    Relation.prototype.klass = function() {
      return Tower.constant(this.type);
    };

    Relation.prototype.inverse = function(type) {
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

    Relation.Criteria = (function(_super2) {

      __extends(Criteria, _super2);

      Criteria.prototype.isConstructable = function() {
        return !!!this.relation.polymorphic;
      };

      function Criteria(options) {
        if (options == null) options = {};
        Criteria.__super__.constructor.call(this, options);
        this.owner = options.owner;
        this.relation = options.relation;
        this.records = [];
      }

      Criteria.prototype.clone = function() {
        return (new this.constructor({
          model: this.model,
          owner: this.owner,
          relation: this.relation,
          records: this.records.concat(),
          instantiate: this.instantiate
        })).merge(this);
      };

      Criteria.prototype.setInverseInstance = function(record) {
        var inverse;
        if (record && this.invertibleFor(record)) {
          inverse = record.relation(this.inverseReflectionFor(record).name);
          return inverse.target = owner;
        }
      };

      Criteria.prototype.invertibleFor = function(record) {
        return true;
      };

      Criteria.prototype.inverse = function(record) {};

      Criteria.prototype._teardown = function() {
        return _.teardown(this, "relation", "records", "owner", "model", "criteria");
      };

      return Criteria;

    })(Tower.Model.Criteria);

    return Relation;

  })(Tower.Class);

  _ref2 = ["Before", "After"];
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    phase = _ref2[_j];
    _ref3 = ["Create", "Update", "Destroy", "Find"];
    _fn2 = function(phase, action) {
      return Tower.Model.Relation.Criteria.prototype["_run" + phase + action + "CallbacksOnStore"] = function(done) {
        return this.store["run" + phase + action](this, done);
      };
    };
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      action = _ref3[_k];
      _fn2(phase, action);
    }
  }

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

    BelongsTo.Criteria = (function(_super2) {

      __extends(Criteria, _super2);

      function Criteria() {
        Criteria.__super__.constructor.apply(this, arguments);
      }

      Criteria.prototype.isBelongsTo = true;

      Criteria.prototype.toCriteria = function() {
        var criteria, relation;
        criteria = Criteria.__super__.toCriteria.apply(this, arguments);
        relation = this.relation;
        criteria.where({
          id: {
            $in: [this.owner.get(relation.foreignKey)]
          }
        });
        return criteria;
      };

      return Criteria;

    })(BelongsTo.Criteria);

    return BelongsTo;

  })(Tower.Model.Relation);

  Tower.Model.Relation.HasMany = (function(_super) {

    __extends(HasMany, _super);

    function HasMany() {
      HasMany.__super__.constructor.apply(this, arguments);
    }

    HasMany.Criteria = (function(_super2) {

      __extends(Criteria, _super2);

      function Criteria() {
        Criteria.__super__.constructor.apply(this, arguments);
      }

      Criteria.prototype.isHasMany = true;

      Criteria.prototype.has = function(object) {
        var records;
        object = _.castArray(object);
        records = [];
        if (!records.length) return false;
        return false;
      };

      Criteria.prototype.validate = function(callback) {
        if (!this.owner.isPersisted()) {
          throw new Error("You cannot call create unless the parent is saved");
        }
        return callback.call(this);
      };

      Criteria.prototype.build = function(callback) {
        this.compileForCreate();
        return this._build(callback);
      };

      Criteria.prototype.create = function(callback) {
        var _this = this;
        return this.validate(function(error) {
          return _this.createReferenced(callback);
        });
      };

      Criteria.prototype.update = function(callback) {
        var _this = this;
        return this.validate(function(error) {
          return _this.updateReferenced(callback);
        });
      };

      Criteria.prototype.destroy = function(callback) {
        var _this = this;
        return this.validate(function(error) {
          return _this.destroyReferenced(callback);
        });
      };

      Criteria.prototype.find = function(callback) {
        var _this = this;
        return this.validate(function(error) {
          return _this.findReferenced(callback);
        });
      };

      Criteria.prototype.count = function(callback) {
        var _this = this;
        return this.validate(function(error) {
          _this.compileForFind();
          return _this._runBeforeFindCallbacksOnStore(function() {
            return _this._count(function(error, record) {
              if (!error) {
                return _this._runAfterFindCallbacksOnStore(function() {
                  if (callback) return callback.call(_this, error, record);
                });
              } else {
                if (callback) return callback.call(_this, error, record);
              }
            });
          });
        });
      };

      Criteria.prototype.exists = function(callback) {
        var _this = this;
        return this.validate(function(error) {
          _this.compileForFind();
          return _this._runBeforeFindCallbacksOnStore(function() {
            return _this._exists(function(error, record) {
              if (!error) {
                return _this._runAfterFindCallbacksOnStore(function() {
                  if (callback) return callback.call(_this, error, record);
                });
              } else {
                if (callback) return callback.call(_this, error, record);
              }
            });
          });
        });
      };

      Criteria.prototype.createReferenced = function(callback) {
        var _this = this;
        this.compileForCreate();
        return this._runBeforeCreateCallbacksOnStore(function() {
          return _this._create(function(error, record) {
            if (!error) {
              return _this._runAfterCreateCallbacksOnStore(function() {
                if (_this.updateOwnerRecord()) {
                  return _this.owner.updateAttributes(_this.ownerAttributes(record), function(error) {
                    if (callback) return callback.call(_this, error, record);
                  });
                } else {
                  if (callback) return callback.call(_this, error, record);
                }
              });
            } else {
              if (callback) return callback.call(_this, error, record);
            }
          });
        });
      };

      Criteria.prototype.updateReferenced = function(callback) {
        var _this = this;
        this.compileForUpdate();
        return this._runBeforeUpdateCallbacksOnStore(function() {
          return _this._update(function(error, record) {
            if (!error) {
              return _this._runAfterUpdateCallbacksOnStore(function() {
                if (callback) return callback.call(_this, error, record);
              });
            } else {
              if (callback) return callback.call(_this, error, record);
            }
          });
        });
      };

      Criteria.prototype.destroyReferenced = function(callback) {
        var _this = this;
        this.compileForDestroy();
        return this._runBeforeDestroyCallbacksOnStore(function() {
          return _this._destroy(function(error, record) {
            if (!error) {
              return _this._runAfterDestroyCallbacksOnStore(function() {
                if (_this.updateOwnerRecord()) {
                  return _this.owner.updateAttributes(_this.ownerAttributesForDestroy(record), function(error) {
                    if (callback) return callback.call(_this, error, record);
                  });
                } else {
                  if (callback) return callback.call(_this, error, record);
                }
              });
            } else {
              if (callback) return callback.call(_this, error, record);
            }
          });
        });
      };

      Criteria.prototype.findReferenced = function(callback) {
        var _this = this;
        this.compileForFind();
        return this._runBeforeFindCallbacksOnStore(function() {
          return _this._find(function(error, record) {
            if (!error) {
              return _this._runAfterFindCallbacksOnStore(function() {
                if (callback) return callback.call(_this, error, record);
              });
            } else {
              if (callback) return callback.call(_this, error, record);
            }
          });
        });
      };

      Criteria.prototype.add = function(callback) {
        var _this = this;
        if (!this.relation.idCache) throw new Error;
        return this.owner.updateAttributes(this.ownerAttributes(), function(error) {
          if (callback) return callback.call(_this, error, _this.data);
        });
      };

      Criteria.prototype.remove = function(callback) {
        var _this = this;
        if (!this.relation.idCache) throw new Error;
        return this.owner.updateAttributes(this.ownerAttributesForDestroy(), function(error) {
          if (callback) return callback.call(_this, error, _this.data);
        });
      };

      Criteria.prototype.compile = function() {
        var array, data, id, inverseRelation, owner, relation, _name;
        owner = this.owner;
        relation = this.relation;
        inverseRelation = relation.inverse();
        id = owner.get("id");
        data = {};
        if (inverseRelation && inverseRelation.idCache) {
          array = data[inverseRelation.idCacheKey] || [];
          if (array.indexOf(id) === -1) array.push(id);
          data[inverseRelation.idCacheKey] = array;
        } else if (relation.foreignKey && !relation.idCache) {
          if (id !== void 0) data[relation.foreignKey] = id;
          if (relation.foreignType) {
            data[_name = relation.foreignType] || (data[_name] = owner.constructor.name);
          }
        }
        if (inverseRelation && inverseRelation.counterCacheKey) {
          data[inverseRelation.counterCacheKey] = 1;
        }
        return this.where(data);
      };

      Criteria.prototype.compileForCreate = function() {
        return this.compile();
      };

      Criteria.prototype.compileForUpdate = function() {
        this.compileForFind();
        if (!(this.ids && this.ids.length)) return this.returnArray = true;
      };

      Criteria.prototype.compileForDestroy = function() {
        return this.compileForFind();
      };

      Criteria.prototype.compileForFind = function() {
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
      };

      Criteria.prototype.updateOwnerRecord = function() {
        var relation;
        relation = this.relation;
        return !!(relation && (relation.idCache || relation.counterCache));
      };

      Criteria.prototype.ownerAttributes = function(record) {
        var data, inc, push, relation, updates;
        relation = this.relation;
        if (relation.idCache) {
          push = {};
          data = record ? record.get("id") : this.store._mapKeys('id', this.data);
          push[relation.idCacheKey] = _.isArray(data) ? {
            $each: data
          } : data;
        }
        if (relation.counterCacheKey) {
          inc = {};
          inc[relation.counterCacheKey] = 1;
        }
        updates = {};
        if (push) updates["$addToSet"] = push;
        if (inc) updates["$inc"] = inc;
        return updates;
      };

      Criteria.prototype.ownerAttributesForDestroy = function(record) {
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
        if (pull) updates["$pullAll"] = pull;
        if (inc) updates["$inc"] = inc;
        return updates;
      };

      Criteria.prototype._idCacheRecords = function(records) {
        var rootRelation;
        rootRelation = this.owner.relation(this.relation.name);
        return rootRelation.criteria.records = rootRelation.criteria.records.concat(_.castArray(records));
      };

      return Criteria;

    })(HasMany.Criteria);

    return HasMany;

  })(Tower.Model.Relation);

  Tower.Model.Relation.HasManyThrough = (function(_super) {

    __extends(HasManyThrough, _super);

    function HasManyThrough() {
      HasManyThrough.__super__.constructor.apply(this, arguments);
    }

    HasManyThrough.prototype.initialize = function(options) {
      var throughRelation;
      HasManyThrough.__super__.initialize.apply(this, arguments);
      if (this.through && !options.type) {
        this.throughRelation = throughRelation = this.owner.relation(this.through);
        return options.type || (options.type = throughRelation.targetType);
      }
    };

    HasManyThrough.prototype.inverseThrough = function(relation) {
      var name, relations, type;
      relations = relation.targetKlass().relations();
      if (relation.inverseOf) {
        return relations[relation.inverseOf];
      } else {
        name = this.name;
        type = this.type;
        for (name in relations) {
          relation = relations[name];
          if (relation.inverseOf === name) return relation;
        }
        for (name in relations) {
          relation = relations[name];
          if (relation.targetType === type) return relation;
        }
      }
    };

    HasManyThrough.Criteria = (function(_super2) {

      __extends(Criteria, _super2);

      Criteria.prototype.isHasManyThrough = true;

      function Criteria(options) {
        if (options == null) options = {};
        Criteria.__super__.constructor.apply(this, arguments);
        if (this.relation.through) {
          this.throughRelation = this.owner.constructor.relation(this.relation.through);
          this.inverseRelation = this.relation.inverseThrough(this.throughRelation);
        }
      }

      Criteria.prototype.compile = function() {
        return this;
      };

      Criteria.prototype.create = function(callback) {
        var _this = this;
        return this._runBeforeCreateCallbacksOnStore(function() {
          return _this._create(function(error, record) {
            if (!error) {
              return _this._runAfterCreateCallbacksOnStore(function() {
                return _this.createThroughRelation(record, function(error, throughRecord) {
                  if (callback) return callback.call(_this, error, record);
                });
              });
            } else {
              if (callback) return callback.call(_this, error, record);
            }
          });
        });
      };

      Criteria.prototype.add = function(callback) {
        var _this = this;
        return this._build(function(error, record) {
          if (!error) {
            return _this.createThroughRelation(record, function(error, throughRecord) {
              if (callback) return callback.call(_this, error, record);
            });
          } else {
            if (callback) return callback.call(_this, error, record);
          }
        });
      };

      Criteria.prototype.remove = function(callback) {
        var _this = this;
        if (!this.relation.idCache) throw new Error;
        return this.owner.updateAttributes(this.ownerAttributesForDestroy(), function(error) {
          if (callback) return callback.call(_this, error, _this.data);
        });
      };

      Criteria.prototype.count = function(callback) {
        var _this = this;
        return this._runBeforeFindCallbacksOnStore(function() {
          return _this._count(function(error, record) {
            if (!error) {
              return _this._runAfterFindCallbacksOnStore(function() {
                if (callback) return callback.call(_this, error, record);
              });
            } else {
              if (callback) return callback.call(_this, error, record);
            }
          });
        });
      };

      Criteria.prototype.exists = function(callback) {
        var _this = this;
        return this._runBeforeFindCallbacksOnStore(function() {
          return _this._exists(function(error, record) {
            if (!error) {
              return _this._runAfterFindCallbacksOnStore(function() {
                if (callback) return callback.call(_this, error, record);
              });
            } else {
              if (callback) return callback.call(_this, error, record);
            }
          });
        });
      };

      Criteria.prototype.appendThroughConditions = function(callback) {
        var _this = this;
        return this.owner[this.relation.through]().all(function(error, records) {
          var ids;
          ids = _this.store._mapKeys(_this.inverseRelation.foreignKey, records);
          _this.where({
            'id': {
              $in: ids
            }
          });
          return callback();
        });
      };

      Criteria.prototype.createThroughRelation = function(records, callback) {
        var attributes, data, record, returnArray, _l, _len4,
          _this = this;
        returnArray = _.isArray(records);
        records = _.castArray(records);
        data = [];
        key = this.inverseRelation.foreignKey;
        for (_l = 0, _len4 = records.length; _l < _len4; _l++) {
          record = records[_l];
          attributes = {};
          attributes[key] = record.get('id');
          data.push(attributes);
        }
        return this.owner[this.relation.through]().create(data, function(error, throughRecords) {
          if (!returnArray) throughRecords = throughRecords[0];
          if (callback) return callback.call(_this, error, throughRecords);
        });
      };

      return Criteria;

    })(HasManyThrough.Criteria);

    return HasManyThrough;

  })(Tower.Model.Relation.HasMany);

  Tower.Model.Relation.HasOne = (function(_super) {

    __extends(HasOne, _super);

    function HasOne() {
      HasOne.__super__.constructor.apply(this, arguments);
    }

    HasOne.Criteria = (function(_super2) {

      __extends(Criteria, _super2);

      function Criteria() {
        Criteria.__super__.constructor.apply(this, arguments);
      }

      Criteria.prototype.isHasOne = true;

      return Criteria;

    })(HasOne.Criteria);

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
        if (options.hasOwnProperty("through")) {
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
      destroyRelations: function(callback) {
        var dependents, iterator, name, relation, relations,
          _this = this;
        relations = this.constructor.relations();
        dependents = [];
        for (name in relations) {
          relation = relations[name];
          if (relation.dependent === true || relation.dependent === "destroy") {
            dependents.push(name);
          }
        }
        iterator = function(name, next) {
          return _this[name]().destroy(next);
        };
        return Tower.async(dependents, iterator, callback);
      }
    }
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

    Attribute.geo = {
      from: function(serialized) {
        return serialized;
      },
      to: function(deserialized) {
        switch (_.kind(deserialized)) {
          case "array":
            return {
              lat: deserialized[0],
              lng: deserialized[1]
            };
          case "object":
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
    };

    Attribute.array = {
      from: function(serialized) {
        if (Tower.none(serialized)) {
          return null;
        } else {
          return _.castArray(serialized);
        }
      },
      to: function(deserialized) {
        return Tower.Model.Attribute.array.from(deserialized);
      }
    };

    function Attribute(owner, name, options, block) {
      var index, key, normalizedKey, serializer, validations, _ref4;
      if (options == null) options = {};
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
          case "Geo":
            return this.type;
          default:
            return "Model";
        }
      }).call(this);
      serializer = Tower.Model.Attribute[Tower.Support.String.camelize(this.type, true)];
      this._default = options["default"];
      if (!this._default) {
        if (this.type === "Geo") {
          this._default = {
            lat: null,
            lng: null
          };
        } else if (this.type === 'Array') {
          this._default = [];
        }
      }
      if (this.type === 'Geo' && !options.index) {
        index = {};
        index[name] = "2d";
        options.index = index;
      }
      this.get = options.get || (serializer ? serializer.from : void 0);
      this.set = options.set || (serializer ? serializer.to : void 0);
      if (this.get === true) {
        this.get = "get" + (Tower.Support.String.camelize(name));
      }
      if (this.set === true) {
        this.set = "set" + (Tower.Support.String.camelize(name));
      }
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
      validations = {};
      _ref4 = Tower.Model.Validator.keys;
      for (key in _ref4) {
        normalizedKey = _ref4[key];
        if (options.hasOwnProperty(key)) validations[normalizedKey] = options[key];
      }
      if (_.isPresent(validations)) this.owner.validates(name, validations);
      if (options.index) {
        if (options.index === true) {
          this.owner.index(name);
        } else {
          this.owner.index(options.index);
        }
      }
    }

    Attribute.prototype.validators = function() {
      var result, validator, _l, _len4, _ref4;
      result = [];
      _ref4 = this.owner.validators();
      for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
        validator = _ref4[_l];
        if (validator.attributes.indexOf(this.name) !== -1) result.push(validator);
      }
      return result;
    };

    Attribute.prototype.defaultValue = function(record) {
      var _default;
      _default = this._default;
      if (_.isArray(_default)) {
        return _default.concat();
      } else if (_.isHash(_default)) {
        return _.extend({}, _default);
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
        var fields, name, names, options, _l, _len4, _ref4;
        fields = this.metadata().fields;
        switch (arguments.length) {
          case 0:
            fields;
            break;
          case 1:
            _ref4 = arguments[0];
            for (name in _ref4) {
              options = _ref4[name];
              this.field(name, options);
            }
            break;
          default:
            names = _.args(arguments);
            options = _.extractOptions(names);
            for (_l = 0, _len4 = names.length; _l < _len4; _l++) {
              name = names[_l];
              this.field(name, options);
            }
        }
        return fields;
      }
    },
    InstanceMethods: {
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
        var key, keys, _l, _len4;
        keys = _.flatten(Tower.args(arguments));
        for (_l = 0, _len4 = keys.length; _l < _len4; _l++) {
          key = keys[_l];
          delete this.attributes[key];
        }
        return;
      },
      _set: function(key, value) {
        var after, before, field, fields, operation, _ref4;
        if (Tower.Store.atomicModifiers.hasOwnProperty(key)) {
          return this[key.replace(/^\$/, "")](value);
        } else {
          fields = this.constructor.fields();
          field = fields[key];
          if (field) value = field.encode(value, this);
          _ref4 = this.changes, before = _ref4.before, after = _ref4.after;
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
        var after, before, current, fields, operation, push, _ref4;
        if (array == null) array = false;
        fields = this.constructor.fields();
        if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
        _ref4 = this.changes, before = _ref4.before, after = _ref4.after;
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
        var after, before, current, fields, item, operation, pull, _l, _len4, _ref4;
        if (array == null) array = false;
        fields = this.constructor.fields();
        if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
        _ref4 = this.changes, before = _ref4.before, after = _ref4.after;
        pull = after.$pull || (after.$pull = {});
        before[key] || (before[key] = this.get(key));
        current = this.get(key) || [];
        pull[key] || (pull[key] = current.concat());
        if (array && _.isArray(value)) {
          for (_l = 0, _len4 = value.length; _l < _len4; _l++) {
            item = value[_l];
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
        var after, before, fields, inc, operation, _ref4;
        fields = this.constructor.fields();
        if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
        _ref4 = this.changes, before = _ref4.before, after = _ref4.after;
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
        var addToSet, after, before, current, fields, item, _l, _len4, _ref4, _ref5;
        fields = this.constructor.fields();
        if (__indexOf.call(fields, key) >= 0) value = fields[key].encode(value);
        _ref4 = this.changes, before = _ref4.before, after = _ref4.after;
        addToSet = after.$addToSet || (after.$addToSet = {});
        before[key] || (before[key] = this.get(key));
        current = this.get(key) || [];
        addToSet[key] || (addToSet[key] = current.concat());
        if (value && value.hasOwnProperty("$each")) {
          _ref5 = value.$each;
          for (_l = 0, _len4 = _ref5.length; _l < _len4; _l++) {
            item = _ref5[_l];
            if (addToSet[key].indexOf(item) === -1) addToSet[key].push(item);
          }
        } else {
          if (addToSet[key].indexOf(value) === -1) addToSet[key].push(value);
        }
        return this.attributes[key] = addToSet[key];
      }
    }
  };

  Tower.Model.Persistence = {
    ClassMethods: {
      store: function(value) {
        var defaultStore, metadata, store;
        metadata = this.metadata();
        store = metadata.store;
        if (arguments.length === 0 && store) return store;
        defaultStore = this["default"]('store') || Tower.Store.Memory;
        if (typeof value === "function") {
          store = new value({
            name: this.metadata().namePlural,
            type: Tower.namespaced(this.name)
          });
        } else if (typeof value === "object") {
          store || (store = new defaultStore({
            name: this.metadata().namePlural,
            type: Tower.namespaced(this.name)
          }));
          _.extend(store, value);
        } else if (value) {
          store = value;
        }
        store || (store = new defaultStore({
          name: this.metadata().namePlural,
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
        return;
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
        this.runCallbacks("save", function(block) {
          var complete;
          complete = _this._callback(block, callback);
          if (_this.isNew()) {
            return _this._create(complete);
          } else {
            return _this._update(_this.toUpdates(), complete);
          }
        });
        return;
      },
      _create: function(callback) {
        var _this = this;
        this.runCallbacks("create", function(block) {
          var complete;
          complete = _this._callback(block, callback);
          return _this.constructor.scoped({
            instantiate: false
          }).create(_this, function(error) {
            if (error && !callback) throw error;
            if (!error) {
              _this._resetChanges();
              _this.persistent = true;
            }
            return complete.call(_this, error);
          });
        });
        return;
      },
      _update: function(updates, callback) {
        var _this = this;
        this.runCallbacks("update", function(block) {
          var complete;
          complete = _this._callback(block, callback);
          return _this.constructor.scoped({
            instantiate: false
          }).update(_this.get("id"), updates, function(error) {
            if (error && !callback) throw error;
            if (!error) {
              _this._resetChanges();
              _this.persistent = true;
            }
            return complete.call(_this, error);
          });
        });
        return;
      },
      _destroy: function(callback) {
        var id,
          _this = this;
        id = this.get('id');
        this.runCallbacks("destroy", function(block) {
          var complete;
          complete = _this._callback(block, callback);
          return _this.constructor.scoped({
            instantiate: false
          }).destroy(_this, function(error) {
            if (error && !callback) throw error;
            if (!error) {
              return _this.destroyRelations(function(error) {
                _this.persistent = false;
                _this._resetChanges();
                delete _this.attributes.id;
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
          return this.scoped().where(scope.criteria);
        };
      },
      scoped: function(options) {
        var criteria, defaultScope;
        criteria = this.criteria(options);
        defaultScope = this.defaults().scope;
        if (defaultScope) {
          return defaultScope.where(criteria);
        } else {
          return new Tower.Model.Scope(criteria);
        }
      },
      criteria: function(options) {
        var criteria;
        if (options == null) options = {};
        options.model = this;
        criteria = new Tower.Model.Criteria(options);
        if (this.baseClass().name !== this.name) {
          criteria.where({
            type: this.name
          });
        }
        return criteria;
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
  for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
    key = _ref4[_l];
    _fn3(key);
  }

  _ref5 = Tower.Model.Scope.finderMethods;
  _fn4 = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref6;
      return (_ref6 = this.scoped())[key].apply(_ref6, arguments);
    };
  };
  for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
    key = _ref5[_m];
    _fn4(key);
  }

  _ref6 = Tower.Model.Scope.persistenceMethods;
  _fn5 = function(key) {
    return Tower.Model.Scopes.ClassMethods[key] = function() {
      var _ref7;
      return (_ref7 = this.scoped())[key].apply(_ref7, arguments);
    };
  };
  for (_n = 0, _len6 = _ref6.length; _n < _len6; _n++) {
    key = _ref6[_n];
    _fn5(key);
  }

  Tower.Model.Serialization = {
    ClassMethods: {
      fromJSON: function(data) {
        var i, record, records, _len7;
        records = JSON.parse(data);
        if (!(records instanceof Array)) records = [records];
        for (i = 0, _len7 = records.length; i < _len7; i++) {
          record = records[i];
          records[i] = new this(record);
        }
        return records;
      },
      toJSON: function(records, options) {
        var record, result, _len7, _o;
        if (options == null) options = {};
        result = [];
        for (_o = 0, _len7 = records.length; _o < _len7; _o++) {
          record = records[_o];
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
      var attributeNames, except, i, include, includes, methodNames, methods, name, only, opts, record, records, result, tmp, _len10, _len7, _len8, _len9, _o, _p, _q;
      if (options == null) options = {};
      result = {};
      attributeNames = _.keys(this.attributes);
      if (only = options.only) {
        attributeNames = _.union(_.toArray(only), attributeNames);
      } else if (except = options.except) {
        attributeNames = _.difference(_.toArray(except), attributeNames);
      }
      for (_o = 0, _len7 = attributeNames.length; _o < _len7; _o++) {
        name = attributeNames[_o];
        result[name] = this._readAttributeForSerialization(name);
      }
      if (methods = options.methods) {
        methodNames = _.toArray(methods);
        for (_p = 0, _len8 = methods.length; _p < _len8; _p++) {
          name = methods[_p];
          result[name] = this[name]();
        }
      }
      if (includes = options.include) {
        includes = _.toArray(includes);
        for (_q = 0, _len9 = includes.length; _q < _len9; _q++) {
          include = includes[_q];
          if (!_.isHash(include)) {
            tmp = {};
            tmp[include] = {};
            include = tmp;
            tmp = void 0;
          }
          for (name in include) {
            opts = include[name];
            records = this[name]().all();
            for (i = 0, _len10 = records.length; i < _len10; i++) {
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

    Validator.keys = {
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
    };

    Validator.createAll = function(attributes, validations) {
      var key, options, validatorOptions, validators, value;
      if (validations == null) validations = {};
      options = _.moveProperties({}, validations, 'on', 'if', 'unless', 'allow');
      validators = [];
      for (key in validations) {
        value = validations[key];
        validatorOptions = _.clone(options);
        if (_.isBaseObject(value)) {
          validatorOptions = _.moveProperties(validatorOptions, value, 'on', 'if', 'unless', 'allow');
        }
        validators.push(Tower.Model.Validator.create(key, value, attributes, validatorOptions));
      }
      return validators;
    };

    Validator.create = function(name, value, attributes, options) {
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
    };

    Validator._create = function(name, value, attributes, options) {
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
    };

    function Validator(name, value, attributes, options) {
      if (options == null) options = {};
      this.name = name;
      this.value = value;
      this.attributes = _.castArray(attributes);
      this.options = options;
    }

    Validator.prototype.validateEach = function(record, errors, callback) {
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
            if (callback) return callback.call(_this, error);
          });
        } else {
          if (callback) return callback.call(_this, error);
        }
      });
      return success;
    };

    Validator.prototype.check = function(record, callback) {
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

    Validator.prototype.getValue = function(binding) {
      if (typeof this.value === 'function') {
        return this.value.call(binding);
      } else {
        return this.value;
      }
    };

    Validator.prototype._callMethod = function(binding, method, callback) {
      var _this = this;
      if (typeof method === 'string') method = binding[method];
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
    };

    return Validator;

  })();

  Tower.Model.Validator.Format = (function(_super) {

    __extends(Format, _super);

    function Format(name, value, attributes, options) {
      Format.__super__.constructor.call(this, name, value, attributes, options);
      if (this.value.hasOwnProperty('value')) this.value = this.value.value;
      if (typeof this.value === 'string') {
        this.matcher = "is" + (_.camelCase(value, true));
      }
    }

    Format.prototype.validate = function(record, attribute, errors, callback) {
      var success, value;
      value = record.get(attribute);
      success = this.matcher ? !!_[this.matcher](value) : !!this.value.exec(value);
      if (!success) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.format", {
          attribute: attribute,
          value: this.value.toString()
        }), callback);
      } else {
        return this.success(callback);
      }
    };

    return Format;

  })(Tower.Model.Validator);

  Tower.Model.Validator.Length = (function(_super) {

    __extends(Length, _super);

    function Length(name, value, attributes, options) {
      Length.__super__.constructor.apply(this, arguments);
      this.validate = (function() {
        switch (name) {
          case "min":
            return this.validateMinimum;
          case "max":
            return this.validateMaximum;
          case "gte":
            return this.validateGreaterThanOrEqual;
          case "gt":
            return this.validateGreaterThan;
          case "lte":
            return this.validateLessThanOrEqual;
          case "lt":
            return this.validateLessThan;
          default:
            return this.validateLength;
        }
      }).call(this);
    }

    Length.prototype.validateGreaterThanOrEqual = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value >= this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateGreaterThan = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value > this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateLessThanOrEqual = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value <= this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateLessThan = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(value < this.getValue(record))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }), callback);
      }
      return this.success(callback);
    };

    Length.prototype.validateMinimum = function(record, attribute, errors, callback) {
      var value;
      value = record.get(attribute);
      if (!(typeof value === 'number' && value >= this.getValue(record))) {
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
      if (!(typeof value === 'number' && value <= this.getValue(record))) {
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
      if (!(typeof value === 'number' && value === this.getValue(record))) {
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
      if (!_.isPresent(record.get(attribute))) {
        return this.failure(record, attribute, errors, Tower.t("model.errors.presence", {
          attribute: attribute
        }), callback);
      }
      return this.success(callback);
    };

    return Presence;

  })(Tower.Model.Validator);

  Tower.Model.Validator.Set = (function(_super) {

    __extends(Set, _super);

    function Set(name, value, attributes, options) {
      Set.__super__.constructor.call(this, name, _.castArray(value), attributes, options);
    }

    Set.prototype.validate = function(record, attribute, errors, callback) {
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
        return this.failure(record, attribute, errors, Tower.t("model.errors.format", {
          attribute: attribute,
          value: testValue.toString()
        }), callback);
      } else {
        return this.success(callback);
      }
    };

    return Set;

  })(Tower.Model.Validator);

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
        var attributes, newValidators, options, validator, validators, _len7, _o;
        attributes = _.args(arguments);
        options = attributes.pop();
        validators = this.validators();
        newValidators = Tower.Model.Validator.createAll(attributes, options);
        for (_o = 0, _len7 = newValidators.length; _o < _len7; _o++) {
          validator = newValidators[_o];
          validators.push(validator);
        }
        return this;
      },
      validators: function() {
        switch (arguments.length) {
          case 1:
            return this.fields()[arguments[0]].validators();
          default:
            return this.metadata().validators;
        }
      }
    },
    InstanceMethods: {
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
            if (!(_.isPresent(errors) || error)) success = true;
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
      setCreatedAt: function() {
        return this.set("createdAt", new Date);
      }
    },
    UpdatedAt: {
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

  Tower.Model.include(Tower.Model.Conversion);

  Tower.Model.include(Tower.Model.Dirty);

  Tower.Model.include(Tower.Model.Criteria);

  Tower.Model.include(Tower.Model.Indexing);

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
      var coffeekup, e, engine, hardcode, helper, locals, mint, result, _len7, _o, _ref7;
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
          _ref7 = Tower.View.helpers;
          for (_o = 0, _len7 = _ref7.length; _o < _len7; _o++) {
            helper = _ref7[_o];
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
        if (typeof string === 'function') string = string();
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
        if (!key.match(/^(constructor|head)/)) locals[key] = value;
      }
      locals = _.modules(locals, options.locals);
      if (this.constructor.prettyPrint) locals.pretty = true;
      return locals;
    },
    _readTemplate: function(template, prefixes, ext) {
      var cachePath, options, path, result, store;
      if (typeof template !== "string") return template;
      options = {
        path: template,
        ext: ext,
        prefixes: prefixes
      };
      store = this.constructor.store();
      path = store.findPath(options);
      path || (path = store.defaultPath(options));
      cachePath = path;
      result = this.constructor.cache[cachePath] || require('fs').readFileSync(path, 'utf-8').toString();
      if (!result) throw new Error("Template '" + template + "' was not found.");
      return result;
    }
  };

  Tower.View.Component = (function() {

    Component.render = function() {
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
      var arg, result, _len7, _o;
      result = string ? string.split(/\s+/g) : [];
      for (_o = 0, _len7 = args.length; _o < _len7; _o++) {
        arg = args[_o];
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
      var args, attributes, block, _o;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _o = arguments.length - 1) : (_o = 0, []), block = arguments[_o++];
      attributes = _.extractOptions(args);
      attributes.scope = "row";
      if (this.scope === "body") attributes.role = "row";
      this.rowIndex += 1;
      this.cellIndex = 0;
      this.tag("tr", attributes, block);
      return this.cellIndex = 0;
    };

    Table.prototype.column = function() {
      var args, attributes, block, value, _base, _o;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _o = arguments.length - 1) : (_o = 0, []), block = arguments[_o++];
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
    };

    Table.prototype.header = function() {
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
      var args, attributes, block, value, _base, _o;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _o = arguments.length - 1) : (_o = 0, []), block = arguments[_o++];
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
      options = this.defaultOptions(_.extractOptions(args));
      options.label || (options.label = args.shift());
      return new Tower.View.Form.Fieldset([], options).render(block);
    };

    Builder.prototype.fields = function() {
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
      args = _.args(arguments);
      last = args[args.length - 1];
      if (last === null || last === void 0) args.pop();
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
    };

    Builder.prototype.button = function() {
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
      var arg, result, _len7, _o;
      result = string ? string.split(/\s+/g) : [];
      for (_o = 0, _len7 = args.length; _o < _len7; _o++) {
        arg = args[_o];
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
      result = Tower.Support.String.camelize(this.model.constructor.name, true);
      if (options.parentIndex) result += "[" + options.parentIndex + "]";
      result += "[" + this.attribute + "]";
      if (this.index != null) result += "[" + this.index + "]";
      return result;
    };

    function Field(args, options) {
      var classes, field, inputType, pattern, value, _base, _base2, _base3, _base4, _base5, _base6, _base7;
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
            (_base2 = this.errorHTML).role || (_base2.role = "tooltip");
          }
        }
      }
      this.attributes = this.fieldHTML;
      if (inputType !== "submit") {
        (_base3 = this.inputHTML).name || (_base3.name = this.toParam());
      }
      (_base4 = this.inputHTML).value || (_base4.value = options.value);
      (_base5 = this.inputHTML).value || (_base5.value = this.value);
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
      value = void 0;
      if (options.hasOwnProperty("value")) value = options.value;
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
        (_base6 = this.inputHTML).maxlength || (_base6.maxlength = options.max);
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
        (_base7 = this.inputHTML).title || (_base7.title = this.inputHTML.placeholder);
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
      options = _.extend(this.inputHTML, _.extractOptions(args));
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
      var options, path, paths, sources, _len7, _o;
      sources = _.args(arguments);
      options = _.extractOptions(sources);
      options.namespace = "javascripts";
      options.extension = "js";
      paths = _extractAssetPaths(sources, options);
      for (_o = 0, _len7 = paths.length; _o < _len7; _o++) {
        path = paths[_o];
        javascriptTag(path);
      }
      return null;
    },
    javascript: function() {
      return javascripts.apply(this, arguments);
    },
    stylesheets: function() {
      var options, path, paths, sources, _len7, _o;
      sources = _.args(arguments);
      options = _.extractOptions(sources);
      options.namespace = "stylesheets";
      options.extension = "css";
      paths = _extractAssetPaths(sources, options);
      for (_o = 0, _len7 = paths.length; _o < _len7; _o++) {
        path = paths[_o];
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
      var extension, manifest, namespace, path, paths, result, source, _len7, _len8, _len9, _o, _p, _q;
      if (options == null) options = {};
      namespace = options.namespace;
      extension = options.extension;
      result = [];
      if (Tower.env === "production") {
        manifest = Tower.assetManifest;
        for (_o = 0, _len7 = sources.length; _o < _len7; _o++) {
          source = sources[_o];
          if (!source.match(/^(http|\/{2})/)) {
            source = "" + source + "." + extension;
            if (manifest[source]) source = manifest[source];
            source = "/assets/" + source;
            if (Tower.assetHost) source = "" + Tower.assetHost + source;
          }
          result.push(source);
        }
      } else {
        for (_p = 0, _len8 = sources.length; _p < _len8; _p++) {
          source = sources[_p];
          if (!!source.match(/^(http|\/{2})/)) {
            result.push(source);
          } else {
            paths = Tower.config.assets[namespace][source];
            if (paths) {
              for (_q = 0, _len9 = paths.length; _q < _len9; _q++) {
                path = paths[_q];
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
      var classes, part, parts, string, _len7, _o;
      string = arguments[0], parts = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      classes = string.split(/\ +/);
      for (_o = 0, _len7 = parts.length; _o < _len7; _o++) {
        part = parts[_o];
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
      var i, item, result, _len7;
      result = this.elementNameComponents.apply(this, arguments);
      i = 1;
      for (i = 0, _len7 = result.length; i < _len7; i++) {
        item = result[i];
        result[i] = "[" + item + "]";
      }
      return Tower.Support.String.parameterize(result.join(""));
    },
    elementNameComponents: function() {
      var args, item, result, _len7, _o;
      args = _.args(arguments);
      result = [];
      for (_o = 0, _len7 = args.length; _o < _len7; _o++) {
        item = args[_o];
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
      var options, path, result, size, sizes, _len7, _o;
      path = arguments[0], sizes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof sizes[sizes.length - 1] === "object") {
        options = sizes.pop();
      } else {
        options = {};
      }
      result = [];
      for (_o = 0, _len7 = sizes.length; _o < _len7; _o++) {
        size = sizes[_o];
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
      var item, locals, name, prefixes, template, tmpl, _len7, _o, _ref7;
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
          _ref7 = options.collection;
          for (_o = 0, _len7 = _ref7.length; _o < _len7; _o++) {
            item = _ref7[_o];
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
    var array, coerce_types, cur, i, index, item, keys, keys_last, obj, param, val, _len7;
    obj = {};
    coerce_types = {
      "true": !0,
      "false": !1,
      "null": null
    };
    array = params.replace(/\+/g, " ").split("&");
    for (index = 0, _len7 = array.length; index < _len7; index++) {
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

    __extends(Controller, _super);

    Controller.include(Tower.Support.Callbacks);

    Controller.extend(Tower.Support.EventEmitter);

    Controller.include(Tower.Support.EventEmitter);

    Controller.instance = function() {
      return this._instance || (this._instance = new this);
    };

    function Controller() {
      var metadata;
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
      },
      callbacks: function() {
        return this.metadata().callbacks;
      }
    }
  };

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
        if (typeof layout === "function") {
          return layout.call(this);
        } else {
          return layout;
        }
      }
    }
  };

  Tower.Controller.Instrumentation = {
    ClassMethods: {
      baseClass: function() {
        if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Controller) {
          return this.__super__.constructor.baseClass();
        } else {
          return this;
        }
      },
      metadata: function() {
        var baseClassName, belongsTo, callbacks, className, collectionName, helpers, metadata, mimes, params, renderers, resourceName, resourceType, result, superMetadata;
        className = this.name;
        metadata = this.metadata[className];
        if (metadata) return metadata;
        baseClassName = this.baseClass().name;
        if (baseClassName !== className) {
          superMetadata = this.baseClass().metadata();
        } else {
          superMetadata = {};
        }
        resourceType = Tower.Support.String.singularize(this.name.replace(/(Controller)$/, ""));
        resourceName = this._compileResourceName(resourceType);
        collectionName = Tower.Support.String.camelize(this.name.replace(/(Controller)$/, ""), true);
        params = superMetadata.params ? _.clone(superMetadata.params) : {};
        callbacks = superMetadata.callbacks ? _.clone(superMetadata.callbacks) : {};
        renderers = superMetadata.renderers ? _.clone(superMetadata.renderers) : {};
        mimes = superMetadata.mimes ? _.clone(superMetadata.mimes) : {
          json: {},
          html: {}
        };
        helpers = superMetadata.helpers ? superMetadata.helpers.concat() : [];
        belongsTo = superMetadata.belongsTo ? superMetadata.belongsTo.concat() : [];
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
        parts = type.split(".");
        return resourceName = Tower.Support.String.camelize(parts[parts.length - 1], true);
      }
    },
    InstanceMethods: {
      call: function(request, response, next) {
        var _base;
        this.request = request;
        this.response = response;
        this.params = this.request.params || {};
        this.cookies = this.request.cookies || {};
        this.query = this.request.query || {};
        this.session = this.request.session || {};
        this.format = (_base = this.params).format || (_base.format = require('mime').extension(this.request.header("content-type")) || "html");
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
      },
      metadata: function() {
        return this.constructor.metadata();
      }
    }
  };

  Tower.Controller.Params = {
    ClassMethods: {
      param: function(key, options) {
        return this.params()[key] = Tower.HTTP.Param.create(key, options);
      },
      params: function() {
        var arg, key, value, _len7, _o;
        if (arguments.length) {
          for (_o = 0, _len7 = arguments.length; _o < _len7; _o++) {
            arg = arguments[_o];
            if (typeof arg === "object") {
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
        if (options == null) options = {};
        if (options.status) this.status = options.status;
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
        if (options.name) metadata.resourceName = options.name;
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
        if (!key) return belongsTo;
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
        var action, actions, actionsToRemove, args, options, _len7, _o;
        args = _.args(arguments);
        if (typeof args[args.length - 1] === "object") {
          options = args.pop();
        } else {
          options = {};
        }
        actions = ["index", "new", "create", "show", "edit", "update", "destroy"];
        actionsToRemove = _.difference(actions, args, options.except || []);
        for (_o = 0, _len7 = actionsToRemove.length; _o < _len7; _o++) {
          action = actionsToRemove[_o];
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
    createResource: function(callback) {
      var _this = this;
      return this.scoped(function(error, scope) {
        var resource;
        if (error) return callback.call(_this, error, null);
        resource = null;
        scope.create(_this.params[_this.resourceName], function(error, record) {
          _this[_this.resourceName] = _this.resource = resource = record;
          if (callback) return callback.call(_this, null, resource);
        });
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
      var belongsTo, param, params, relation, _len7, _o;
      belongsTo = this.constructor.belongsTo();
      params = this.params;
      if (belongsTo.length > 0) {
        for (_o = 0, _len7 = belongsTo.length; _o < _len7; _o++) {
          relation = belongsTo[_o];
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
        return callback.call(_this, error, scope.where(_this.criteria()));
      };
      if (this.hasParent) {
        this.findParent(function(error, parent) {
          if (error || !parent) {
            return callbackWithScope(error, Tower.constant(_this.resourceType));
          } else {
            return callbackWithScope(error, parent[_this.collectionName]());
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
        if (!resource) return _this.failure(error);
        return _this.respondWith(resource, callback);
      });
    },
    _create: function(callback) {
      var _this = this;
      return this.createResource(function(error, resource) {
        if (!resource) return _this.failure(error, callback);
        return _this.respondWithStatus(_.isBlank(resource.errors), callback);
      });
    },
    _show: function(callback) {
      var _this = this;
      this.__show = true;
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
          return _this.respondWithStatus(!!!error && _.isBlank(resource.errors), callback);
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
    }
  };

  Tower.Controller.Responder = (function() {

    Responder.respond = function(controller, options, callback) {
      var responder;
      responder = new this(controller, options);
      return responder.respond(callback);
    };

    function Responder(controller, options) {
      var format, _len7, _o, _ref7;
      if (options == null) options = {};
      this.controller = controller;
      this.options = options;
      _ref7 = this.controller.formats;
      for (_o = 0, _len7 = _ref7.length; _o < _len7; _o++) {
        format = _ref7[_o];
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
        var args, except, mimes, name, only, options, _len7, _o;
        mimes = this.mimes();
        args = _.args(arguments);
        if (typeof args[args.length - 1] === "object") {
          options = args.pop();
        } else {
          options = {};
        }
        if (options.only) only = _.toArray(options.only);
        if (options.except) except = _.toArray(options.except);
        for (_o = 0, _len7 = args.length; _o < _len7; _o++) {
          name = args[_o];
          mimes[name] = {};
          if (only) mimes[name].only = only;
          if (except) mimes[name].except = except;
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
          if (success) result.push(mime);
        }
        return result;
      }
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
        return $(this.dispatcher).on(name, options.target, function(event) {
          return _this._dispatch(event, handler);
        });
      },
      submitHandler: function(name, handler, options) {
        var _this = this;
        return $(this.dispatcher).on(name, options.target, function(event) {
          var elements, form, method, params, target;
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
            return _this._dispatch(event, handler, options);
          });
        }
        return this;
      },
      _dispatch: function(event, handler, options) {
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
          var elements, form, method, params, target;
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
    var array, coerce_types, cur, i, index, item, keys, keys_last, obj, param, val, _len7;
    obj = {};
    coerce_types = {
      "true": !0,
      "false": !1,
      "null": null
    };
    array = params.replace(/\+/g, " ").split("&");
    for (index = 0, _len7 = array.length; index < _len7; index++) {
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
      var eqlIndex, pair, pairs, result, value, _len7, _o;
      if (string == null) string = document.cookie;
      result = {};
      pairs = string.split(/[;,] */);
      for (_o = 0, _len7 = pairs.length; _o < _len7; _o++) {
        pair = pairs[_o];
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
      if (options == null) options = {};
      if (typeof options === "string") {
        options = {
          type: options
        };
      }
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
      var attribute, conditions, criteria, node, nodes, operator, set, _len7, _len8, _o, _p;
      nodes = this.parse(value);
      criteria = new Tower.Model.Criteria;
      for (_o = 0, _len7 = nodes.length; _o < _len7; _o++) {
        set = nodes[_o];
        for (_p = 0, _len8 = set.length; _p < _len8; _p++) {
          node = set[_p];
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
      var array, isRange, negation, string, values, _len7, _o,
        _this = this;
      values = [];
      array = value.toString().split(/[,\|]/);
      for (_o = 0, _len7 = array.length; _o < _len7; _o++) {
        string = array[_o];
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
      var array, isRange, string, values, _len7, _o,
        _this = this;
      values = [];
      array = value.toString().split(/[\s,\+]/);
      for (_o = 0, _len7 = array.length; _o < _len7; _o++) {
        string = array[_o];
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
      var array, isRange, negation, string, values, _len7, _o,
        _this = this;
      values = [];
      array = value.toString().split(/[,\|]/);
      for (_o = 0, _len7 = array.length; _o < _len7; _o++) {
        string = array[_o];
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
      var arrays, i, node, values, _len7,
        _this = this;
      arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/g);
      for (i = 0, _len7 = arrays.length; i < _len7; i++) {
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

    Route.byName = {};

    Route.create = function(route) {
      this.byName[route.name] = route;
      return this.store().push(route);
    };

    Route.find = function(name) {
      return this.byName[name];
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
      var controller, route, routes, _len7, _o;
      routes = Tower.Route.all();
      for (_o = 0, _len7 = routes.length; _o < _len7; _o++) {
        route = routes[_o];
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
      var capture, controller, i, keys, match, method, params, _len7, _name;
      match = this.match(request);
      if (!match) return null;
      method = request.method.toLowerCase();
      keys = this.keys;
      params = _.extend({}, this.defaults, request.query || {}, request.body || {});
      match = match.slice(1);
      for (i = 0, _len7 = match.length; i < _len7; i++) {
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
    }

    Route.prototype.get = function(name) {
      return this[name];
    };

    Route.prototype.match = function(requestOrPath) {
      var match, path;
      if (typeof requestOrPath === "string") {
        return this.pattern.exec(requestOrPath);
      }
      path = requestOrPath.location.path;
      if (!(_.indexOf(this.methods, requestOrPath.method.toUpperCase()) > -1)) {
        return null;
      }
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
      return this.matchMethod("get", _.args(arguments));
    };

    DSL.prototype.post = function() {
      return this.matchMethod("post", _.args(arguments));
    };

    DSL.prototype.put = function() {
      return this.matchMethod("put", _.args(arguments));
    };

    DSL.prototype["delete"] = function() {
      return this.matchMethod("delete", _.args(arguments));
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
      this._scope = _.extend({}, originalScope, options);
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
      var path;
      if (options == null) options = {};
      options.controller = name;
      path = "/" + name;
      if (this._scope.path) path = this._scope.path + path;
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
    };

    DSL.prototype.collection = function() {};

    DSL.prototype.member = function() {};

    DSL.prototype.root = function(options) {
      return this.match('/', _.extend({
        as: "root"
      }, options));
    };

    DSL.prototype._extractOptions = function() {
      var anchor, args, constraints, controller, defaults, format, method, name, options, path;
      args = _.args(arguments);
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
    };

    DSL.prototype._extractFormat = function(options) {};

    DSL.prototype._extractName = function(options) {
      return options.as || options.name;
    };

    DSL.prototype._extractConstraints = function(options) {
      return _.extend(this._scope.constraints || {}, options.constraints || {});
    };

    DSL.prototype._extractDefaults = function(options) {
      return options.defaults || {};
    };

    DSL.prototype._extractPath = function(options) {
      return "" + options.path + ".:format?";
    };

    DSL.prototype._extractRequestMethod = function(options) {
      return options.method || options.via || "GET";
    };

    DSL.prototype._extractAnchor = function(options) {
      return options.anchor;
    };

    DSL.prototype._extractController = function(options) {
      var controller, to;
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
      controller = Tower.Support.String.camelize(controller).replace(/(?:[cC]ontroller)?$/, "Controller");
      return {
        name: controller,
        action: action,
        className: controller
      };
    };

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

    Request.prototype.header = function() {};

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
          if (Tower.env === "test") Tower.Controller.testCase = controller;
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
