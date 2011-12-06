(function() {
  var Metro, Namespace, specialProperties;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; }, __slice = Array.prototype.slice;

  window.global || (window.global = window);

  window.Metro = new (Metro = (function() {

    function Metro() {}

    return Metro;

  })());

  Metro.Support.Object.extend(Metro, {
    env: "development",
    port: 1597,
    version: "0.2.6",
    client: typeof window !== "undefined",
    root: "/",
    publicPath: "/",
    namespace: null,
    logger: typeof _console !== 'undefined' ? _console : console,
    raise: function() {
      throw new Error(Metro.t.apply(Metro, arguments));
    },
    configure: function() {},
    initialize: function() {
      return Metro.Application.initialize();
    },
    t: function() {
      var _ref;
      return (_ref = Metro.Support.I18n).t.apply(_ref, arguments);
    },
    "case": "camelcase",
    stringify: function() {
      var string;
      string = Metro.Support.Array.args(arguments).join("_");
      switch (Metro["case"]) {
        case "snakecase":
          return Metro.Support.String.underscore(string);
        default:
          return Metro.Support.String.camelcase(string);
      }
    },
    namespace: function() {
      return Metro.Application.instance().constructor.name;
    },
    accessors: true,
    constant: function(string) {
      var node, part, parts, _i, _len;
      node = global;
      try {
        parts = string.split(".");
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          node = node[part];
        }
      } catch (error) {
        throw new Error("Constant '" + string + "' wasn't found");
      }
      return node;
    },
    namespaced: function(string) {
      var namespace;
      namespace = Metro.namespace();
      if (namespace) {
        return "" + namespace + "." + string;
      } else {
        return string;
      }
    }
  });

  Metro.Application.Client = (function() {

    __extends(Client, Metro.Object);

    function Client(middleware) {
      var _i, _len, _middleware;
      if (middleware == null) middleware = [];
      this.stack = [];
      for (_i = 0, _len = middleware.length; _i < _len; _i++) {
        _middleware = middleware[_i];
        this.use(_middleware);
      }
      this.History = global.History;
    }

    Client.prototype.initialize = function() {
      this.extractAgent();
      this.use(Metro.Middleware.Router);
      return this;
    };

    Client.prototype.extractAgent = function() {
      return Metro.agent = new Metro.Net.Agent({
        os: navigator,
        ip: navigator,
        browser: navigator,
        language: navigator
      });
    };

    Client.prototype.use = function(route, handle) {
      this.route = "/";
      if ("string" !== typeof route) {
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

    Client.prototype.listen = function() {
      var self;
      self = this;
      if (this.listening) return;
      this.listening = true;
      if (this.History && this.History.enabled) {
        return this.History.Adapter.bind(global, "statechange", function() {
          var parsedUrl, request, response, state;
          state = History.getState();
          parsedUrl = new Metro.Route.Url(state.url);
          request = new Request({
            url: state.url,
            parsedUrl: parsedUrl,
            params: _.extend({
              title: state.title
            }, state.data || {})
          });
          response = new Response({
            url: state.url,
            parsedUrl: parsedUrl
          });
          return self.handle(request, response);
        });
      } else {
        return _console.warn("History not enabled");
      }
    };

    Client.prototype.run = function() {
      return this.listen();
    };

    Client.prototype.handle = function(request, response, out) {
      var env, index, next, removed, stack, writeHead;
      env = Metro.env;
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
          path = request.pathname;
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

    return Client;

  })();

  Metro.Support = {};

  Metro.Support.Array = {
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
        var bspecialProperties;
        return arrayComparator(a, bspecialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods']);
      });
    }
  };

  Metro.Class = (function() {

    function Class() {}

    Class.alias = function(to, from) {
      return Metro.Support.Object.alias(this.prototype, to, from);
    };

    Class.accessor = function(key, callback) {
      Metro.Support.Object.accessor(this.prototype, key, callback);
      return this;
    };

    Class.getter = function(key, callback) {
      Metro.Support.Object.getter(this.prototype, key, callback);
      return this;
    };

    Class.setter = function(key) {
      Metro.Support.Object.setter(this.prototype, key);
      return this;
    };

    Class.classAlias = function(to, from) {
      Metro.Support.Object.alias(this, to, from);
      return this;
    };

    Class.classAccessor = function(key, callback) {
      Metro.Support.Object.accessor(this, key, callback);
      return this;
    };

    Class.classGetter = function(key, callback) {
      Metro.Support.Object.getter(this, key, callback);
      return this;
    };

    Class.classSetter = function(key) {
      Metro.Support.Object.setter(this, key);
      return this;
    };

    Class.classEval = function(block) {
      return block.call(this);
    };

    Class.delegate = function(key, options) {
      if (options == null) options = {};
      Metro.Support.Object.delegate(this.prototype, key, options);
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

    Class.instanceMethods = function() {
      return Metro.Support.Object.methods(this.prototype);
    };

    Class.classMethods = function() {
      return Metro.Support.Object.methods(this);
    };

    Class.className = function() {
      return Metro.Support.Object.functionName(this);
    };

    Class.prototype.className = function() {
      return this.constructor.className();
    };

    return Class;

  })();

  Metro.Support.EventEmitter = {
    isEventEmitter: true,
    events: function() {
      return this._events || (this._events = {});
    },
    hasEvent: function(key) {
      return Metro.Support.Object.isPresent(this.events(), key);
    },
    event: function(key) {
      var _base;
      return (_base = events())[key] || (_base[key] = new Metro.Event(this, key));
    },
    on: function(key, handler) {
      return this.event(key).addHandler(handler);
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
      return this.event(key).fire(Metro.Support.Array.args(arguments, 1));
    },
    allowAndFire: function(key) {
      return this.event(key).allowAndFire(Metro.Support.Array.args(arguments, 1));
    }
  };

  Metro.Support.I18n = {
    load: function(pathOrObject, language) {
      var store;
      if (language == null) language = this.defaultLanguage;
      store = this.store();
      language = store[language] || (store[language] = {});
      Metro.Support.Object.deepMerge(language, typeof pathOrObject === "string" ? require(pathOrObject) : pathOrObject);
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
      return this.interpolator().render(this.lookup(key, options.language), {
        locals: options
      });
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
    interpolator: function() {
      return this._interpolator || (this._interpolator = new (require('shift').Mustache));
    }
  };

  Metro.Support.I18n.t = Metro.Support.I18n.translate;

  Metro.Support.Number = {
    isInt: function(n) {
      return n === +n && n === (n | 0);
    },
    isFloat: function(n) {
      return n === +n && n !== (n | 0);
    }
  };

  specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods'];

  Metro.Support.Object = {
    extend: function(object) {
      var args, key, node, value, _i, _len;
      args = Metro.Support.Array.args(arguments, 1);
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        node = args[_i];
        for (key in node) {
          value = node[key];
          if (__indexOf.call(specialProperties, key) < 0) object[key] = value;
        }
      }
      return object;
    },
    deepMerge: function(object) {
      var args, key, node, value, _i, _len;
      args = Metro.Support.Array.args(arguments, 1);
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        node = args[_i];
        for (key in node) {
          value = node[key];
          if (__indexOf.call(specialProperties, key) < 0) {
            if (typeof value === 'object' && object[key]) {
              object[key] = Metro.Support.Object.deepMerge(object[key], value);
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
    }
  };

  Metro.Support.RegExp = {
    regexpEscape: function(string) {
      return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
  };

  Metro.Support.String = {
    camelize_rx: /(?:^|_|\-)(.)/g,
    capitalize_rx: /(^|\s)([a-z])/g,
    underscore_rx1: /([A-Z]+)([A-Z][a-z])/g,
    underscore_rx2: /([a-z\d])([A-Z])/g,
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

  Metro.Object = (function() {

    __extends(Object, Metro.Class);

    function Object() {
      Object.__super__.constructor.apply(this, arguments);
    }

    Object.extend(Metro.Support.EventEmitter);

    Object.include(Metro.Support.EventEmitter);

    return Object;

  })();

  module.exports = Metro.Object;

  Metro.Model = (function() {

    __extends(Model, Metro.Object);

    function Model(attrs) {
      var attributes, definition, definitions, key, name, value;
      if (attrs == null) attrs = {};
      definitions = this.constructor.keys();
      attributes = {};
      for (key in attrs) {
        value = attrs[key];
        attributes[key] = this.typecast(key, value);
      }
      for (name in definitions) {
        definition = definitions[name];
        if (!attrs.hasOwnProperty(name)) {
          attributes[name] || (attributes[name] = this.typecast(name, definition.defaultValue(this)));
        }
      }
      this.attributes = attributes;
      this.changes = {};
      this.associations = {};
      this.errors = [];
    }

    Model.prototype.toLabel = function() {
      return this.className();
    };

    Model.prototype.toPath = function() {
      return this.constructor.toParam() + "/" + this.toParam();
    };

    Model.prototype.toParam = function() {
      return this.get("id").toString();
    };

    Model.toParam = function() {
      return Metro.Support.String.parameterize(this.className());
    };

    return Model;

  })();

  Metro.Model.Scope = (function() {

    function Scope(sourceClassName) {
      this.sourceClassName = sourceClassName;
      this.conditions = [];
    }

    Scope.prototype.where = function() {
      this.conditions.push(["where", arguments]);
      return this;
    };

    Scope.prototype.order = function() {
      this.conditions.push(["order", arguments]);
      return this;
    };

    Scope.prototype.limit = function() {
      this.conditions.push(["limit", arguments]);
      return this;
    };

    Scope.prototype.select = function() {
      this.conditions.push(["select", arguments]);
      return this;
    };

    Scope.prototype.joins = function() {
      this.conditions.push(["joins", arguments]);
      return this;
    };

    Scope.prototype.includes = function() {
      this.conditions.push(["includes", arguments]);
      return this;
    };

    Scope.prototype.within = function() {
      this.conditions.push(["within", arguments]);
      return this;
    };

    Scope.prototype.all = function(callback) {
      return this.store().all(this.query(), callback);
    };

    Scope.prototype.first = function(callback) {
      return this.store().first(this.query(), callback);
    };

    Scope.prototype.last = function(callback) {
      return this.store().last(this.query(), callback);
    };

    Scope.prototype.store = function() {
      return Metro.constant(this.sourceClassName).store();
    };

    Scope.prototype.query = function() {
      var condition, conditions, item, key, result, value, _i, _len;
      conditions = this.conditions;
      result = {};
      for (_i = 0, _len = conditions.length; _i < _len; _i++) {
        condition = conditions[_i];
        switch (condition[0]) {
          case "where":
            item = condition[1][0];
            for (key in item) {
              value = item[key];
              result[key] = value;
            }
            break;
          case "order":
            result._sort = condition[1][0];
        }
      }
      return result;
    };

    return Scope;

  })();

  Metro.Model.Association = (function() {

    __extends(Association, Metro.Object);

    function Association(owner, name, options) {
      if (options == null) options = {};
      if (Metro.accessors) {
        Metro.Support.Object.defineProperty(owner.prototype, name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this.association(name);
          },
          set: function(value) {
            return this.association(name).set(value);
          }
        });
      }
      this.owner = owner;
      this.name = name;
      this.targetClassName = Metro.namespaced(options.className || Metro.Support.String.camelize(name));
    }

    Association.prototype.scoped = function(record) {
      return (new Metro.Model.Scope(this.targetClassName)).where(this.conditions(record));
    };

    Association.prototype.conditions = function(record) {
      var result;
      result = {};
      if (this.foreignKey && record.id) result[this.foreignKey] = record.id;
      return result;
    };

    Association.delegate("where", "find", "all", "first", "last", "store", {
      to: "scoped"
    });

    return Association;

  })();

  require('./association/belongsTo');

  require('./association/hasMany');

  require('./association/hasOne');

  Metro.Model.Associations = {
    ClassMethods: {
      associations: function() {
        return this._associations || (this._associations = {});
      },
      association: function(name) {
        var association;
        association = this.associations()[name];
        if (!association) {
          throw new Error("Reflection for '" + name + "' does not exist on '" + this.name + "'");
        }
        return association;
      },
      hasOne: function(name, options) {
        if (options == null) options = {};
      },
      hasMany: function(name, options) {
        if (options == null) options = {};
        return this.associations()[name] = new Metro.Model.Association.HasMany(this, name, options);
      },
      belongsTo: function(name, options) {
        var association;
        if (options == null) options = {};
        this.associations()[name] = association = new Metro.Model.Association.BelongsTo(this, name, options);
        this.key("" + name + "Id");
        return association;
      }
    },
    InstanceMethods: {
      association: function(name) {
        var _base;
        return (_base = this.associations)[name] || (_base[name] = this.constructor.association(name).scoped(this));
      }
    }
  };

  Metro.Model.Attribute = (function() {

    function Attribute(name, options) {
      if (options == null) options = {};
      this.name = name;
      this.type = options.type || "string";
      this._default = options["default"];
      this.typecastMethod = (function() {
        switch (this.type) {
          case Array:
          case "array":
            return this._typecastArray;
          case Date:
          case "date":
          case "time":
            return this._typecastDate;
          case Number:
          case "number":
          case "integer":
            return this._typecastInteger;
          case "float":
            return this._typecastFloat;
          default:
            return this._typecastString;
        }
      }).call(this);
    }

    Attribute.prototype.typecast = function(value) {
      return this.typecastMethod.call(this, value);
    };

    Attribute.prototype._typecastArray = function(value) {
      return value;
    };

    Attribute.prototype._typecastString = function(value) {
      return value;
    };

    Attribute.prototype._typecastDate = function(value) {
      return value;
    };

    Attribute.prototype._typecastInteger = function(value) {
      if (value === null || value === void 0) return null;
      return parseInt(value);
    };

    Attribute.prototype._typecastFloat = function(value) {
      if (value === null || value === void 0) return null;
      return parseFloat(value);
    };

    Attribute.prototype.defaultValue = function(record) {
      var _default;
      _default = this._default;
      switch (typeof _default) {
        case 'function':
          return _default.call(record);
        default:
          return _default;
      }
    };

    return Attribute;

  })();

  Metro.Model.Attributes = {
    ClassMethods: {
      key: function(key, options) {
        if (options == null) options = {};
        this.keys()[key] = new Metro.Model.Attribute(key, options);
        if (Metro.accessors) {
          Object.defineProperty(this.prototype, key, {
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
        return this;
      },
      keys: function() {
        return this._keys || (this._keys = {});
      },
      attribute: function(name) {
        var attribute;
        attribute = this.keys()[name];
        if (!attribute) {
          throw new Error("Attribute '" + name + "' does not exist on '" + this.name + "'");
        }
        return attribute;
      }
    },
    InstanceMethods: {
      typecast: function(name, value) {
        return this.constructor.attribute(name).typecast(value);
      },
      get: function(name) {
        var _base;
        return (_base = this.attributes)[name] || (_base[name] = this.constructor.attribute(name).defaultValue(this));
      },
      set: function(name, value) {
        this._attributeChange(name, value);
        this.attributes[name] = value;
        return value;
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
    }
  };

  Metro.Model.Persistence = {
    ClassMethods: {
      create: function(attributes, callback) {
        return this.store().create(new this(attributes), callback);
      },
      update: function(query, attributes, callback) {
        return this.store().update(query, attributes, callback);
      },
      destroy: function(query, callback) {
        return this.store().destroy(query, callback);
      },
      updateAll: function() {},
      deleteAll: function() {
        return this.store().clear();
      },
      store: function(value) {
        if (value) this._store = value;
        return this._store || (this._store = new Metro.Store.Memory);
      }
    },
    InstanceMethods: {
      isNew: function() {
        return !!!attributes.id;
      },
      save: function(callback) {
        if (this.isNew()) {
          return this._create(callback);
        } else {
          return this._update(callback);
        }
      },
      _update: function(callback) {
        return this.constructor.update(this.toUpdates(), callback);
      },
      _create: function(callback) {
        return this.constructor.create(this.toUpdates(), callback);
      },
      reset: function() {},
      updateAttribute: function(key, value) {},
      updateAttributes: function(attributes) {
        return this.constructor.update(attributes, callback);
      },
      increment: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      decrement: function(attribute, amount) {
        if (amount == null) amount = 1;
      },
      reload: function() {},
      "delete": function() {},
      destroy: function() {},
      isDestroyed: function() {},
      isPersisted: function() {
        return !!this.isNew();
      },
      toObject: function() {
        return this.attributes;
      },
      isDirty: function() {
        return Metro.Support.Object.isPresent(this.changes);
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
      }
    }
  };

  Metro.Model.Scopes = {
    ClassMethods: {
      scope: function(name, scope) {
        return this[name] = scope instanceof Metro.Model.Scope ? scope : this.where(scope);
      },
      where: function() {
        var _ref;
        return (_ref = this.scoped()).where.apply(_ref, arguments);
      },
      order: function() {
        var _ref;
        return (_ref = this.scoped()).order.apply(_ref, arguments);
      },
      limit: function() {
        var _ref;
        return (_ref = this.scoped()).limit.apply(_ref, arguments);
      },
      select: function() {
        var _ref;
        return (_ref = this.scoped()).select.apply(_ref, arguments);
      },
      joins: function() {
        var _ref;
        return (_ref = this.scoped()).joins.apply(_ref, arguments);
      },
      includes: function() {
        var _ref;
        return (_ref = this.scoped()).includes.apply(_ref, arguments);
      },
      within: function() {
        var _ref;
        return (_ref = this.scoped()).within.apply(_ref, arguments);
      },
      scoped: function() {
        return new Metro.Model.Scope(Metro.namespaced(this.name));
      },
      all: function(callback) {
        return this.store().all(callback);
      },
      first: function(callback) {
        return this.store().first(callback);
      },
      last: function(callback) {
        return this.store().last(callback);
      },
      find: function(id, callback) {
        return this.store().find(id, callback);
      },
      count: function(callback) {
        return this.store().count(callback);
      },
      exists: function(callback) {
        return this.store().exists(callback);
      }
    }
  };

  Metro.Model.Serialization = {
    ClassMethods: {
      fromJSON: function(data) {
        var i, record, records, _len;
        records = JSON.parse(data);
        if (!(records instanceof Array)) records = [records];
        for (i = 0, _len = records.length; i < _len; i++) {
          record = records[i];
          records[i] = new this(record);
        }
        return records;
      },
      fromForm: function(data) {}
    },
    toXML: function() {},
    toJSON: function() {
      return JSON.stringify(this.attributes);
    },
    toObject: function() {
      return this.attributes;
    },
    clone: function() {
      return new this.constructor(Metro.Support.Object.clone(this.attributes));
    }
  };

  Metro.Model.Validator = (function() {

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
      var attribute, success, _i, _len, _ref;
      success = true;
      _ref = this.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attribute = _ref[_i];
        if (!this.validate(record, attribute, errors)) success = false;
      }
      return success;
    };

    return Validator;

  })();

  require('./validator/format');

  require('./validator/length');

  require('./validator/presence');

  require('./validator/uniqueness');

  Metro.Model.Validations = {
    ClassMethods: {
      validate: function() {
        var attributes, key, options, validators, value, _results;
        attributes = Metro.Support.Array.args(arguments);
        options = attributes.pop();
        if (typeof options !== "object") {
          Metro.raise("missing_options", "" + this.name + ".validates");
        }
        validators = this.validators();
        _results = [];
        for (key in options) {
          value = options[key];
          _results.push(validators.push(Metro.Model.Validator.create(key, value, attributes)));
        }
        return _results;
      },
      validators: function() {
        return this._validators || (this._validators = []);
      }
    },
    validate: function() {
      var errors, success, validator, validators, _i, _len;
      validators = this.constructor.validators();
      success = true;
      errors = this.errors;
      errors.length = 0;
      for (_i = 0, _len = validators.length; _i < _len; _i++) {
        validator = validators[_i];
        if (!validator.validateEach(this, errors)) success = false;
      }
      return success;
    }
  };

  Metro.Model.include(Metro.Model.Persistence);

  Metro.Model.include(Metro.Model.Scopes);

  Metro.Model.include(Metro.Model.Serialization);

  Metro.Model.include(Metro.Model.Associations);

  Metro.Model.include(Metro.Model.Validations);

  Metro.Model.include(Metro.Model.Attributes);

  Metro.View = (function() {

    __extends(View, Metro.Object);

    View.extend({
      loadPaths: ["./app/views"],
      engine: "jade",
      prettyPrint: false,
      store: function(store) {
        if (store) this._store = store;
        return this._store || (this._store = new Metro.Store.FileSystem);
      }
    });

    function View(controller) {
      this.controller = controller;
    }

    View.prototype.store = function() {
      return this.constructor.store();
    };

    return View;

  })();

  Metro.View.Helpers = {
    contentTypeTag: function(type) {
      if (type == null) type = "UTF-8";
      return "\n    <meta charset=\"" + type + "\" />";
    },
    t: function(string) {
      return Metro.translate(string);
    },
    javascriptTag: function(path) {
      return "\n    <script type=\"text/javascript\" src=\"" + path + "\" ></script>";
    },
    stylesheetTag: function(path) {
      return "\n    <link href=\"" + path + "\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>";
    },
    javascripts: function(source) {
      var manifest, path, paths, result, _i, _len;
      if (Metro.env === "production") {
        manifest = Metro.assetManifest;
        source = "" + source + ".js";
        if (manifest[source]) source = manifest[source];
        path = "/javascripts/" + source;
        if (Metro.assetHost) path = "" + Metro.assetHost + path;
        return this.javascriptTag(path);
      } else {
        paths = Metro.assets.javascripts[source];
        result = [];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          result.push(this.javascriptTag("/javascripts" + path + ".js"));
        }
        return result.join("");
      }
    },
    stylesheets: function(source) {
      var manifest, path, paths, result, _i, _len;
      if (Metro.env === "production") {
        manifest = Metro.assetManifest;
        source = "" + source + ".css";
        if (manifest[source]) source = manifest[source];
        path = "/stylesheets/" + source;
        if (Metro.assetHost) path = "" + Metro.assetHost + path;
        return this.stylesheetTag(path);
      } else {
        paths = Metro.assets.stylesheets[source];
        result = [];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          result.push(this.stylesheetTag("/stylesheets" + path + ".css"));
        }
        return result.join("");
      }
    },
    titleTag: function(title) {
      return "<title>" + title + "</title>";
    },
    metaTag: function(name, content) {},
    tag: function(name, options) {},
    linkTag: function(title, path, options) {},
    imageTag: function(path, options) {}
  };

  Metro.Controller = (function() {

    __extends(Controller, Metro.Object);

    function Controller() {
      this.headers = {};
      this.status = 200;
      this.request = null;
      this.response = null;
      this.contentType = "text/html";
      this.params = {};
      this.query = {};
    }

    return Controller;

  })();

  Metro.Controller.Caching = {};

  Metro.Controller.Helpers = {
    ClassMethods: {
      helper: function(object) {
        this._helpers || (this._helpers = []);
        return this._helpers.push(object);
      }
    },
    urlFor: function() {}
  };

  Metro.Controller.HTTP = {};

  Metro.Controller.Layouts = {
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

  Metro.Controller.Redirecting = {
    redirectTo: function() {}
  };

  Metro.Controller.Rendering = {
    render: function() {
      var args, callback, finish, self, view, _base;
      args = Metro.Support.Array.args(arguments);
      if (args.length >= 2 && typeof args[args.length - 1] === "function") {
        callback = args.pop();
      }
      view = new Metro.View(this);
      (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = this.contentType);
      self = this;
      args.push(finish = function(error, body) {
        if (error) {
          self.body = error.stack;
        } else {
          self.body = body;
        }
        if (callback) callback(error, body);
        return self.callback();
      });
      return view.render.apply(view, args);
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

  Metro.Controller.Responding = {
    ClassMethods: {
      respondTo: function() {
        this._respondTo || (this._respondTo = []);
        return this._respondTo = this._respondTo.concat(Metro.Support.Array.args(arguments));
      }
    },
    respondWith: function() {
      var callback, data;
      data = arguments[0];
      if (arguments.length > 1 && typeof arguments[arguments.length - 1] === "function") {
        callback = arguments[arguments.length - 1];
      }
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
    },
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
      if (this.format && this.format !== "undefined") {
        this.contentType = Metro.Support.Path.contentType(this.format);
      } else {
        this.contentType = "text/html";
      }
      return this.process();
    },
    process: function() {
      this.processQuery();
      return this[this.params.action]();
    },
    processQuery: function() {},
    clear: function() {
      this.request = null;
      this.response = null;
      return this.headers = null;
    }
  };

  Metro.Controller.include(Metro.Controller.Caching);

  Metro.Controller.include(Metro.Controller.Helpers);

  Metro.Controller.include(Metro.Controller.HTTP);

  Metro.Controller.include(Metro.Controller.Layouts);

  Metro.Controller.include(Metro.Controller.Redirecting);

  Metro.Controller.include(Metro.Controller.Rendering);

  Metro.Controller.include(Metro.Controller.Responding);

  Metro.Route = (function() {

    Route.store = function() {
      return this._store || (this._store = []);
    };

    Route.create = function(route) {
      return this.store().push(route);
    };

    Route.all = function() {
      return this.store();
    };

    Route.draw = function(callback) {
      return callback.apply(new Metro.Route.DSL(this));
    };

    function Route(options) {
      options || (options = options);
      this.path = options.path;
      this.name = options.name;
      this.method = options.method;
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

    Route.prototype.match = function(path) {
      return this.pattern.exec(path);
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

  /*
  * Metro.Route.DSL
  */

  Metro.Route.DSL = (function() {

    function DSL() {}

    DSL.prototype.match = function() {
      this.scope || (this.scope = {});
      return Metro.Route.create(new Metro.Route(this._extractOptions.apply(this, arguments)));
    };

    DSL.prototype.get = function() {
      return this.matchMethod.apply(this, ["get"].concat(__slice.call(arguments)));
    };

    DSL.prototype.post = function() {
      return this.matchMethod.apply(this, ["post"].concat(__slice.call(arguments)));
    };

    DSL.prototype.put = function() {
      return this.matchMethod.apply(this, ["put"].concat(__slice.call(arguments)));
    };

    DSL.prototype["delete"] = function() {
      return this.matchMethod.apply(this, ["delete"].concat(__slice.call(arguments)));
    };

    DSL.prototype.matchMethod = function(method) {
      var options;
      options = arguments.pop();
      options.via = method;
      arguments.push(options);
      this.match(options);
      return this;
    };

    DSL.prototype.scope = function() {};

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
      options = Metro.Support.Object.extend({
        path: path,
        as: path,
        module: path,
        shallowPath: path,
        shallowPrefix: path
      }, options);
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

    DSL.prototype.resource = function() {};

    DSL.prototype.resources = function() {};

    DSL.prototype.collection = function() {};

    DSL.prototype.member = function() {};

    DSL.prototype.root = function(options) {
      return this.match('/', Metro.Support.Object.extend({
        as: "root"
      }, options));
    };

    DSL.prototype._extractOptions = function() {
      var anchor, constraints, controller, defaults, format, method, name, options, path;
      path = "/" + arguments[0].replace(/^\/|\/$/, "");
      options = arguments[arguments.length - 1] || {};
      options.path = path;
      format = this._extractFormat(options);
      options.path = this._extractPath(options);
      method = this._extractRequestMethod(options);
      constraints = this._extractConstraints(options);
      defaults = this._extractDefaults(options);
      controller = this._extractController(options);
      anchor = this._extractAnchor(options);
      name = this._extractName(options);
      options = Metro.Support.Object.extend(options, {
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
      return options.as;
    };

    DSL.prototype._extractConstraints = function(options) {
      return options.constraints || {};
    };

    DSL.prototype._extractDefaults = function(options) {
      return options.defaults || {};
    };

    DSL.prototype._extractPath = function(options) {
      return "" + options.path + ".:format?";
    };

    DSL.prototype._extractRequestMethod = function(options) {
      return options.via || options.requestMethod;
    };

    DSL.prototype._extractAnchor = function(options) {
      return options.anchor;
    };

    DSL.prototype._extractController = function(options) {
      var action, controller, to;
      to = options.to.split('#');
      if (to.length === 1) {
        action = to[0];
      } else {
        controller = to[0];
        action = to[1];
      }
      controller || (controller = options.controller || this.scope.controller);
      action || (action = options.action || this.scope.action);
      controller = controller.toLowerCase().replace(/(?:[cC]ontroller)?$/, "Controller");
      action = action.toLowerCase();
      return {
        name: controller,
        action: action,
        className: Metro.Support.String.camelize("" + controller)
      };
    };

    return DSL;

  })();

  Metro.Store = {
    defaultLimit: 100,
    reservedOperators: {
      "_sort": "_sort",
      "_limit": "_limit"
    },
    queryOperators: {
      ">=": "gte",
      "gte": "gte",
      ">": "gt",
      "gt": "gt",
      "<=": "lte",
      "lte": "lte",
      "<": "lt",
      "lt": "lt",
      "in": "in",
      "nin": "nin",
      "any": "any",
      "all": "all",
      "=~": "m",
      "m": "m",
      "!~": "nm",
      "nm": "nm",
      "=": "eq",
      "eq": "eq",
      "!=": "neq",
      "neq": "neq",
      "null": "null",
      "notNull": "notNull"
    }
  };

  Metro.Store.Memory = (function() {

    __extends(Memory, Metro.Object);

    function Memory() {
      this.records = {};
      this.lastId = 0;
    }

    Memory.prototype.addIndex = function() {
      var attributes;
      attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
      this.index[attributes] = key;
      return this;
    };

    Memory.prototype.removeIndex = function() {
      var attributes;
      attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
      delete this.index[attributes];
      return this;
    };

    Memory.prototype.find = function(query, callback) {
      var key, limit, record, records, result, sort;
      result = [];
      records = this.records;
      if (Metro.Support.Object.isPresent(query)) {
        sort = query._sort;
        limit = query._limit || Metro.Store.defaultLimit;
        for (key in records) {
          record = records[key];
          if (this.matches(record, query)) result.push(record);
        }
        if (sort) result = this.sort(result, query._sort);
        if (limit) result = result.slice(0, (limit - 1) + 1 || 9e9);
      } else {
        for (key in records) {
          record = records[key];
          result.push(record);
        }
      }
      if (callback) callback(result);
      return result;
    };

    Memory.alias("select", "find");

    Memory.prototype.first = function(query, callback) {
      var result;
      result = this.find(query, function(records) {
        if (callback) return callback(records[0]);
      });
      return result[0];
    };

    Memory.prototype.last = function(query, callback) {
      var result;
      result = this.find(query, function(records) {
        if (callback) return callback(records[records.length - 1]);
      });
      return result[result.length - 1];
    };

    Memory.prototype.all = function(query, callback) {
      return this.find(query, callback);
    };

    Memory.prototype.length = function(query, callback) {
      return this.find(query, function(records) {
        if (callback) return callback(records.length);
      }).length;
    };

    Memory.alias("count", "length");

    Memory.prototype.remove = function(query, callback) {
      var _records;
      _records = this.records;
      return this.select(query, function(records) {
        var record, _i, _len;
        for (_i = 0, _len = records.length; _i < _len; _i++) {
          record = records[_i];
          _records.splice(_records.indexOf(record), 1);
        }
        if (callback) return callback(records);
      });
    };

    Memory.prototype.clear = function() {
      return this.records = [];
    };

    Memory.prototype.toArray = function() {
      return this.records;
    };

    Memory.prototype.create = function(record) {
      var _ref;
      if (!record.id) {
        Metro.raise("errors.store.missingAttribute", "id", "Store#create", record);
      }
      if ((_ref = record.id) == null) record.id = this.generateId();
      return this.records[record.id] = record;
    };

    Memory.prototype.update = function(record) {
      if (!record.id) {
        Metro.raise("errors.store.missingAttribute", "id", "Store#update", record);
      }
      return this.records[record.id] = record;
    };

    Memory.prototype.destroy = function(record) {
      return this.find(id).destroy();
    };

    Memory.prototype.sort = function() {
      var _ref;
      return (_ref = Metro.Support.Array).sortBy.apply(_ref, arguments);
    };

    Memory.prototype.matches = function(record, query) {
      var key, recordValue, self, success, value;
      self = this;
      success = true;
      for (key in query) {
        value = query[key];
        if (!!Metro.Store.reservedOperators[key]) continue;
        recordValue = record[key];
        if (typeof value === 'object') {
          success = self._matchesOperators(record, recordValue, value);
        } else {
          if (typeof value === "function") value = value.call(record);
          success = recordValue === value;
        }
        if (!success) return false;
      }
      return true;
    };

    Memory.prototype.generateId = function() {
      return this.lastId++;
    };

    Memory.prototype._matchesOperators = function(record, recordValue, operators) {
      var key, operator, self, success, value;
      success = true;
      self = this;
      for (key in operators) {
        value = operators[key];
        if (operator = Metro.Store.queryOperators[key]) {
          if (typeof value === "function") value = value.call(record);
          switch (operator) {
            case "gt":
              success = self._isGreaterThan(recordValue, value);
              break;
            case "gte":
              success = self._isGreaterThanOrEqualTo(recordValue, value);
              break;
            case "lt":
              success = self._isLessThan(recordValue, value);
              break;
            case "lte":
              success = self._isLessThanOrEqualTo(recordValue, value);
              break;
            case "eq":
              success = self._isEqualTo(recordValue, value);
              break;
            case "neq":
              success = self._isNotEqualTo(recordValue, value);
              break;
            case "m":
              success = self._isMatchOf(recordValue, value);
              break;
            case "nm":
              success = self._isNotMatchOf(recordValue, value);
              break;
            case "any":
              success = self._anyIn(recordValue, value);
              break;
            case "all":
              success = self._allIn(recordValue, value);
          }
          if (!success) return false;
        } else {
          return recordValue === operators;
        }
      }
      return true;
    };

    Memory.prototype._isGreaterThan = function(recordValue, value) {
      return recordValue && recordValue > value;
    };

    Memory.prototype._isGreaterThanOrEqualTo = function(recordValue, value) {
      return recordValue && recordValue >= value;
    };

    Memory.prototype._isLessThan = function(recordValue, value) {
      return recordValue && recordValue < value;
    };

    Memory.prototype._isLessThanOrEqualTo = function(recordValue, value) {
      return recordValue && recordValue <= value;
    };

    Memory.prototype._isEqualTo = function(recordValue, value) {
      return recordValue === value;
    };

    Memory.prototype._isNotEqualTo = function(recordValue, value) {
      return recordValue !== value;
    };

    Memory.prototype._isMatchOf = function(recordValue, value) {
      return !!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
    };

    Memory.prototype._isNotMatchOf = function(recordValue, value) {
      return !!!(typeof recordValue === "string" ? recordValue.match(value) : recordValue.exec(value));
    };

    Memory.prototype._anyIn = function(recordValue, array) {
      var value, _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) > -1) return true;
      }
      return false;
    };

    Memory.prototype._allIn = function(recordValue, value) {
      var _i, _len;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        value = array[_i];
        if (recordValue.indexOf(value) === -1) return false;
      }
      return true;
    };

    Memory.prototype.toString = function() {
      return this.constructor.name;
    };

    return Memory;

  })();

  Metro.Middleware = new (Namespace = (function() {

    function Namespace() {}

    return Namespace;

  })());

  Metro.Middleware.Router = (function() {

    function Router(request, response, next) {
      if (this.constructor !== Metro.Middleware.Router) {
        return (new Metro.Middleware.Router(request, response, next)).call(request, response, callback);
      }
    }

    Router.prototype.call = function(request, response, callback) {
      var self;
      self = this;
      this.find(request, response, function(controller) {
        if (controller) {
          response.writeHead(200, controller.headers);
          response.write(controller.body);
          response.end();
          return controller.clear();
        } else {
          return self.error(request, response);
        }
      });
      return response;
    };

    Router.prototype.find = function(request, response, callback) {
      var controller, route, routes, _i, _len;
      routes = Metro.Route.all();
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        route = routes[_i];
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
    };

    Router.prototype.processRoute = function(route, request, response) {
      var capture, controller, i, keys, match, method, params, path, url, _len;
      url = request.parsedUrl || (request.parsedUrl = new Metro.Net.Url(request.url));
      path = url.attr("path");
      match = route.match(path);
      if (!match) return null;
      method = request.method.toLowerCase();
      keys = route.keys;
      params = Metro.Support.Object.extend({}, route.defaults, request.query || {}, request.body || {});
      match = match.slice(1);
      for (i = 0, _len = match.length; i < _len; i++) {
        capture = match[i];
        params[keys[i].name] = capture ? decodeURIComponent(capture) : null;
      }
      controller = route.controller;
      if (controller) params.action = controller.action;
      request.params = params;
      if (controller) {
        controller = new Metro.constant(Metro.namespaced(route.controller.className));
      }
      return controller;
    };

    Router.prototype.error = function(request, response) {
      if (response) {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        return response.end("No path matches " + request.url);
      }
    };

    return Router;

  })();

}).call(this);
