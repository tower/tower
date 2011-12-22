(function() {
  var Tower, key, module, specialProperties, _fn, _fn2, _i, _j, _len, _len2, _ref, _ref2;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; }, __slice = Array.prototype.slice, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.global || (window.global = window);

  module = window.module || {};

  Tower = window.Tower = new (Tower = (function() {

    function Tower() {}

    return Tower;

  })());

  window.Tower.logger = this["_console"] ? _console : console;

  Tower.Support = {};

  Tower.Support.Array = {
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

  specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods'];

  Tower.Class = (function() {

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
    load: function(pathOrObject, language) {
      var store;
      if (language == null) language = this.defaultLanguage;
      store = this.store();
      language = store[language] || (store[language] = {});
      Tower.Support.Object.deepMerge(language, typeof pathOrObject === "string" ? require(pathOrObject) : pathOrObject);
      return this;
    },
    defaultLanguage: "en",
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
      return this.isObject(object) && !(this.isFunction(object) || this.isArray(object));
    },
    isArray: Array.isArray || function(object) {
      return toString.call(object) === '[object Array]';
    },
    kind: function(object) {
      if (typeof object !== "object") return typeof object;
      if (object === null) return "null";
      if (object.constructor === (new Array).constructor) return "array";
      if (object.constructor === (new Date).constructor) return "date";
      if (object.constructor === (new RegExp).constructor) return "regex";
      return "object";
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
      return Tower.Support.String.underscore(Tower.Support.String.pluralize(string)).replace("_", "-");
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
    },
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

  Tower.Application = (function() {

    __extends(Application, Tower.Class);

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
      this.History = global.History;
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
      Tower.cookies = Tower.Net.Cookies.parse();
      return Tower.agent = new Tower.Net.Agent(JSON.parse(Tower.cookies["user-agent"] || '{}'));
    };

    Application.prototype.listen = function() {
      var self;
      self = this;
      if (this.listening) return;
      this.listening = true;
      if (this.History && this.History.enabled) {
        return this.History.Adapter.bind(global, "statechange", function() {
          var location, request, response, state;
          state = History.getState();
          location = new Tower.Net.Url(state.url);
          request = new Tower.Net.Request({
            url: state.url,
            location: location,
            params: Tower.Support.Object.extend({
              title: state.title
            }, state.data || {})
          });
          response = new Tower.Net.Response({
            url: state.url,
            location: location
          });
          return self.handle(request, response);
        });
      } else {
        return _console.warn("History not enabled");
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

  })();

  Tower.Support.Object.extend(Tower, {
    env: "development",
    port: 1597,
    version: "0.3.6",
    client: typeof window !== "undefined",
    root: "/",
    publicPath: "/",
    namespace: null,
    logger: typeof _console !== 'undefined' ? _console : console,
    stack: function() {
      try {
        throw new Error;
      } catch (error) {
        return error.stack;
      }
    },
    raise: function() {
      throw new Error(Tower.t.apply(Tower, arguments));
    },
    configure: function() {},
    initialize: function() {
      return Tower.Application.initialize();
    },
    t: function() {
      var _ref;
      return (_ref = Tower.Support.I18n).t.apply(_ref, arguments);
    },
    "case": "camelcase",
    urlFor: function() {
      var _ref;
      return (_ref = Tower.Route).urlFor.apply(_ref, arguments);
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
    accessors: true,
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
        namespace = Tower.namespace();
        if (namespace && parts[0] !== namespace) {
          Tower.constant("" + namespace + "." + string);
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
    }
  });

  Tower.Event = (function() {

    __extends(Event, Tower.Class);

    Event["for"] = function(object, key) {
      if (object.isEventEmitter) {
        return object.event(key);
      } else {
        return new Tower.Event(object, key);
      }
    };

    function Event(context, key) {
      this.context = context;
      this.key = key;
      this.handlers = [];
      this._preventCount = 0;
      this.context = context;
    }

    Event.prototype.isEvent = true;

    Event.prototype.addHandler = function(handler) {
      this.handlers.push(handler);
      if (this.oneShot) this.autofireHandler(handler);
      return this;
    };

    Event.prototype.removeHandler = function(handler) {
      this.handlers.splice(1, this.handlers.indexOf(handler));
      return this;
    };

    Event.prototype.handlerContext = function() {
      return this.context;
    };

    Event.prototype.prevent = function() {
      return ++this._preventCount;
    };

    Event.prototype.allow = function() {
      if (this._preventCount) --this._preventCount;
      return this._preventCount;
    };

    Event.prototype.isPrevented = function() {
      return this._preventCount > 0;
    };

    Event.prototype.autofireHandler = function(handler) {
      if (this._oneShotFired && (this._oneShotArgs != null)) {
        return handler.apply(this.handlerContext(), this._oneShotArgs);
      }
    };

    Event.prototype.resetOneShot = function() {
      this._oneShotFired = false;
      return this._oneShotArgs = null;
    };

    Event.prototype.fire = function() {
      var args, context, handler, handlers, _i, _len, _results;
      if (this.isPrevented() || this._oneShotFired) return false;
      context = this.handlerContext();
      args = arguments;
      handlers = this.handlers;
      if (this.oneShot) {
        this._oneShotFired = true;
        this._oneShotArgs = arguments;
      }
      _results = [];
      for (_i = 0, _len = handlers.length; _i < _len; _i++) {
        handler = handlers[_i];
        _results.push(handler.apply(context, args));
      }
      return _results;
    };

    Event.prototype.allowAndFire = function() {
      this.allow();
      return this.fire.apply(this, arguments);
    };

    return Event;

  })();

  Tower.Store = (function() {

    __extends(Store, Tower.Class);

    Store.defaultLimit = 100;

    Store.atomicModifiers = {
      "$set": "$set",
      "$unset": "$unset",
      "$push": "$push",
      "$pushAll": "$pushAll",
      "$pull": "$pull",
      "$pullAll": "$pullAll"
    };

    Store.reservedOperators = {
      "_sort": "_sort",
      "_limit": "_limit"
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
      "$nin": "$nin",
      "$any": "$any",
      "$all": "$all",
      "=~": "$regex",
      "$m": "$regex",
      "$regex": "$regex",
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
      klass = Tower.constant(this.className);
      return new klass(attributes);
    };

    Store.prototype.deserializeModel = function(model) {
      return model.attributes;
    };

    function Store(options) {
      if (options == null) options = {};
      this.name = options.name;
      this.className = options.className || Tower.namespaced(Tower.Support.String.camelize(Tower.Support.String.singularize(this.name)));
    }

    Store.prototype.find = function() {
      var callback, ids, options, query, _i;
      ids = 4 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 3) : (_i = 0, []), query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      if (ids.length === 1) {
        query.id = ids[0];
        return this.findOne(query, options, callback);
      } else {
        query.id = {
          $in: ids
        };
        return this.all(query, options, callback);
      }
    };

    Store.prototype.first = function(query, options, callback) {
      return this.findOne(query, options, callback);
    };

    Store.prototype.last = function(query, options, callback) {
      return this.findOne(query, options, callback);
    };

    Store.prototype.build = function(attributes, options, callback) {
      var record;
      record = this.serializeModel(attributes);
      if (callback) callback.call(this, null, record);
      return record;
    };

    Store.prototype.update = function() {
      var callback, ids, options, query, updates, _i;
      ids = 5 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 4) : (_i = 0, []), updates = arguments[_i++], query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      query.id = {
        $in: ids
      };
      return this.updateAll(updates, query, options, callback);
    };

    Store.prototype["delete"] = function() {
      var callback, ids, options, query, _i;
      ids = 4 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 3) : (_i = 0, []), query = arguments[_i++], options = arguments[_i++], callback = arguments[_i++];
      query.id = ids.length === 1 ? ids[0] : {
        $in: ids
      };
      return this.deleteAll(query, options, callback);
    };

    Store.prototype.schema = function() {
      return Tower.constant(this.className).schema();
    };

    return Store;

  })();

  Tower.Store.Memory = (function() {

    __extends(Memory, Tower.Store);

    function Memory(options) {
      Memory.__super__.constructor.call(this, options);
      this.records = {};
      this.lastId = 0;
    }

    return Memory;

  })();

  Tower.Store.Memory.Finders = {
    all: function(query, options, callback) {
      var key, limit, record, records, result, self, sort;
      result = [];
      records = this.records;
      self = this;
      if (Tower.Support.Object.isPresent(query)) {
        sort = options.sort;
        limit = options.limit || Tower.Store.defaultLimit;
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
    },
    first: function(query, options, callback) {
      var record;
      record = null;
      this.all(query, options, function(error, records) {
        record = records[0];
        if (callback) return callback.call(this, error, record);
      });
      return record;
    },
    last: function(query, options, callback) {
      var record;
      record = null;
      this.all(query, options, function(error, records) {
        record = records[records.length - 1];
        if (callback) return callback.call(this, error, record);
      });
      return record;
    },
    count: function(query, options, callback) {
      var result;
      result = 0;
      this.all(query, options, function(error, records) {
        result = records.length;
        if (callback) return callback.call(this, error, result);
      });
      return result;
    },
    sort: function() {
      var _ref;
      return (_ref = Tower.Support.Array).sortBy.apply(_ref, arguments);
    }
  };

  Tower.Store.Memory.Persistence = {
    create: function(attributes, options, callback) {
      var record, _ref;
      if ((_ref = attributes.id) == null) attributes.id = this.generateId();
      record = this.serializeModel(attributes);
      this.records[attributes.id] = record;
      if (callback) callback.call(this, null, record);
      return record;
    },
    updateAll: function(updates, query, options, callback) {
      var self;
      self = this;
      return this.all(query, options, function(error, records) {
        var i, key, record, value, _len;
        if (!error) {
          for (i = 0, _len = records.length; i < _len; i++) {
            record = records[i];
            for (key in updates) {
              value = updates[key];
              self._updateAttribute(record.attributes, key, value);
            }
          }
        }
        if (callback) return callback.call(this, error, records);
      });
    },
    deleteAll: function(query, options, callback) {
      var _records;
      _records = this.records;
      if (Tower.Support.Object.isBlank(query)) {
        return this.clear(callback);
      } else {
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
      }
    },
    clear: function(callback) {
      this.records = {};
      if (callback) callback.call(this, error, records);
      return this.records;
    }
  };

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

  Tower.Store.Memory.include(Tower.Store.Memory.Finders);

  Tower.Store.Memory.include(Tower.Store.Memory.Persistence);

  Tower.Store.Memory.include(Tower.Store.Memory.Serialization);

  Tower.Model = (function() {

    __extends(Model, Tower.Class);

    function Model(attrs) {
      var attributes, definition, definitions, key, name, value;
      if (attrs == null) attrs = {};
      definitions = this.constructor.fields();
      attributes = {};
      for (key in attrs) {
        value = attrs[key];
        attributes[key] = value;
      }
      for (name in definitions) {
        definition = definitions[name];
        if (!attrs.hasOwnProperty(name)) {
          attributes[name] || (attributes[name] = definition.defaultValue(this));
        }
      }
      this.attributes = attributes;
      this.changes = {};
      this.errors = {};
      this.readonly = false;
    }

    return Model;

  })();

  Tower.Model.Scope = (function() {
    var key, _fn, _i, _len, _ref;

    __extends(Scope, Tower.Class);

    Scope.scopes = ["where", "order", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within"];

    Scope.finders = ["find", "all", "first", "last", "count"];

    Scope.builders = ["build", "create", "update", "updateAll", "delete", "deleteAll", "destroy", "destroyAll"];

    function Scope(options) {
      if (options == null) options = {};
      this.model = options.model;
      this.criteria = options.criteria || new Tower.Model.Criteria;
    }

    _ref = Scope.scopes;
    _fn = function(_key) {
      return this.prototype[_key] = function() {
        var _ref2;
        (_ref2 = this.criteria)[_key].apply(_ref2, arguments);
        return this;
      };
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _fn.call(Scope, key);
    }

    Scope.prototype.find = function() {
      var callback, ids, _j, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), callback = arguments[_j++];
      return (_ref2 = this.store()).find.apply(_ref2, __slice.call(ids).concat([this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.all = function(callback) {
      console.log(this.criteria.query);
      return this.store().all(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.first = function(callback) {
      return this.store().first(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.last = function(callback) {
      return this.store().last(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.count = function(callback) {
      return this.store().count(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.build = function(attributes, callback) {
      return this.store().build(Tower.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, callback);
    };

    Scope.prototype.create = function(attributes, callback) {
      return this.store().create(Tower.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, callback);
    };

    Scope.prototype.update = function() {
      var callback, ids, updates, _j, _ref2;
      ids = 3 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 2) : (_j = 0, []), updates = arguments[_j++], callback = arguments[_j++];
      return (_ref2 = this.store()).update.apply(_ref2, __slice.call(ids).concat([updates], [this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.updateAll = function(updates, callback) {
      return this.store().updateAll(updates, this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype["delete"] = function() {
      var callback, ids, _j, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), callback = arguments[_j++];
      return (_ref2 = this.store())["delete"].apply(_ref2, __slice.call(ids).concat([this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.deleteAll = function(callback) {
      return this.store().deleteAll(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.destroy = function() {
      var callback, ids, _j, _ref2;
      ids = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), callback = arguments[_j++];
      return (_ref2 = this.store())["delete"].apply(_ref2, __slice.call(ids).concat([this.criteria.query], [this.criteria.options], [callback]));
    };

    Scope.prototype.destroyAll = function(callback) {
      return this.store().deleteAll(this.criteria.query, this.criteria.options, callback);
    };

    Scope.prototype.store = function() {
      return this.model.store();
    };

    Scope.prototype.merge = function(scope) {
      return this.criteria.merge(scope.criteria);
    };

    Scope.prototype.clone = function() {
      return new this({
        model: this.model,
        criteria: this.criteria.clone()
      });
    };

    return Scope;

  })();

  Tower.Model.Callbacks = {
    ClassMethods: {
      before: function() {},
      after: function() {},
      callback: function(phase) {}
    }
  };

  Tower.Model.Criteria = (function() {

    function Criteria(query, options) {
      if (query == null) query = {};
      if (options == null) options = {};
      this.query = query;
      this.options = options;
    }

    Criteria.prototype._mergeQuery = function(conditions) {
      if (conditions == null) conditions = {};
      return Tower.Support.Object.extend(this.query, conditions);
    };

    Criteria.prototype._mergeOptions = function(options) {
      if (options == null) options = {};
      return Tower.Support.Object.extend(this.options, options);
    };

    Criteria.prototype.where = function(conditions) {
      return this._mergeQuery(conditions);
    };

    Criteria.prototype.order = function(attribute, direction) {
      if (direction == null) direction = "asc";
      return this._mergeOptions({
        sort: [attribute, direction]
      });
    };

    Criteria.prototype.offset = function(number) {
      return this._mergeOptions({
        offset: number
      });
    };

    Criteria.prototype.limit = function(number) {
      return this._mergeOptions({
        limit: number
      });
    };

    Criteria.prototype.select = function() {
      return this._mergeOptions({
        fields: Tower.Support.Array.args(arguments)
      });
    };

    Criteria.prototype.joins = function() {
      return this._mergeOptions({
        joins: Tower.Support.Array.args(arguments)
      });
    };

    Criteria.prototype.includes = function() {
      return this._mergeOptions({
        includes: Tower.Support.Array.args(arguments)
      });
    };

    Criteria.prototype.paginate = function(options) {
      var limit, page;
      limit = options.perPage || options.limit;
      page = options.page || 0;
      this.limit(limit);
      return this.offset(page * limit);
    };

    Criteria.prototype.within = function(options) {
      return this;
    };

    Criteria.prototype.clone = function() {
      return new this(Tower.Support.Object.cloneHash(this.query), Tower.Support.Object.cloneHash(this.options));
    };

    Criteria.prototype.merge = function(criteria) {
      this._mergeQuery(criteria.query);
      return this._mergeOptions(criteria.options);
    };

    return Criteria;

  })();

  Tower.Model.Dirty = {
    isDirty: function() {
      return Tower.Support.Object.isPresent(this.changes);
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
    toUpdates: function() {
      var array, attributes, key, result, _ref;
      result = {};
      attributes = this.attributes;
      _ref = this.changes;
      for (key in _ref) {
        array = _ref[key];
        result[key] = attributes[key];
      }
      return result;
    }
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
      stiName: function() {},
      toParam: function() {
        return Tower.Support.String.parameterize(this.className());
      }
    },
    toLabel: function() {
      return this.className();
    },
    toPath: function() {
      return this.constructor.toParam() + "/" + this.toParam();
    },
    toParam: function() {
      return this.get("id").toString();
    }
  };

  Tower.Model.Inheritance = {
    _computeType: function() {}
  };

  Tower.Model.Relation = (function() {

    __extends(Relation, Tower.Class);

    function Relation(owner, name, options, callback) {
      var key, value;
      if (options == null) options = {};
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.owner = owner;
      this.name = name;
      this.targetClassName = this.type = Tower.namespaced(options.type || options.className || Tower.Support.String.camelize(Tower.Support.String.singularize(name)));
      this.dependent || (this.dependent = false);
      this.counterCache || (this.counterCache = false);
      if (!this.hasOwnProperty("cache")) this.cache = false;
      if (!this.hasOwnProperty("readOnly")) this.readOnly = false;
      if (!this.hasOwnProperty("validate")) this.validate = false;
      if (!this.hasOwnProperty("autoSave")) this.autoSave = false;
      if (!this.hasOwnProperty("touch")) this.touch = false;
      this.inverseOf || (this.inverseOf = void 0);
      if (!this.hasOwnProperty("polymorphic")) this.polymorphic = false;
      if (!this.hasOwnProperty("default")) this["default"] = false;
    }

    Relation.prototype.scoped = function(record) {
      return new this.constructor.Scope({
        model: Tower.constant(this.targetClassName),
        owner: record,
        relation: this
      });
    };

    Relation.Scope = (function() {

      __extends(Scope, Tower.Model.Scope);

      Scope.prototype.constructable = function() {
        return !!!this.relation.polymorphic;
      };

      function Scope(options) {
        if (options == null) options = {};
        Scope.__super__.constructor.apply(this, arguments);
        this.owner = options.owner;
        this.relation = options.relation;
        this.foreignKey = this.relation.foreignKey;
      }

      return Scope;

    })();

    return Relation;

  })();

  Tower.Model.Relation.BelongsTo = (function() {

    __extends(BelongsTo, Tower.Model.Relation);

    function BelongsTo(owner, name, options) {
      var self;
      if (options == null) options = {};
      BelongsTo.__super__.constructor.call(this, owner, name, options);
      owner.field("" + name + "Id", {
        type: "Id"
      });
      if (this.polymorphic) {
        owner.field("" + name + "Type", {
          type: "String"
        });
      }
      owner.prototype[name] = function(callback) {
        return this.relation(name).first(callback);
      };
      self = this;
      owner.prototype["build" + (Tower.Support.String.camelize(name))] = function(attributes, callback) {
        return this.buildRelation(name, attributes, callback);
      };
      owner.prototype["create" + (Tower.Support.String.camelize(name))] = function(attributes, callback) {
        return this.createRelation(name, attributes, callback);
      };
    }

    BelongsTo.Scope = (function() {

      __extends(Scope, BelongsTo.Scope);

      function Scope() {
        Scope.__super__.constructor.apply(this, arguments);
      }

      return Scope;

    })();

    return BelongsTo;

  })();

  Tower.Model.Relation.HasMany = (function() {

    __extends(HasMany, Tower.Model.Relation);

    /*
      # HasMany Relation
      #
      # Examples
      # 
      #     @hasMany "posts"
      #     @hasMany "articles", type: "Post"
      #     @hasMany "comments", as: "commentable"
    */

    function HasMany(owner, name, options) {
      if (options == null) options = {};
      HasMany.__super__.constructor.call(this, owner, name, options);
      this.polymorphic = options.hasOwnProperty("as");
      owner.prototype[name] = function() {
        return this.relation(name);
      };
      if (options.foreignKey) {
        this.foreignKey = options.foreignKey;
      } else if (this.as) {
        this.foreignKey = "" + this.as + "Id";
      } else {
        this.foreignKey = Tower.Support.String.camelize("" + owner.name + "Id", true);
      }
      if (this.polymorphic) {
        this.foreignType || (this.foreignType = "" + this.as + "Type");
      }
      if (this.cache) {
        if (typeof this.cache === "string") {
          this.cache = true;
          this.cacheKey = this.cacheKey;
        } else {
          this.cacheKey = Tower.Support.String.singularize(name) + "Ids";
        }
        this.owner.field(this.cacheKey, {
          type: "Array",
          "default": []
        });
      }
    }

    HasMany.Scope = (function() {

      __extends(Scope, HasMany.Scope);

      function Scope(options) {
        var defaults, id;
        if (options == null) options = {};
        Scope.__super__.constructor.call(this, options);
        id = this.owner.get("id");
        if (this.foreignKey) {
          defaults = {};
          if (id !== void 0) defaults[this.foreignKey] = id;
          if (this.relation.foreignType) {
            defaults[this.relation.foreignType] = this.owner.constructor.name;
          }
          this.where(defaults);
        }
      }

      Scope.prototype.create = function(attributes, callback) {
        var relation, self;
        self = this;
        relation = this.relation;
        return this.store().create(Tower.Support.Object.extend(this.criteria.query, attributes), this.criteria.options, function(error, record) {
          var updates;
          if (!error) {
            if (relation && relation.cache) {
              updates = {};
              updates[relation.cacheKey] = record.get("id");
              return self.owner.updateAttributes({
                "$push": updates
              }, callback);
            } else {
              if (callback) return callback.call(this, error, record);
            }
          } else {
            if (callback) return callback.call(this, error, record);
          }
        });
      };

      return Scope;

    })();

    return HasMany;

  })();

  Tower.Model.Relation.HasManyThrough = (function() {

    __extends(HasManyThrough, Tower.Model.Relation.HasMany);

    /*
      * HasManyThrough Relation
      * 
      * Examples
      * 
      *     @hasMany "comments", through: "articles"
      *
    */

    function HasManyThrough(owner, name, options) {
      if (options == null) options = {};
      HasManyThrough.__super__.constructor.call(this, owner, name, options);
    }

    HasManyThrough.Scope = (function() {

      __extends(Scope, HasManyThrough.Scope);

      function Scope(options) {
        if (options == null) options = {};
        Scope.__super__.constructor.call(this, options);
      }

      return Scope;

    })();

    return HasManyThrough;

  })();

  Tower.Model.Relation.HasOne = (function() {

    __extends(HasOne, Tower.Model.Relation);

    function HasOne() {
      HasOne.__super__.constructor.apply(this, arguments);
    }

    return HasOne;

  })();

  Tower.Model.Relation.HasOneThrough = (function() {

    __extends(HasOneThrough, Tower.Model.Relation.HasOne);

    function HasOneThrough() {
      HasOneThrough.__super__.constructor.apply(this, arguments);
    }

    return HasOneThrough;

  })();

  Tower.Model.Relations = {
    ClassMethods: {
      hasOne: function(name, options) {
        var relationClass;
        if (options && options.hasOwnProperty("through")) {
          relationClass = Tower.Model.Relation.HasOneThrough;
        } else {
          relationClass = Tower.Model.Relation.HasOne;
        }
        return this.relations()[name] = new relationClass(this, name, options);
      },
      hasMany: function(name, options) {
        var relationClass;
        if (options && options.hasOwnProperty("through")) {
          relationClass = Tower.Model.Relation.HasManyThrough;
        } else {
          relationClass = Tower.Model.Relation.HasMany;
        }
        return this.relations()[name] = new relationClass(this, name, options);
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
    InstanceMethods: {
      relation: function(name) {
        return this.constructor.relation(name).scoped(this);
      },
      buildRelation: function(name, attributes, callback) {
        return this.relation(name).build(attributes, callback);
      },
      createRelation: function(name, attributes, callback) {
        return this.relation(name).create(attributes, callback);
      }
    }
  };

  Tower.Model.Field = (function() {

    function Field(owner, name, options) {
      var key;
      if (options == null) options = {};
      this.owner = owner;
      this.name = key = name;
      this.type = options.type || "string";
      this._default = options["default"];
      this._encode = options.encode;
      this._decode = options.decode;
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

    Field.prototype.defaultValue = function(record) {
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

    Field.prototype.encode = function(value, binding) {
      return this.code(this._encode, value, binding);
    };

    Field.prototype.decode = function(value, binding) {
      return this.code(this._decode, value, binding);
    };

    Field.prototype.code = function(type, value, binding) {
      switch (type) {
        case "string":
          return binding[type].call(binding[type], value);
        case "function":
          return type.call(_encode, value);
        default:
          return value;
      }
    };

    return Field;

  })();

  Tower.Model.Fields = {
    ClassMethods: {
      field: function(name, options) {
        return this.fields()[name] = new Tower.Model.Field(this, name, options);
      },
      fields: function() {
        return this._fields || (this._fields = {});
      },
      schema: function() {
        return this.fields();
      }
    },
    InstanceMethods: {
      get: function(name) {
        if (!this.has(name)) {
          this.attributes[name] = this.constructor.fields()[name].defaultValue(this);
        }
        return this.attributes[name];
      },
      set: function(name, value) {
        var beforeValue;
        beforeValue = this._attributeChange(name, value);
        this.attributes[name] = value;
        return value;
      },
      has: function(name) {
        return this.attributes.hasOwnProperty(name);
      }
    }
  };

  Tower.Model.Persistence = {
    ClassMethods: {
      load: function(array) {
        var item, record, records, _i, _len;
        if (!Tower.Support.Object.isArray(array)) array = [array];
        records = this.store().records;
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          item = array[_i];
          record = item instanceof Tower.Model ? item : new this(item);
          records[record.id] = record;
        }
        return records;
      },
      build: function(attributes) {
        return new this(attributes);
      },
      create: function(attributes, callback) {
        return this.scoped().create(attributes, callback);
      },
      update: function() {
        var callback, ids, updates, _i, _ref;
        ids = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), updates = arguments[_i++], callback = arguments[_i++];
        return (_ref = this.scoped()).update.apply(_ref, __slice.call(ids).concat([updates], [callback]));
      },
      updateAll: function(updates, query, callback) {
        return this.scoped().updateAll(updates, query, callback);
      },
      destroy: function(query, callback) {
        return this.scoped().destroy(query, callback);
      },
      deleteAll: function() {
        return this.scoped().deleteAll();
      },
      store: function(value) {
        if (!value && this._store) return this._store;
        if (typeof value === "object") {
          this._store || (this._store = new this.defaultStore({
            name: this.collectionName(),
            className: Tower.namespaced(this.name)
          }));
          Tower.Support.Object.extend(this._store, value);
        } else if (value) {
          this._store = value;
        }
        this._store || (this._store = new this.defaultStore({
          name: this.collectionName(),
          className: Tower.namespaced(this.name)
        }));
        return this._store;
      },
      defaultStore: Tower.Store.Memory,
      collectionName: function() {
        return Tower.Support.String.camelize(Tower.Support.String.pluralize(this.name), true);
      },
      resourceName: function() {
        return Tower.Support.String.camelize(this.name, true);
      },
      clone: function(model) {}
    },
    InstanceMethods: {
      isNew: function() {
        return !!!this.attributes.id;
      },
      save: function(options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        if (options.validate !== false) {
          if (!this.validate()) {
            if (callback) callback.call(this, null, false);
            return false;
          }
        }
        if (this.isNew()) {
          this._create(callback);
        } else {
          this._update(this.toUpdates(), callback);
        }
        return true;
      },
      _update: function(attributes, callback) {
        var _this = this;
        this.constructor.update(this.id, attributes, function(error) {
          if (!error) _this.changes = {};
          if (callback) return callback.call(_this, error, !error);
        });
        return this;
      },
      _create: function(callback) {
        var _this = this;
        this.constructor.create(this.attributes, function(error, docs) {
          if (!error) _this.changes = {};
          if (callback) return callback.call(_this, error, !error);
        });
        return this;
      },
      updateAttributes: function(attributes, callback) {
        return this._update(attributes, callback);
      },
      "delete": function(callback) {
        var _this = this;
        if (this.isNew()) {
          if (callback) callback.apply(null, this);
        } else {
          this.constructor.destroy({
            id: this.id
          }, function(error) {
            if (!error) delete _this.attributes.id;
            if (callback) return callback.apply(_this, error);
          });
        }
        return this;
      },
      destroy: function(callback) {
        return this["delete"](function(error) {
          if (error) throw error;
          if (callback) return callback.apply(error, this);
        });
      },
      isPersisted: function() {
        return !!this.isNew();
      },
      toObject: function() {
        return this.attributes;
      },
      clone: function() {},
      reset: function() {},
      reload: function() {},
      toggle: function(name) {}
    }
  };

  Tower.Model.Atomic = {
    ClassMethods: {
      inc: function(attribute, amount) {
        if (amount == null) amount = 1;
      }
    },
    inc: function(attribute, amount) {
      if (amount == null) amount = 1;
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
      }
    }
  };

  _ref = Tower.Model.Scope.scopes;
  _fn = function(_key) {
    return Tower.Model.Scopes.ClassMethods[_key] = function() {
      var _ref2;
      return (_ref2 = this.scoped())[_key].apply(_ref2, arguments);
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    key = _ref[_i];
    _fn(key);
  }

  _ref2 = Tower.Model.Scope.finders;
  _fn2 = function(_key) {
    return Tower.Model.Scopes.ClassMethods[_key] = function() {
      var _ref3;
      return (_ref3 = this.scoped())[_key].apply(_ref3, arguments);
    };
  };
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    key = _ref2[_j];
    _fn2(key);
  }

  Tower.Model.NestedAttributes = {
    ClassMethods: {
      acceptsNestedAttributesFor: function() {}
    },
    assignNestedAttributesForOneToOneAssociation: function(associationName, attributes, assignmentOpts) {
      if (assignmentOpts == null) assignmentOpts = {};
    },
    assignNestedAttributesForCollectionAssociation: function(associationName, attributesCollection, assignmentOpts) {
      if (assignmentOpts == null) assignmentOpts = {};
    }
  };

  Tower.Model.Serialization = {
    ClassMethods: {
      fromJSON: function(data) {
        var i, record, records, _len3;
        records = JSON.parse(data);
        if (!(records instanceof Array)) records = [records];
        for (i = 0, _len3 = records.length; i < _len3; i++) {
          record = records[i];
          records[i] = new this(record);
        }
        return records;
      },
      fromForm: function(data) {},
      fromXML: function(data) {},
      toJSON: function(records, options) {
        if (options == null) options = {};
        return JSON.stringify(records);
      }
    },
    toXML: function() {},
    toJSON: function(options) {
      return this._serializableHash(options);
    },
    toObject: function() {
      return this.attributes;
    },
    clone: function() {
      return new this.constructor(Tower.Support.Object.clone(this.attributes));
    },
    _serializableHash: function(options) {
      var attributeNames, except, i, include, includes, methodNames, methods, name, only, opts, record, records, result, tmp, _k, _l, _len3, _len4, _len5, _len6, _m;
      if (options == null) options = {};
      result = {};
      attributeNames = Tower.Support.Object.keys(this.attributes);
      if (only = options.only) {
        attributeNames = _.union(Tower.Support.Object.toArray(only), attributeNames);
      } else if (except = options.except) {
        attributeNames = _.difference(Tower.Support.Object.toArray(except), attributeNames);
      }
      for (_k = 0, _len3 = attributeNames.length; _k < _len3; _k++) {
        name = attributeNames[_k];
        result[name] = this._readAttributeForSerialization(name);
      }
      if (methods = options.methods) {
        methodNames = Tower.Support.Object.toArray(methods);
        for (_l = 0, _len4 = methods.length; _l < _len4; _l++) {
          name = methods[_l];
          result[name] = this[name]();
        }
      }
      if (includes = options.include) {
        includes = Tower.Support.Object.toArray(includes);
        for (_m = 0, _len5 = includes.length; _m < _len5; _m++) {
          include = includes[_m];
          if (!Tower.Support.Object.isHash(include)) {
            tmp = {};
            tmp[include] = {};
            include = tmp;
            tmp = void 0;
          }
          for (name in include) {
            opts = include[name];
            records = this[name]().all();
            for (i = 0, _len6 = records.length; i < _len6; i++) {
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

  Tower.Model.States = {
    ClassMethods: {
      states: function(name) {
        return this.stateMachines()[name] = (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return typeof result === "object" ? result : child;
        })(Tower.Event.StateMachine, arguments, function() {});
      },
      stateMachines: function() {
        return this._stateMachines || (this._stateMachines = {});
      }
    }
  };

  Tower.Model.Validator = (function() {

    Validator.create = function(name, value, attributes) {
      switch (name) {
        case "presence":
          return new this.Presence(name, value, attributes);
        case "count":
        case "length":
        case "min":
        case "max":
          return new this.Length(name, value, attributes);
        case "format":
          return new this.Format(name, value, attributes);
      }
    };

    function Validator(name, value, attributes) {
      this.name = name;
      this.value = value;
      this.attributes = attributes;
    }

    Validator.prototype.validateEach = function(record, errors) {
      var attribute, success, _k, _len3, _ref3;
      success = true;
      _ref3 = this.attributes;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        attribute = _ref3[_k];
        if (!this.validate(record, attribute, errors)) success = false;
      }
      return success;
    };

    return Validator;

  })();

  Tower.Model.Validator.Format = (function() {

    function Format(value, attributes) {
      Format.__super__.constructor.call(this, value, attributes);
      this.value = typeof value === 'string' ? new RegExp(value) : value;
    }

    Format.prototype.validate = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!this.value.exec(value)) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Tower.t("model.errors.format", {
          attribute: attribute,
          value: this.value.toString()
        }));
        return false;
      }
      return true;
    };

    return Format;

  })();

  Tower.Model.Validator.Length = (function() {

    __extends(Length, Tower.Model.Validator);

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

    Length.prototype.validateMinimum = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value >= this.value)) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Tower.t("model.errors.minimum", {
          attribute: attribute,
          value: this.value
        }));
        return false;
      }
      return true;
    };

    Length.prototype.validateMaximum = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value <= this.value)) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Tower.t("model.errors.maximum", {
          attribute: attribute,
          value: this.value
        }));
        return false;
      }
      return true;
    };

    Length.prototype.validateLength = function(record, attribute, errors) {
      var value;
      value = record[attribute];
      if (!(typeof value === 'number' && value === this.value)) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Tower.t("model.errors.length", {
          attribute: attribute,
          value: this.value
        }));
        return false;
      }
      return true;
    };

    return Length;

  })();

  Tower.Model.Validator.Presence = (function() {

    __extends(Presence, Tower.Model.Validator);

    function Presence() {
      Presence.__super__.constructor.apply(this, arguments);
    }

    Presence.prototype.validate = function(record, attribute, errors) {
      if (!Tower.Support.Object.isPresent(record[attribute])) {
        errors[attribute] || (errors[attribute] = []);
        errors[attribute].push(Tower.t("model.errors.presence", {
          attribute: attribute
        }));
        return false;
      }
      return true;
    };

    return Presence;

  })();

  Tower.Model.Validator.Uniqueness = (function() {

    __extends(Uniqueness, Tower.Model.Validator);

    function Uniqueness() {
      Uniqueness.__super__.constructor.apply(this, arguments);
    }

    Uniqueness.prototype.validate = function(record, attribute, errors) {
      return true;
    };

    return Uniqueness;

  })();

  Tower.Model.Validations = {
    ClassMethods: {
      validates: function() {
        var attributes, key, options, validators, value, _results;
        attributes = Tower.Support.Array.args(arguments);
        options = attributes.pop();
        if (typeof options !== "object") {
          Tower.raise("missing_options", "" + this.name + ".validates");
        }
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
    validate: function() {
      var errors, success, validator, validators, _k, _len3;
      validators = this.constructor.validators();
      success = true;
      errors = this.errors = {};
      for (_k = 0, _len3 = validators.length; _k < _len3; _k++) {
        validator = validators[_k];
        if (!validator.validateEach(this, errors)) success = false;
      }
      return success;
    }
  };

  Tower.Model.Timestamp = {
    ClassMethods: function() {
      return {
        timestamps: function() {
          this.include(Tower.Model.Timestamp.CreatedAt);
          return this.include(Tower.Model.Timestamp.UpdatedAt);
        }
      };
    },
    CreatedAt: {
      ClassMethods: {}
    },
    UpdatedAt: {
      ClassMethods: {}
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

  Tower.Model.include(Tower.Model.Persistence);

  Tower.Model.include(Tower.Model.Atomic);

  Tower.Model.include(Tower.Model.Metadata);

  Tower.Model.include(Tower.Model.Dirty);

  Tower.Model.include(Tower.Model.Criteria);

  Tower.Model.include(Tower.Model.Scopes);

  Tower.Model.include(Tower.Model.States);

  Tower.Model.include(Tower.Model.Inheritance);

  Tower.Model.include(Tower.Model.Serialization);

  Tower.Model.include(Tower.Model.NestedAttributes);

  Tower.Model.include(Tower.Model.Relations);

  Tower.Model.include(Tower.Model.Validations);

  Tower.Model.include(Tower.Model.Callbacks);

  Tower.Model.include(Tower.Model.Fields);

  Tower.View = (function() {

    __extends(View, Tower.Class);

    View.extend({
      engine: "jade",
      prettyPrint: false,
      loadPaths: ["app/views"],
      store: function(store) {
        if (store) this._store = store;
        return this._store || (this._store = new Tower.Store.Memory({
          name: "view"
        }));
      }
    });

    function View(context) {
      if (context == null) context = {};
      this._context = context;
    }

    return View;

  })();

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
    javascripts: function(source) {
      var manifest, path, paths, result, _k, _len3;
      if (Tower.env === "production") {
        manifest = Tower.assetManifest;
        source = "" + source + ".js";
        if (manifest[source]) source = manifest[source];
        path = "/javascripts/" + source;
        if (Tower.assetHost) path = "" + Tower.assetHost + path;
        return this.javascriptTag(path);
      } else {
        paths = Tower.assets.javascripts[source];
        result = [];
        for (_k = 0, _len3 = paths.length; _k < _len3; _k++) {
          path = paths[_k];
          result.push(this.javascriptTag("/javascripts" + path + ".js"));
        }
        return result.join("");
      }
    },
    stylesheets: function(source) {
      var manifest, path, paths, result, _k, _len3;
      if (Tower.env === "production") {
        manifest = Tower.assetManifest;
        source = "" + source + ".css";
        if (manifest[source]) source = manifest[source];
        path = "/stylesheets/" + source;
        if (Tower.assetHost) path = "" + Tower.assetHost + path;
        return this.stylesheetTag(path);
      } else {
        paths = Tower.assets.stylesheets[source];
        result = [];
        for (_k = 0, _len3 = paths.length; _k < _len3; _k++) {
          path = paths[_k];
          result.push(this.stylesheetTag("/stylesheets" + path + ".css"));
        }
        return result.join("");
      }
    },
    t: function(string) {
      return Tower.translate(string);
    },
    l: function(object) {
      return Tower.localize(string);
    }
  };

  Tower.View.Rendering = {
    render: function(options, callback) {
      var self;
      options.type || (options.type = this.constructor.engine);
      if (!options.hasOwnProperty("layout") && this._context.layout) {
        options.layout = this._context.layout();
      }
      options.locals = this._renderingContext(options);
      self = this;
      return this._renderBody(options, function(error, body) {
        return self._renderLayout(body, options, callback);
      });
    },
    _renderBody: function(options, callback) {
      if (options.text) {
        return callback(null, options.text);
      } else if (options.json) {
        return callback(null, typeof options.json === "string" ? options.json : JSON.stringify(options.json));
      } else {
        if (!options.inline) {
          options.template = this._readTemplate(options.template, options.type);
        }
        return this._renderString(options.template, options, callback);
      }
    },
    _renderLayout: function(body, options, callback) {
      var layout;
      if (options.layout) {
        layout = this._readTemplate("layouts/" + options.layout, options.type);
        options.locals.yield = body;
        return this._renderString(layout, options, callback);
      } else {
        return callback(null, body);
      }
    },
    _renderString: function(string, options, callback) {
      var engine;
      if (options == null) options = {};
      if (options.type) {
        engine = require("shift").engine(options.type);
        return engine.render(string, options.locals, callback);
      } else {
        engine = require("shift");
        options.locals.string = string;
        return engine.render(options.locals, callback);
      }
    },
    _renderingContext: function(options) {
      var key, locals, value, _ref3;
      locals = this;
      _ref3 = this._context;
      for (key in _ref3) {
        value = _ref3[key];
        if (!key.match(/^(render|constructor)/)) this[key] = value;
      }
      locals = Tower.Support.Object.extend(locals, options.locals);
      if (this.constructor.prettyPrint) locals.pretty = true;
      return locals;
    },
    _readTemplate: function(path, ext) {
      var template;
      template = this.constructor.store().find({
        path: path,
        ext: ext
      });
      if (!template) throw new Error("Template '" + path + "' was not found.");
      return template;
    }
  };

  Tower.View.include(Tower.View.Rendering);

  Tower.View.include(Tower.View.Helpers);

  Tower.Controller = (function() {

    __extends(Controller, Tower.Class);

    Controller.extend(Tower.Support.EventEmitter);

    Controller.include(Tower.Support.EventEmitter);

    function Controller() {
      this.constructor.instance = this;
      this.headers = {};
      this.status = 200;
      this.request = null;
      this.response = null;
      this.contentType = "text/html";
      this.params = {};
      this.query = {};
      this.resourceName = this.constructor.resourceName();
      this.resourceType = this.constructor.resourceType();
      this.collectionName = this.constructor.collectionName();
      if (this.constructor._belongsTo) {
        this.hasParent = true;
      } else {
        this.hasParent = false;
      }
    }

    return Controller;

  })();

  Tower.Controller.Callbacks = {
    ClassMethods: {
      filters: function() {
        return this._filters || (this._filters = {
          before: [],
          after: []
        });
      },
      beforeFilter: function() {
        var args;
        args = Tower.Support.Array.args(arguments);
        this.filters().before.push({
          method: args.shift(),
          options: args.shift()
        });
        return this;
      },
      afterFilter: function() {}
    },
    runFilters: function(block, callback) {
      var afterFilters, beforeFilters, iterator, self;
      self = this;
      beforeFilters = this.constructor.filters().before;
      afterFilters = this.constructor.filters().after;
      iterator = function(filter, next) {
        var method, result;
        method = filter.method;
        if (typeof method === "string") {
          if (!self[method]) {
            throw new Error("Method '" + method + "' not defined on " + self.constructor.name);
          }
          method = self[method];
        }
        switch (method.length) {
          case 0:
            result = method.call(self);
            if (!result) return next(new Error("did not pass filter"));
            return next();
          default:
            return method.call(self, function(error, result) {
              if (error) return next(error);
              if (!result) return next(new Error("did not pass filter"));
              return next();
            });
        }
      };
      return require('async').forEachSeries(beforeFilters, iterator, function(error) {
        if (error) return callback(error);
        return block.call(self);
      });
    }
  };

  Tower.Controller.Helpers = {
    ClassMethods: {
      helper: function(object) {
        this._helpers || (this._helpers = []);
        return this._helpers.push(object);
      }
    },
    urlFor: function() {}
  };

  Tower.Controller.HTTP = {};

  Tower.Controller.Layouts = {
    ClassMethods: {
      layout: function(layout) {
        return this._layout = layout;
      },
      theme: function(theme) {
        return this._theme = theme;
      }
    },
    layout: function() {
      var layout;
      layout = this.constructor._layout;
      if (typeof layout === "function") {
        return layout.apply(this);
      } else {
        return layout;
      }
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
          callback.call(this);
        }
        return this._params || (this._params = {});
      },
      param: function(key, options) {
        if (options == null) options = {};
        this._params || (this._params = {});
        return this._params[key] = Tower.Net.Param.create(key, Tower.Support.Object.extend({}, this._paramsOptions || {}, options));
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
    },
    withParams: function(path, newParams) {
      var params, queryString;
      if (newParams == null) newParams = {};
      params = Tower.Support.Object.extend(this.query, newParams);
      if (Tower.Support.Object.blank(params)) return path;
      queryString = this.queryFor(params);
      return "" + path + "?" + query_string;
    },
    queryFor: function(params) {
      if (params == null) params = {};
    },
    paramOperators: function(key) {}
  };

  Tower.Controller.Processing = {
    call: function(request, response, next) {
      this.request = request;
      this.response = response;
      this.params = this.request.params || {};
      this.cookies = this.request.cookies || {};
      this.query = this.request.query || {};
      this.session = this.request.session || {};
      this.format = this.params.format;
      this.headers = {};
      this.callback = next;
      if (this.format && this.format !== "undefined" && Tower.Support["Path"]) {
        this.contentType = Tower.Support.Path.contentType(this.format);
      } else {
        this.contentType = "text/html";
      }
      return this.process();
    },
    process: function() {
      var block;
      var _this = this;
      this.processQuery();
      block = function(callback) {
        return _this[_this.params.action].call(_this, callback);
      };
      return this.runFilters(block, function(error) {
        console.log("ERROR in callback!");
        return console.log(error);
      });
    },
    processQuery: function() {},
    clear: function() {
      this.request = null;
      this.response = null;
      return this.headers = null;
    }
  };

  Tower.Controller.Redirecting = {
    redirectTo: function() {}
  };

  Tower.Controller.Rendering = {
    render: function() {
      var args, callback, options, self, view, _base;
      args = Tower.Support.Array.args(arguments);
      if (args.length >= 2 && typeof args[args.length - 1] === "function") {
        callback = args.pop();
      } else {
        callback = null;
      }
      if (args.length > 1 && typeof args[args.length - 1] === "object") {
        options = args.pop();
      }
      if (typeof args[0] === "object") {
        options = args[0];
      } else {
        options || (options = {});
        options.template = args[0];
      }
      view = new Tower.View(this);
      (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = this.contentType);
      self = this;
      return view.render.call(view, options, function(error, body) {
        if (error) {
          self.body = error.stack;
        } else {
          self.body = body;
        }
        if (callback) callback(error, body);
        if (self.callback) return self.callback();
      });
    },
    renderToBody: function(options) {
      this._processOptions(options);
      return this._renderTemplate(options);
    },
    renderToString: function() {
      var options;
      options = this._normalizeRender.apply(this, arguments);
      return this.renderToBody(options);
    },
    _renderTemplate: function(options) {
      return this.template.render(viewContext, options);
    }
  };

  Tower.Controller.Resources = {
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
        return this._resourceName || (this._resourceName = Tower.Support.String.camelize(this.resourceType(), true));
      },
      collectionName: function() {
        return this._collectionName || (this._collectionName = Tower.Support.String.pluralize(this.resourceName()));
      },
      belongsTo: function(key, options) {
        if (options == null) options = {};
        options.key = key;
        options.type || (options.type = Tower.Support.String.camelize(options.key));
        return this._belongsTo = options;
      },
      actions: function() {
        var action, actions, actionsToRemove, args, options, _k, _len3;
        args = Tower.Support.Array.args(arguments);
        if (typeof args[args.length - 1] === "object") {
          options = args.pop();
        } else {
          options = {};
        }
        actions = ["index", "new", "create", "show", "edit", "update", "destroy"];
        actionsToRemove = _.difference(actions, args, options.except || []);
        for (_k = 0, _len3 = actionsToRemove.length; _k < _len3; _k++) {
          action = actionsToRemove[_k];
          this[action] = null;
          delete this[action];
        }
        return this;
      }
    },
    index: function() {
      return this._index.apply(this, arguments);
    },
    "new": function() {
      return this._new.apply(this, arguments);
    },
    create: function() {
      return this._create.apply(this, arguments);
    },
    show: function() {
      return this._show.apply(this, arguments);
    },
    edit: function() {
      return this._edit.apply(this, arguments);
    },
    update: function() {
      return this._update.apply(this, arguments);
    },
    destroy: function() {
      return this._destroy.apply(this, arguments);
    },
    _index: function(callback) {
      return this.respondWithScoped(callback);
    },
    _new: function(callback) {
      return this.respondWithScoped(callback);
    },
    _create: function(callback) {
      var _this = this;
      return this.buildResource(function(error, resource) {
        if (!resource) return _this.failure(error);
        return resource.save(function(error, success) {
          return _this.respondWithStatus(success, callback);
        });
      });
    },
    _show: function(callback) {
      return this.respondWithScoped(callback);
    },
    _update: function(callback) {
      var _this = this;
      return this.findResource(function(error, resource) {
        if (!resource) return _this.failure(error);
        return resource.updateAttribute(_this.params[_this.resourceName], function(error, success) {
          return _this.respondWithStatus(success, callback);
        });
      });
    },
    _destroy: function(callback) {
      var _this = this;
      return this.findResource(function(error, resource) {
        if (!resource) return _this.failure(error);
        return resource.destroy(function(error, success) {
          return _this.respondWithStatus(success, callback);
        });
      });
    },
    respondWithScoped: function(callback) {
      var _this = this;
      return this.scoped(function(error, resource) {
        if (error) return _this.failure(error);
        return _this.respondWith(resource, callback);
      });
    },
    respondWithStatus: function(success, callback) {
      var failureResponder, format, formats, responder, successResponder;
      format = this.params.format || "html";
      formats = this.constructor.respondTo().concat();
      switch (callback.length) {
        case 0:
        case 1:
          responder = new Tower.Controller.Responder(formats);
          callback.call(this, responder);
          return responder[format].call(this);
        default:
          successResponder = new Tower.Controller.Responder(formats);
          failureResponder = new Tower.Controller.Responder(formats);
          callback.call(this, successResponder, failureResponder);
          if (success) {
            return successResponder[format].call(this);
          } else {
            return failureResponder[format].call(this, error);
          }
      }
    },
    buildResource: function(callback) {
      var _this = this;
      return this.scoped(function(scope) {
        var resource;
        _this[_this.resourceName] = _this.resource = resource = scope.build(_this.params[_this.resourceName]);
        if (callback) callback.call(_this, null, resource);
        return resource;
      });
    },
    findResource: function(callback) {
      var _this = this;
      return this.scoped(function(scope) {
        return scope.find(_this.params.id, function(error, resource) {
          _this[_this.resourceName] = _this.resource = resource;
          return callback.call(_this, error, resource);
        });
      });
    },
    findParent: function(callback) {
      var association, param, parentClass;
      var _this = this;
      association = this.constructor._belongsTo;
      if (association) {
        param = association.param || ("" + association.key + "Id");
        parentClass = Tower.constant(association.type);
        return parentClass.find(this.params[param], function(error, parent) {
          return _this.parent = _this[association.key] = parent;
        });
      } else {
        if (callback) callback.call(this, null, false);
        return false;
      }
    },
    scoped: function(callback) {
      var _this = this;
      if (this._scope) {
        if (callback) callback.call(this, this._scope);
        return this._scope;
      }
      if (this.hasParent) {
        return this.findParent(function(error, parent) {
          return callback.call(_this, error, _this.parent[_this.collectionName]);
        });
      } else {
        return callback.call(this, null, Tower.constant(this.resourceType));
      }
    }
  };

  Tower.Controller.Responding = {
    ClassMethods: {
      respondTo: function() {
        this._respondTo || (this._respondTo = []);
        return this._respondTo = this._respondTo.concat(Tower.Support.Array.args(arguments));
      }
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
      return this.respond(callback);
    },
    respond: function(callback) {
      var data;
      if (callback) {
        return callback.call(this);
      } else {
        data = args;
        switch (this.format) {
          case "json":
            return this.render({
              json: data
            });
          case "xml":
            return this.render({
              xml: data
            });
          default:
            return this.render({
              action: this.action
            });
        }
      }
    }
  };

  Tower.Controller.Sockets = {
    broadcast: function() {},
    emit: function() {}
  };

  Tower.Controller.include(Tower.Controller.Callbacks);

  Tower.Controller.include(Tower.Controller.Helpers);

  Tower.Controller.include(Tower.Controller.HTTP);

  Tower.Controller.include(Tower.Controller.Layouts);

  Tower.Controller.include(Tower.Controller.Params);

  Tower.Controller.include(Tower.Controller.Processing);

  Tower.Controller.include(Tower.Controller.Redirecting);

  Tower.Controller.include(Tower.Controller.Rendering);

  Tower.Controller.include(Tower.Controller.Resources);

  Tower.Controller.include(Tower.Controller.Responding);

  Tower.Controller.include(Tower.Controller.Sockets);

  Tower.Net = {};

  Tower.Net.Agent = (function() {

    function Agent(attributes) {
      var key, value;
      if (attributes == null) attributes = {};
      for (key in attributes) {
        value = attributes[key];
        this[key] = value;
      }
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

  Tower.Net.Cookies = (function() {

    Cookies.parse = function(string) {
      var eqlIndex, pair, pairs, result, value, _k, _len3;
      if (string == null) string = document.cookie;
      result = {};
      pairs = string.split(/[;,] */);
      for (_k = 0, _len3 = pairs.length; _k < _len3; _k++) {
        pair = pairs[_k];
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

  Tower.Net.Param = (function() {

    Param.perPage = 20;

    Param.sortDirection = "ASC";

    Param.sortKey = "sort";

    Param.limitKey = "limit";

    Param.pageKey = "page";

    Param.separator = "_";

    Param.operators = {
      gte: ":value..t",
      gt: ":value...t",
      lte: "t..:value",
      lte: "t...:value",
      rangeInclusive: ":i..:f",
      rangeExclusive: ":i...:f",
      "in": [",", "+OR+"],
      nin: "-",
      all: "[:value]",
      nil: "[-]",
      notNil: "[+]",
      asc: ["+", ""],
      desc: "-",
      geo: ":lat,:lng,:radius"
    };

    Param.create = function(key, options) {
      options.type || (options.type = "String");
      return new Tower.Net.Param[options.type](key, options);
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
      var result;
      return result = this.parse(value);
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

  Tower.Net.Param.String = (function() {

    __extends(String, Tower.Net.Param);

    function String() {
      String.__super__.constructor.apply(this, arguments);
    }

    String.prototype.parse = function(value) {
      var arrays, i, node, values, _len3;
      var _this = this;
      arrays = value.split(/(?:[\s|\+]OR[\s|\+]|\||,)/);
      for (i = 0, _len3 = arrays.length; i < _len3; i++) {
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
            operators = [exact ? "!=" : "!~"];
          } else {
            operators = [exact ? "=" : "=~"];
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

    String.prototype.toCriteria = function(value) {
      var node, nodes, result, _k, _len3, _name;
      nodes = String.__super__.toCriteria.call(this, value)[0];
      result = {};
      for (_k = 0, _len3 = nodes.length; _k < _len3; _k++) {
        node = nodes[_k];
        result[_name = node.attribute] || (result[_name] = {});
        result[node.attribute][node.operators[0]] = node.value;
      }
      return result;
    };

    return String;

  })();

  Tower.Net.Route = (function() {

    __extends(Route, Tower.Class);

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
      return callback.apply(new Tower.Net.Route.DSL(this));
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
      var constraints, key, value, _results;
      constraints = this.constraints;
      switch (typeof constraints) {
        case "object":
          _results = [];
          for (key in constraints) {
            value = constraints[key];
            switch (typeof value) {
              case "string":
              case "number":
                if (request[key] !== value) {
                  return false;
                } else {
                  _results.push(void 0);
                }
                break;
              case "function":
              case "object":
                if (!request.location[key].match(value)) {
                  return false;
                } else {
                  _results.push(void 0);
                }
                break;
              default:
                _results.push(void 0);
            }
          }
          return _results;
          break;
        case "function":
          return constraints.call(request, request);
        default:
          return false;
      }
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

  })();

  Tower.Route = Tower.Net.Route;

  Tower.Net.Route.DSL = (function() {

    function DSL() {
      this._scope = {};
    }

    DSL.prototype.match = function() {
      this.scope || (this.scope = {});
      return Tower.Net.Route.create(new Tower.Net.Route(this._extractOptions.apply(this, arguments)));
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

    /*
      * Scopes routes to a specific namespace. For example:
      * 
      * ```coffeescript
      * namespace "admin", ->
      *   resources "posts"
      * ```
      * 
      * This generates the following routes:
      * 
      *       adminPosts GET    /admin/posts(.:format)          admin/posts#index
      *       adminPosts POST   /admin/posts(.:format)          admin/posts#create
      *    newAdminPost GET    /admin/posts/new(.:format)      admin/posts#new
      *   editAdminPost GET    /admin/posts/:id/edit(.:format) admin/posts#edit
      *        adminPost GET    /admin/posts/:id(.:format)      admin/posts#show
      *        adminPost PUT    /admin/posts/:id(.:format)      admin/posts#update
      *        adminPost DELETE /admin/posts/:id(.:format)      admin/posts#destroy
      * 
      * ## Options
      * 
      * The +:path+, +:as+, +:module+, +:shallowPath+ and +:shallowPrefix+
      * options all default to the name of the namespace.
      * 
      * For options, see <tt>Base#match</tt>. For +:shallowPath+ option, see
      * <tt>Resources#resources</tt>.
      * 
      * ## Examples
      * 
      * ``` coffeescript
      * # accessible through /sekret/posts rather than /admin/posts
      * namespace "admin", path: "sekret", ->
      *   resources "posts"
      * 
      * # maps to <tt>Sekret::PostsController</tt> rather than <tt>Admin::PostsController</tt>
      * namespace "admin", module: "sekret", ->
      *   resources "posts"
      * 
      * # generates +sekretPostsPath+ rather than +adminPostsPath+
      * namespace "admin", as: "sekret", ->
      *   resources "posts"
      * ```
      * 
      * @param {String} path
    */

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

  Tower.Net.Route.Urls = {
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

  Tower.Net.Route.PolymorphicUrls = {
    ClassMethods: {
      polymorphicUrl: function() {}
    }
  };

  Tower.Net.Route.include(Tower.Net.Route.Urls);

  Tower.Net.Route.include(Tower.Net.Route.PolymorphicUrls);

  Tower.Net.Request = (function() {

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

  Tower.Net.Response = (function() {

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

    return Response;

  })();

  Tower.Net.Url = (function() {

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

  Tower.Middleware.Location = function(request, response, next) {
    request.location || (request.location = new Tower.Net.Url(request.url.match(/^http/) ? request.url : "http://" + request.headers.host + request.url));
    return next();
  };

  Tower.Middleware.Router = function(request, response, callback) {
    Tower.Middleware.Router.find(request, response, function(controller) {
      if (controller) {
        response.writeHead(200, controller.headers);
        response.write(controller.body);
        response.end();
        return controller.clear();
      } else {
        return Tower.Middleware.Router.error(request, response);
      }
    });
    return response;
  };

  Tower.Support.Object.extend(Tower.Middleware.Router, {
    find: function(request, response, callback) {
      var controller, route, routes, _k, _len3;
      routes = Tower.Route.all();
      this.processHost(request, response);
      this.processAgent(request, response);
      for (_k = 0, _len3 = routes.length; _k < _len3; _k++) {
        route = routes[_k];
        controller = this.processRoute(route, request, response);
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
    },
    processHost: function(request, response) {
      return request.location || (request.location = new Tower.Net.Url(request.url));
    },
    processAgent: function(request, response) {
      if (request.headers) {
        return request.userAgent || (request.userAgent = request.headers["user-agent"]);
      }
    },
    processRoute: function(route, request, response) {
      var capture, controller, i, keys, match, method, params, _len3;
      match = route.match(request);
      if (!match) return null;
      method = request.method.toLowerCase();
      keys = route.keys;
      params = Tower.Support.Object.extend({}, route.defaults, request.query || {}, request.body || {});
      match = match.slice(1);
      for (i = 0, _len3 = match.length; i < _len3; i++) {
        capture = match[i];
        params[keys[i].name] = capture ? decodeURIComponent(capture) : null;
      }
      controller = route.controller;
      if (controller) params.action = controller.action;
      request.params = params;
      if (controller) {
        controller = new (Tower.constant(Tower.namespaced(route.controller.className)));
      }
      return controller;
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
