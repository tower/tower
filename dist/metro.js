(function() {
  var File, Namespace, Shift, key, moduleKeywords, require, value, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; }, __slice = Array.prototype.slice, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.global || (window.global = window);

  window.Metro = new (Namespace = (function() {

    function Namespace() {}

    return Namespace;

  })());

  require = function() {
    return {};
  };

  Metro.configuration = null;

  Metro.env = "development";

  Metro.port = 1597;

  Metro.cache = null;

  Metro.version = "0.2.0";

  Metro.client = typeof window !== "undefined";

  Metro.configure = function(callback) {
    return callback.apply(this);
  };

  Metro.root = "/";

  Metro.publicPath = "/";

  Metro.raise = function() {
    var args, i, message, node, path, _i, _len;
    args = Array.prototype.slice.call(arguments);
    path = args.shift().split(".");
    message = Metro.locale.en;
    for (_i = 0, _len = path.length; _i < _len; _i++) {
      node = path[_i];
      message = message[node];
    }
    i = 0;
    message = message.replace(/%s/g, function() {
      return args[i++];
    });
    throw new Error(message);
  };

  Metro.initialize = function() {
    return Metro.Application.initialize();
  };

  Metro.teardown = function() {
    return Metro.Application.teardown();
  };

  Metro.locale = {
    en: {
      errors: {
        missingCallback: "You must pass a callback to %s.",
        missingOption: "You must pass in the '%s' option to %s.",
        notFound: "%s not found.",
        store: {
          missingAttribute: "Missing %s in %s for '%s'"
        },
        asset: {
          notFound: "Asset not found: '%s'\n  Lookup paths: [\n%s\n  ]"
        }
      }
    }
  };

  Metro.application = function() {
    return Metro.Application.instance();
  };

  Metro.Application = (function() {

    function Application() {}

    Application.instance = function() {
      return this._instance || (this._instance = Metro.client ? new Metro.Application.Client : Metro.Application.Server);
    };

    Application.initialize = function() {
      return this.instance().initialize();
    };

    Application.teardown = function() {
      this.instance().teardown();
      return delete this._instance;
    };

    Application.run = function() {
      return this.instance().run();
    };

    return Application;

  })();

  Metro.Application.Client = (function() {
    var Request, Response;

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
      this.use(Metro.Middleware.Router);
      return this;
    };

    Client.prototype.teardown = function() {
      return this;
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

    Request = (function() {

      function Request(data) {
        if (data == null) data = {};
        this.url = data.url;
        this.parsedUrl = data.parsedUrl;
        this.pathname = this.parsedUrl.attr("path");
        this.query = this.parsedUrl.data.query;
        this.title = data.title || document.title;
        this.body = data.body || {};
        this.headers = data.headers || {};
        this.method = data.method || "GET";
      }

      return Request;

    })();

    Response = (function() {

      function Response(data) {
        if (data == null) data = {};
        this.url = data.url;
        this.parsedUrl = data.parsedUrl;
        this.pathname = this.parsedUrl.attr("path");
        this.query = this.parsedUrl.data.query;
        this.title = data.title || document.title;
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

    return Client;

  })();

  Metro.Support = new (Namespace = (function() {

    function Namespace() {}

    return Namespace;

  })());

  Metro.Support.Array = {
    extractArgs: function(args) {
      return Array.prototype.slice.call(args, 0, args.length);
    },
    extractArgsAndOptions: function(args) {
      args = Array.prototype.slice.call(args, 0, args.length);
      if (typeof args[args.length - 1] !== 'object') args.push({});
      return args;
    },
    args: function(args) {
      var options;
      args = Array.prototype.slice.call(args, 0, args.length);
      if (typeof args[args.length - 1] !== 'object') {
        options = {};
      } else {
        options = args.pop();
      }
      return {
        args: args,
        options: options
      };
    },
    argsOptionsAndCallback: function() {
      var args, callback, last, options;
      args = Array.prototype.slice.call(arguments);
      last = args.length - 1;
      if (typeof args[last] === "function") {
        callback = args[last];
        if (args.length >= 3) {
          if (typeof args[last - 1] === "object") {
            options = args[last - 1];
            args = args.slice(0, (last - 2) + 1 || 9e9);
          } else {
            options = {};
            args = args.slice(0, (last - 1) + 1 || 9e9);
          }
        } else {
          options = {};
        }
      } else if (args.length >= 2 && typeof args[last] === "object") {
        args = args.slice(0, (last - 1) + 1 || 9e9);
        options = args[last];
        callback = null;
      } else {
        options = {};
        callback = null;
      }
      return [args, options, callback];
    },
    sortBy: function(objects) {
      var arrayComparator, callbacks, sortings, valueComparator;
      sortings = Array.prototype.slice.call(arguments, 1, arguments.length);
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

  moduleKeywords = ['included', 'extended', 'prototype'];

  Metro.Support.Class = (function() {

    function Class() {}

    Class.alias = function(to, from) {
      return this.prototype[to] = this.prototype[from];
    };

    Class.alias_method = function(to, from) {
      return this.prototype[to] = this.prototype[from];
    };

    Class.accessor = function(key, self, callback) {
      this._accessors || (this._accessors = []);
      this._accessors.push(key);
      this.getter(key, self, callback);
      this.setter(key, self);
      return this;
    };

    Class.getter = function(key, self, callback) {
      self || (self = this.prototype);
      if (!self.hasOwnProperty("_getAttribute")) {
        Object.defineProperty(self, "_getAttribute", {
          enumerable: false,
          configurable: true,
          value: function(key) {
            return this["_" + key];
          }
        });
      }
      this._getters || (this._getters = []);
      this._getters.push(key);
      Object.defineProperty(self, "_" + key, {
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(self, key, {
        enumerable: true,
        configurable: true
      }, {
        get: function() {
          return this["_getAttribute"](key) || (callback ? this["_" + key] = callback.apply(this) : void 0);
        }
      });
      return this;
    };

    Class.setter = function(key, self) {
      self || (self = this.prototype);
      if (!self.hasOwnProperty("_setAttribute")) {
        Object.defineProperty(self, method, {
          enumerable: false,
          configurable: true,
          value: function(key, value) {
            return this["_" + key] = value;
          }
        });
      }
      this._setters || (this._setters = []);
      this._setters.push(key);
      Object.defineProperty(self, "_" + key, {
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(self, key, {
        enumerable: true,
        configurable: true,
        set: function(value) {
          return this["_setAttribute"](key, value);
        }
      });
      return this;
    };

    Class.classEval = function(block) {
      return block.call(this);
    };

    Class.delegate = function(key, options) {
      var to;
      if (options == null) options = {};
      to = options.to;
      if (typeof this.prototype[to] === "function") {
        return this.prototype[key] = function() {
          var _ref;
          return (_ref = this[to]())[key].apply(_ref, arguments);
        };
      } else {
        return Object.defineProperty(this.prototype, key, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this[to]()[key];
          }
        });
      }
    };

    Class.delegates = function() {
      var args, key, options, _i, _len, _results;
      args = Array.prototype.slice.call(arguments, 0, arguments.length);
      options = args.pop();
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        key = args[_i];
        _results.push(this.delegate(key, options));
      }
      return _results;
    };

    Class.include = function(obj) {
      var c, child, clone, cloned, included, key, newproto, oldproto, parent, value, _ref;
      if (!obj) throw new Error('include(obj) requires obj');
      this.extend(obj);
      c = this;
      child = this;
      parent = obj;
      clone = function(fct) {
        var clone_, property;
        clone_ = function() {
          return fct.apply(this, arguments);
        };
        clone_.prototype = fct.prototype;
        for (property in fct) {
          if (fct.hasOwnProperty(property) && property !== "prototype") {
            clone_[property] = fct[property];
          }
        }
        return clone_;
      };
      if (child.__super__) oldproto = child.__super__;
      cloned = clone(parent);
      newproto = cloned.prototype;
      _ref = cloned.prototype;
      for (key in _ref) {
        value = _ref[key];
        if (__indexOf.call(moduleKeywords, key) < 0) this.prototype[key] = value;
      }
      if (oldproto) cloned.prototype = oldproto;
      child.__super__ = newproto;
      included = obj.included;
      if (included) included.apply(obj.prototype);
      return this;
    };

    Class.extend = function(obj) {
      var extended, key, value;
      if (!obj) throw new Error('extend(obj) requires obj');
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) this[key] = value;
      }
      extended = obj.extended;
      if (extended) extended.apply(obj);
      return this;
    };

    Class["new"] = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(this, arguments, function() {});
    };

    Class.instanceMethods = function() {
      var key, result;
      result = [];
      for (key in this.prototype) {
        result.push(key);
      }
      return result;
    };

    Class.classMethods = function() {
      var key, result;
      result = [];
      for (key in this) {
        result.push(key);
      }
      return result;
    };

    Class.prototype.instanceExec = function() {
      var _ref;
      return (_ref = arguments[0]).apply.apply(_ref, [this].concat(__slice.call(arguments.slice(1))));
    };

    Class.prototype.instanceEval = function(block) {
      return block.apply(this);
    };

    Class.prototype.send = function(method) {
      var _ref;
      if (this[method]) {
        return (_ref = this[method]).apply.apply(_ref, arguments);
      } else {
        if (this.methodMissing) return this.methodMissing.apply(this, arguments);
      }
    };

    Class.prototype.methodMissing = function(method) {};

    return Class;

  })();

  _ref = Metro.Support.Class;
  for (key in _ref) {
    value = _ref[key];
    Function.prototype[key] = value;
  }

  Metro.Support.Callbacks = (function() {

    function Callbacks() {}

    return Callbacks;

  })();

  Metro.Support.Concern = (function() {

    function Concern() {
      Concern.__super__.constructor.apply(this, arguments);
    }

    Concern.included = function() {
      this._dependencies || (this._dependencies = []);
      if (this.hasOwnProperty("ClassMethods")) this.extend(this.ClassMethods);
      if (this.hasOwnProperty("InstanceMethods")) {
        return this.include(this.InstanceMethods);
      }
    };

    Concern._appendFeatures = function() {};

    return Concern;

  })();

  Metro.Support.IE = (function() {

    function IE() {}

    return IE;

  })();

  Metro.Support.I18n = (function() {

    function I18n() {}

    I18n.defaultLanguage = "en";

    I18n.translate = function(key, options) {
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
    };

    I18n.t = I18n.translate;

    I18n.lookup = function(key, language) {
      var part, parts, result, _i, _len;
      if (language == null) language = this.defaultLanguage;
      parts = key.split(".");
      result = this.store[language];
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
    };

    I18n.store = {};

    I18n.interpolator = function() {
      return this._interpolator || (this._interpolator = new (require('shift').Mustache));
    };

    return I18n;

  })();

  Metro.Support.Number = {
    isInt: function(n) {
      return n === +n && n === (n | 0);
    },
    isFloat: function(n) {
      return n === +n && n !== (n | 0);
    }
  };

  Metro.Support.Object = {
    isA: function(object, isa) {},
    isHash: function() {
      var object;
      object = arguments[0] || this;
      return _.isObject(object) && !(_.isFunction(object) || _.isArray(object));
    },
    isPresent: function(object) {
      var key, value;
      for (key in object) {
        value = object[key];
        return true;
      }
      return false;
    },
    isBlank: function(object) {
      var key, value;
      for (key in object) {
        value = object[key];
        return false;
      }
      return true;
    }
  };

  Metro.Support.String = {
    camelize: function() {
      return _.camelize("_" + (arguments[0] || this));
    },
    constantize: function() {
      return global[this.camelize.apply(this, arguments)];
    },
    underscore: function() {
      return _.underscored(arguments[0] || this);
    },
    titleize: function() {
      return _.titleize(arguments[0] || this);
    }
  };

  Metro.Support.RegExp = {
    escape: function(string) {
      return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    escapeEach: function() {
      var args, i, item, result, _len;
      result = [];
      args = arguments[0];
      for (i = 0, _len = args.length; i < _len; i++) {
        item = args[i];
        result[i] = this.escape(item);
      }
      return result;
    }
  };

  Metro.Support.Time = (function() {

    Time._lib = function() {
      return require('moment');
    };

    Time.zone = function() {
      return this;
    };

    Time.now = function() {
      return new this();
    };

    function Time() {
      this.moment = this.constructor._lib()();
    }

    Time.prototype.toString = function() {
      return this._date.toString();
    };

    Time.prototype.beginningOfWeek = function() {};

    Time.prototype.week = function() {
      return parseInt(this.moment.format("w"));
    };

    Time.prototype.dayOfWeek = function() {
      return this.moment.day();
    };

    Time.prototype.dayOfMonth = function() {
      return parseInt(this.moment.format("D"));
    };

    Time.prototype.dayOfYear = function() {
      return parseInt(this.moment.format("DDD"));
    };

    Time.prototype.meridiem = function() {
      return this.moment.format("a");
    };

    Time.prototype.zoneName = function() {
      return this.moment.format("z");
    };

    Time.prototype.strftime = function(format) {
      return this.moment.format(format);
    };

    Time.prototype.beginningOfDay = function() {
      this.moment.seconds(0);
      return this;
    };

    Time.prototype.beginningOfWeek = function() {
      this.moment.seconds(0);
      this.moment.subtract('days', 6 - this.dayOfWeek());
      return this;
    };

    Time.prototype.beginningOfMonth = function() {
      this.moment.seconds(0);
      this.moment.subtract('days', 6 - this.dayOfMonth());
      return this;
    };

    Time.prototype.beginningOfYear = function() {
      this.moment.seconds(0);
      return this.moment.subtract('days', 6 - this.dayOfMonth());
    };

    Time.prototype.toDate = function() {
      return this.moment._d;
    };

    return Time;

  })();

  Metro.Support.Time.TimeWithZone = (function() {

    __extends(TimeWithZone, Metro.Support.Time);

    function TimeWithZone() {
      TimeWithZone.__super__.constructor.apply(this, arguments);
    }

    return TimeWithZone;

  })();

  Metro.Model = (function() {

    Model.initialize = function() {
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/models");
    };

    Model.teardown = function() {
      return delete this._store;
    };

    Model.store = function() {
      return this._store || (this._store = new Metro.Store.Memory);
    };

    function Model(attrs) {
      var attributes, definition, definitions, key, name, value;
      if (attrs == null) attrs = {};
      attributes = {};
      definitions = this.constructor.keys();
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
      this.attributes = this.typeCastAttributes(attributes);
      this.changes = {};
    }

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

    Scope.prototype.sourceClass = function() {
      return global[this.sourceClassName];
    };

    Scope.prototype.store = function() {
      return global[this.sourceClassName].store();
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

    Association.include(Metro.Model.Scope);

    function Association(owner, reflection) {
      this.owner = owner;
      this.reflection = reflection;
    }

    Association.prototype.targetClass = function() {
      return global[this.reflection.targetClassName];
    };

    Association.prototype.scoped = function() {
      return (new Metro.Model.Scope(this.reflection.targetClassName)).where(this.conditions());
    };

    Association.prototype.conditions = function() {
      var result;
      result = {};
      if (this.owner.id && this.reflection.foreignKey) {
        result[this.reflection.foreignKey] = this.owner.id;
      }
      return result;
    };

    Association.delegates("where", "find", "all", "first", "last", "store", {
      to: "scoped"
    });

    return Association;

  })();

  Metro.Model.Associations = (function() {

    function Associations() {}

    Associations.hasOne = function(name, options) {
      if (options == null) options = {};
    };

    Associations.hasMany = function(name, options) {
      var reflection;
      if (options == null) options = {};
      options.foreignKey = "" + (Metro.Support.String.underscore(this.name)) + "Id";
      this.reflections()[name] = reflection = new Metro.Model.Reflection("hasMany", this.name, name, options);
      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this._getHasManyAssociation(name);
        },
        set: function(value) {
          return this._setHasManyAssociation(name, value);
        }
      });
      return reflection;
    };

    Associations.belongsTo = function(name, options) {
      var reflection;
      if (options == null) options = {};
      this.reflections()[name] = reflection = new Metro.Model.Association("belongsTo", this.name, name, options);
      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this._getBelongsToAssocation(name);
        },
        set: function(value) {
          return this._setBelongsToAssocation(name, value);
        }
      });
      this.keys()["" + name + "Id"] = new Metro.Model.Attribute("" + name + "Id", options);
      Object.defineProperty(this.prototype, "" + name + "Id", {
        enumerable: true,
        configurable: true,
        get: function() {
          return this._getBelongsToAssocationId("" + name + "Id");
        },
        set: function(value) {
          return this._setBelongsToAssocationId("" + name + "Id", value);
        }
      });
      return reflection;
    };

    Associations.reflections = function() {
      return this._reflections || (this._reflections = {});
    };

    Associations.prototype._getHasManyAssociation = function(name) {
      return this.constructor.reflections()[name].association(this.id);
    };

    Associations.prototype._setHasManyAssociation = function(name, value) {
      return this.constructor.reflections()[name].association(this.id).destroyAll();
    };

    Associations.prototype._getBelongsToAssocationId = function(name) {
      return this.attributes[name];
    };

    Associations.prototype._setBelongsToAssocationId = function(name, value) {
      return this.attributes[name] = value;
    };

    Associations.prototype._getBelongsToAssocation = function(name) {
      var id;
      id = this._getBelongsToAssocationId(name);
      if (!id) return null;
      return global[this.reflections()[name].targetClassName].where({
        id: this.id
      }).first();
    };

    Associations.prototype._setBelongsToAssocation = function(name, value) {
      var id;
      id = this._getBelongsToAssocationId(name);
      if (!id) return null;
      return global[this.reflections()[name].targetClassName].where({
        id: this.id
      }).first();
    };

    return Associations;

  })();

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

  Metro.Model.Attributes = (function() {

    function Attributes() {}

    Attributes.key = function(key, options) {
      if (options == null) options = {};
      this.keys()[key] = new Metro.Model.Attribute(key, options);
      Object.defineProperty(this.prototype, key, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this.getAttribute(key);
        },
        set: function(value) {
          return this.setAttribute(key, value);
        }
      });
      return this;
    };

    Attributes.keys = function() {
      return this._keys || (this._keys = {});
    };

    Attributes.attributeDefinition = function(name) {
      var definition;
      definition = this.keys()[name];
      if (!definition) {
        throw new Error("Attribute '" + name + "' does not exist on '" + this.name + "'");
      }
      return definition;
    };

    Attributes.prototype.typeCast = function(name, value) {
      return this.constructor.attributeDefinition(name).typecast(value);
    };

    Attributes.prototype.typeCastAttributes = function(attributes) {
      var key, value;
      for (key in attributes) {
        value = attributes[key];
        attributes[key] = this.typeCast(key, value);
      }
      return attributes;
    };

    Attributes.prototype.getAttribute = function(name) {
      var _base;
      return (_base = this.attributes)[name] || (_base[name] = this.constructor.keys()[name].defaultValue(this));
    };

    if (!Attributes.hasOwnProperty("get")) Attributes.alias("get", "getAttribute");

    Attributes.prototype.setAttribute = function(name, value) {
      var beforeValue;
      beforeValue = this._trackChangedAttribute(name, value);
      return this.attributes[name] = value;
    };

    if (!Attributes.hasOwnProperty("set")) Attributes.alias("set", "setAttribute");

    return Attributes;

  })();

  Metro.Model.Dirty = (function() {

    function Dirty() {}

    Dirty.prototype.isDirty = function() {
      var change, changes;
      changes = this.changes();
      for (change in changes) {
        return true;
      }
      return false;
    };

    Dirty.prototype.changes = function() {
      return this._changes || (this._changes = {});
    };

    Dirty.prototype._trackChangedAttribute = function(attribute, value) {
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
    };

    return Dirty;

  })();

  Metro.Model.Persistence = (function() {

    function Persistence() {}

    Persistence.create = function(attrs) {
      var record;
      record = new this(attrs);
      this.store().create(record);
      return record;
    };

    Persistence.update = function() {};

    Persistence.deleteAll = function() {
      return this.store().clear();
    };

    Persistence.prototype.isNew = function() {
      return !!!attributes.id;
    };

    Persistence.prototype.save = function(options) {
      return runCallbacks(function() {});
    };

    Persistence.prototype.update = function(options) {};

    Persistence.prototype.reset = function() {};

    Persistence.alias("reload", "reset");

    Persistence.prototype.updateAttribute = function(name, value) {};

    Persistence.prototype.updateAttributes = function(attributes) {};

    Persistence.prototype.increment = function(attribute, amount) {
      if (amount == null) amount = 1;
    };

    Persistence.prototype.decrement = function(attribute, amount) {
      if (amount == null) amount = 1;
    };

    Persistence.prototype.reload = function() {};

    Persistence.prototype["delete"] = function() {};

    Persistence.prototype.destroy = function() {};

    Persistence.prototype.createOrUpdate = function() {};

    Persistence.prototype.isDestroyed = function() {};

    Persistence.prototype.isPersisted = function() {};

    return Persistence;

  })();

  Metro.Model.Reflection = (function() {

    function Reflection(type, sourceClassName, name, options) {
      if (options == null) options = {};
      this.type = type;
      this.sourceClassName = sourceClassName;
      this.targetClassName = options.className || Metro.Support.String.camelize(Metro.Support.String.singularize(name));
      this.foreignKey = options.foreignKey;
    }

    Reflection.prototype.targetClass = function() {
      return global[this.targetClassName];
    };

    Reflection.prototype.association = function(owner) {
      return new Metro.Model.Association(owner, this);
    };

    return Reflection;

  })();

  Metro.Model.Scopes = (function() {

    function Scopes() {}

    Scopes.scope = function(name, scope) {
      return this[name] = scope instanceof Metro.Model.Scope ? scope : this.where(scope);
    };

    Scopes.where = function() {
      var _ref2;
      return (_ref2 = this.scoped()).where.apply(_ref2, arguments);
    };

    Scopes.order = function() {
      var _ref2;
      return (_ref2 = this.scoped()).order.apply(_ref2, arguments);
    };

    Scopes.limit = function() {
      var _ref2;
      return (_ref2 = this.scoped()).limit.apply(_ref2, arguments);
    };

    Scopes.select = function() {
      var _ref2;
      return (_ref2 = this.scoped()).select.apply(_ref2, arguments);
    };

    Scopes.joins = function() {
      var _ref2;
      return (_ref2 = this.scoped()).joins.apply(_ref2, arguments);
    };

    Scopes.includes = function() {
      var _ref2;
      return (_ref2 = this.scoped()).includes.apply(_ref2, arguments);
    };

    Scopes.within = function() {
      var _ref2;
      return (_ref2 = this.scoped()).within.apply(_ref2, arguments);
    };

    Scopes.scoped = function() {
      return new Metro.Model.Scope(this.name);
    };

    Scopes.all = function(callback) {
      return this.store().all(callback);
    };

    Scopes.first = function(callback) {
      return this.store().first(callback);
    };

    Scopes.last = function(callback) {
      return this.store().last(callback);
    };

    Scopes.find = function(id, callback) {
      return this.store().find(id, callback);
    };

    Scopes.count = function(callback) {
      return this.store().count(callback);
    };

    Scopes.exists = function(callback) {
      return this.store().exists(callback);
    };

    return Scopes;

  })();

  Metro.Model.Serialization = (function() {

    function Serialization() {}

    Serialization.prototype.toXML = function() {};

    Serialization.prototype.toJSON = function() {
      return JSON.stringify(this.attributes);
    };

    Serialization.prototype.toObject = function() {};

    Serialization.prototype.clone = function() {};

    Serialization.fromJSON = function(data) {
      var i, record, records, _len;
      records = JSON.parse(data);
      if (!(records instanceof Array)) records = [records];
      for (i = 0, _len = records.length; i < _len; i++) {
        record = records[i];
        records[i] = new this(record);
      }
      return records;
    };

    return Serialization;

  })();

  Metro.Model.Validation = (function() {

    function Validation(name, value) {
      this.name = name;
      this.value = value;
      this.attributes = Array.prototype.slice.call(arguments, 2, arguments.length);
      this.validationMethod = (function() {
        switch (name) {
          case "presence":
            return this.validatePresence;
          case "min":
            return this.validateMinimum;
          case "max":
            return this.validateMaximum;
          case "count":
          case "length":
            return this.validateLength;
          case "format":
            if (typeof this.value === 'string') {
              this.value = new RegExp(this.value);
            }
            return this.validateFormat;
        }
      }).call(this);
    }

    Validation.prototype.validate = function(record) {
      var attribute, success, _i, _len, _ref2;
      success = true;
      _ref2 = this.attributes;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        attribute = _ref2[_i];
        if (!this.validationMethod(record, attribute)) success = false;
      }
      return success;
    };

    Validation.prototype.validatePresence = function(record, attribute) {
      if (!record[attribute]) {
        record.errors().push({
          attribute: attribute,
          message: Metro.Support.I18n.t("metro.model.errors.validation.presence", {
            attribute: attribute
          })
        });
        return false;
      }
      return true;
    };

    Validation.prototype.validateMinimum = function(record, attribute) {
      value = record[attribute];
      if (!(typeof value === 'number' && value >= this.value)) {
        record.errors().push({
          attribute: attribute,
          message: Metro.Support.I18n.t("metro.model.errors.validation.minimum", {
            attribute: attribute,
            value: value
          })
        });
        return false;
      }
      return true;
    };

    Validation.prototype.validateMaximum = function(record, attribute) {
      value = record[attribute];
      if (!(typeof value === 'number' && value <= this.value)) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " must be a maximum of " + this.value
        });
        return false;
      }
      return true;
    };

    Validation.prototype.validateLength = function(record, attribute) {
      value = record[attribute];
      if (!(typeof value === 'number' && value === this.value)) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " must be equal to " + this.value
        });
        return false;
      }
      return true;
    };

    Validation.prototype.validateFormat = function(record, attribute) {
      value = record[attribute];
      if (!this.value.exec(value)) {
        record.errors().push({
          attribute: attribute,
          message: "" + attribute + " must be match the format " + (this.value.toString())
        });
        return false;
      }
      return true;
    };

    return Validation;

  })();

  Metro.Model.Validations = (function() {

    function Validations() {
      Validations.__super__.constructor.apply(this, arguments);
    }

    Validations.validates = function() {
      var attributes, key, options, validators, value, _results;
      attributes = Array.prototype.slice.call(arguments, 0, arguments.length);
      options = attributes.pop();
      if (typeof options !== "object") {
        Metro.throw_error("missing_options", "" + this.name + ".validates");
      }
      validators = this.validators();
      _results = [];
      for (key in options) {
        value = options[key];
        _results.push(validators.push((function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return typeof result === "object" ? result : child;
        })(Metro.Model.Validation, [key, value].concat(__slice.call(attributes)), function() {})));
      }
      return _results;
    };

    Validations.validators = function() {
      return this._validators || (this._validators = []);
    };

    Validations.prototype.validate = function() {
      var self, success, validator, validators, _i, _len;
      self = this;
      validators = this.constructor.validators();
      success = true;
      this.errors().length = 0;
      for (_i = 0, _len = validators.length; _i < _len; _i++) {
        validator = validators[_i];
        if (!validator.validate(self)) success = false;
      }
      return success;
    };

    Validations.prototype.errors = function() {
      return this._errors || (this._errors = []);
    };

    return Validations;

  })();

  Metro.Model.include(Metro.Model.Persistence);

  Metro.Model.include(Metro.Model.Scopes);

  Metro.Model.include(Metro.Model.Serialization);

  Metro.Model.include(Metro.Model.Associations);

  Metro.Model.include(Metro.Model.Validations);

  Metro.Model.include(Metro.Model.Dirty);

  Metro.Model.include(Metro.Model.Attributes);

  Metro.View = (function() {

    function View(controller) {
      this.controller = controller || (new Metro.Controller);
    }

    return View;

  })();

  Metro.View.Helpers = (function() {

    function Helpers() {}

    Helpers.prototype.contentTypeTag = function(type) {
      if (type == null) type = "UTF-8";
      return "\n    <meta charset=\"" + type + "\" />";
    };

    Helpers.prototype.t = function(string) {
      var _ref2;
      if ((_ref2 = this._t) == null) {
        this._t = require("" + Metro.root + "/config/locales/en");
      }
      return this._t[string];
    };

    Helpers.prototype.stylesheetTag = function(source) {
      var path, paths, result, _i, _len;
      paths = this.assetPaths(source, {
        directory: Metro.Asset.config.stylesheetDirectory,
        extension: ".css"
      });
      result = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        result.push("\n    <link href=\"" + path + "\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\"/>");
      }
      return result.join("");
    };

    Helpers.prototype.javascriptTag = function(source) {
      var path, paths, result, _i, _len;
      paths = this.assetPaths(source, {
        directory: Metro.Asset.config.javascriptDirectory,
        extension: ".js"
      });
      result = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        result.push("\n    <script type=\"text/javascript\" src=\"" + path + "\" ></script>");
      }
      return result.join("");
    };

    Helpers.prototype.assetPaths = function(source, options) {
      var asset, env, publicPath, result, self;
      if (options == null) options = {};
      options.digest = false;
      env = Metro.Asset;
      publicPath = env.computePublicPath(source, options);
      if (Metro.env === "production" || Metro.Support.Path.isUrl(publicPath)) {
        return [publicPath];
      }
      self = this;
      asset = env.find(publicPath);
      result = [];
      asset.paths({
        paths: env.pathsFor(asset.extension),
        require: Metro.env !== "production"
      }, function(paths) {
        var i, path, _len, _results;
        _results = [];
        for (i = 0, _len = paths.length; i < _len; i++) {
          path = paths[i];
          if (i === paths.length - 1) path = source;
          _results.push(result.push(env.computePublicPath(path, options)));
        }
        return _results;
      });
      return result;
    };

    Helpers.prototype.titleTag = function(title) {
      return "<title>" + title + "</title>";
    };

    Helpers.prototype.metaTag = function(name, content) {};

    Helpers.prototype.tag = function(name, options) {};

    Helpers.prototype.linkTag = function(title, path, options) {};

    Helpers.prototype.imageTag = function(path, options) {};

    return Helpers;

  })();

  Metro.View.Lookup = (function() {

    function Lookup() {}

    Lookup.initialize = function() {
      this.resolveLoadPaths();
      this.resolveTemplatePaths();
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/helpers");
    };

    Lookup.teardown = function() {};

    Lookup.resolveLoadPaths = function() {
      var file;
      file = Path;
      return this.loadPaths = _.map(this.loadPaths, function(path) {
        return Path.relativePath(path);
      });
    };

    Lookup.lookup = function(view) {
      var basename, dirname, pathsByName, pattern, result, template, templates, _i, _len;
      pathsByName = Metro.View.pathsByName;
      result = pathsByName[view];
      if (result) return result;
      templates = Metro.View.paths;
      pattern = new RegExp(view + "$", "i");
      for (_i = 0, _len = templates.length; _i < _len; _i++) {
        template = templates[_i];
        dirname = Path.dirname(template);
        basename = Path.basename(template).split(".")[0];
        key = "" + dirname + "/" + basename;
        if (key.match(pattern)) {
          pathsByName[view] = template;
          return template;
        }
      }
      return null;
    };

    Lookup.resolveTemplatePaths = function() {
      var file, path, templatePaths, _i, _len, _ref2;
      file = require("file");
      templatePaths = this.paths;
      _ref2 = Metro.View.loadPaths;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        path = _ref2[_i];
        file.walkSync(path, function(_path, _directories, _files) {
          var template, _file, _j, _len2, _results;
          _results = [];
          for (_j = 0, _len2 = _files.length; _j < _len2; _j++) {
            _file = _files[_j];
            template = [_path, _file].join("/");
            if (templatePaths.indexOf(template) === -1) {
              _results.push(templatePaths.push(template));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
      }
      return templatePaths;
    };

    Lookup.loadPaths = ["./app/views"];

    Lookup.paths = [];

    Lookup.pathsByName = {};

    Lookup.engine = "jade";

    Lookup.prettyPrint = false;

    return Lookup;

  })();

  Shift = require('shift');

  File = require('pathfinder').File;

  Metro.View.Rendering = (function() {

    function Rendering() {}

    Rendering.prototype.render = function() {
      var args, callback, options, self, template;
      args = Array.prototype.slice.call(arguments, 0, arguments.length);
      if (!(args.length >= 2 && typeof args[args.length - 1] === "function")) {
        throw new Error("You must pass a callback to the render method");
      }
      callback = args.pop();
      if (args.length === 1) {
        if (typeof args[0] === "string") {
          options = {
            template: args[0]
          };
        } else {
          options = args[0];
        }
      } else {
        template = args[0];
        options = args[1];
        options.template = template;
      }
      options || (options = {});
      options.locals = this.context(options);
      options.type || (options.type = Metro.View.engine);
      options.engine = Shift.engine(options.type);
      if (options.hasOwnProperty("layout") && options.layout === false) {
        options.layout = false;
      } else {
        options.layout = options.layout || this.controller.layout();
      }
      self = this;
      return this._renderBody(options, function(error, body) {
        return self._renderLayout(body, options, callback);
      });
    };

    Rendering.prototype._renderBody = function(options, callback) {
      var template;
      if (options.text) {
        return callback(null, options.text);
      } else if (options.json) {
        return callback(null, typeof options.json === "string" ? options.json : JSON.stringify(options.json));
      } else {
        if (!options.inline) {
          template = Metro.View.lookup(options.template);
          template = File.read(template);
        }
        return options.engine.render(template, options.locals, callback);
      }
    };

    Rendering.prototype._renderLayout = function(body, options, callback) {
      var layout;
      if (options.layout) {
        layout = Metro.View.lookup("layouts/" + options.layout);
        layout = File.read(layout);
        options.locals.yield = body;
        return options.engine.render(layout, options.locals, callback);
      } else {
        return callback(null, body);
      }
    };

    Rendering.prototype.context = function(options) {
      var controller, key, locals;
      controller = this.controller;
      locals = {};
      for (key in controller) {
        if (key !== "constructor") locals[key] = controller[key];
      }
      locals = require("underscore").extend(locals, this.locals || {}, options.locals);
      if (Metro.View.prettyPrint) locals.pretty = true;
      return locals;
    };

    return Rendering;

  })();

  Metro.View.include(Metro.View.Lookup);

  Metro.View.include(Metro.View.Rendering);

  Metro.Controller = (function() {

    function Controller() {
      Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.initialize = function() {
      return Metro.Support.Dependencies.load("" + Metro.root + "/app/controllers");
    };

    Controller.teardown = function() {
      delete this._helpers;
      delete this._layout;
      return delete this._theme;
    };

    Controller.reload = function() {
      this.teardown();
      return this.initialize();
    };

    Controller.helper = function(object) {
      this._helpers || (this._helpers = []);
      return this._helpers.push(object);
    };

    Controller.layout = function(layout) {
      return this._layout = layout;
    };

    Controller.theme = function(theme) {
      return this._theme = theme;
    };

    Controller.prototype.layout = function() {
      var layout;
      layout = this.constructor._layout;
      if (typeof layout === "function") {
        return layout.apply(this);
      } else {
        return layout;
      }
    };

    Controller.getter("controllerName", Controller, function() {
      return Metro.Support.String.camelize(this.name);
    });

    Controller.getter("controllerName", Controller.prototype, function() {
      return this.constructor.controllerName;
    });

    Controller.prototype.clear = function() {
      this.request = null;
      this.response = null;
      return this.headers = null;
    };

    return Controller;

  })();

  Metro.Controller.Flash = (function() {

    function Flash() {
      Flash.__super__.constructor.apply(this, arguments);
    }

    return Flash;

  })();

  Metro.Controller.Redirecting = (function() {

    function Redirecting() {}

    Redirecting.prototype.redirectTo = function() {};

    return Redirecting;

  })();

  Metro.Controller.Rendering = (function() {

    function Rendering() {
      Rendering.__super__.constructor.apply(this, arguments);
    }

    Rendering.prototype.render = function() {
      var args, callback, finish, self, view, _base;
      args = Array.prototype.slice.call(arguments, 0, arguments.length);
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
    };

    Rendering.prototype.renderToBody = function(options) {
      this._processOptions(options);
      return this._renderTemplate(options);
    };

    Rendering.prototype.renderToString = function() {
      var options;
      options = this._normalizeRender.apply(this, arguments);
      return this.renderToBody(options);
    };

    Rendering.prototype._renderTemplate = function(options) {
      return this.template.render(viewContext, options);
    };

    return Rendering;

  })();

  Metro.Controller.Responding = (function() {

    Responding.respondTo = function() {
      this._respondTo || (this._respondTo = []);
      return this._respondTo = this._respondTo.concat(arguments);
    };

    Responding.prototype.respondWith = function() {
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
    };

    Responding.prototype.call = function(request, response, next) {
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
    };

    Responding.prototype.process = function() {
      this.processQuery();
      return this[this.params.action]();
    };

    Responding.prototype.processQuery = function() {};

    function Responding() {
      this.headers = {};
      this.status = 200;
      this.request = null;
      this.response = null;
      this.contentType = "text/html";
      this.params = {};
      this.query = {};
    }

    return Responding;

  })();

  Metro.Controller.include(Metro.Controller.Flash);

  Metro.Controller.include(Metro.Controller.Redirecting);

  Metro.Controller.include(Metro.Controller.Rendering);

  Metro.Controller.include(Metro.Controller.Responding);

  Metro.Route = (function() {

    Route.include(Metro.Model.Scopes);

    Route.store = function() {
      return this._store || (this._store = new Metro.Store.Memory);
    };

    Route.create = function(route) {
      return this.store().create(route);
    };

    Route.normalizePath = function(path) {
      return "/" + path.replace(/^\/|\/$/, "");
    };

    Route.initialize = function() {
      return require("" + Metro.root + "/config/routes");
    };

    Route.teardown = function() {
      this._store = [];
      delete require.cache[require.resolve("" + Metro.root + "/config/routes")];
      return delete this._store;
    };

    Route.reload = function() {
      this.teardown();
      return this.initialize();
    };

    Route.draw = function(callback) {
      callback.apply(new Metro.Route.DSL(this));
      return this;
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
      options = _.extend({
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
      return this.match('/', _.extend({
        as: "root"
      }, options));
    };

    DSL.prototype._extractOptions = function() {
      var anchor, constraints, controller, defaults, format, method, name, options, path;
      path = Metro.Route.normalizePath(arguments[0]);
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
        className: _.camelize("_" + controller)
      };
    };

    return DSL;

  })();

  Metro.Route.Url = (function() {

    Url.key = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"];

    Url.aliases = {
      anchor: "fragment"
    };

    Url.parser = {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    };

    Url.querystring_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    Url.fragment_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g;

    Url.type_parser = /(youtube|vimeo|eventbrite)/;

    Url.parse = function(string, strictMode) {
      var i, res, type, url;
      key = Url.key;
      string = decodeURI(string);
      res = Url.parser[(strictMode || false ? "strict" : "loose")].exec(string);
      url = {
        attr: {},
        param: {},
        seg: {}
      };
      i = 14;
      while (i--) {
        url.attr[key[i]] = res[i] || "";
      }
      url.param["query"] = {};
      url.param["fragment"] = {};
      url.attr["query"].replace(Url.querystring_parser, function($0, $1, $2) {
        if ($1) return url.param["query"][$1] = $2;
      });
      url.attr["fragment"].replace(Url.fragment_parser, function($0, $1, $2) {
        if ($1) return url.param["fragment"][$1] = $2;
      });
      url.seg["path"] = url.attr.path.replace(/^\/+|\/+$/g, "").split("/");
      url.seg["fragment"] = url.attr.fragment.replace(/^\/+|\/+$/g, "").split("/");
      url.attr["base"] = (url.attr.host ? url.attr.protocol + "://" + url.attr.host + (url.attr.port ? ":" + url.attr.port : "") : "");
      type = Url.type_parser.exec(url.attr.host);
      if (type) url.attr["type"] = type[0];
      return url;
    };

    function Url(url, strictMode) {
      if (typeof url === "object") {
        this.data = url;
      } else {
        if (arguments.length === 1 && url === true) {
          strictMode = true;
          url = void 0;
        }
        this.strictMode = strictMode || false;
        url = url;
        if (typeof window !== "undefined" && window !== null) {
          if (url == null) url = window.location.toString();
        }
        this.data = Url.parse(url, strictMode);
      }
    }

    Url.prototype.attr = function(attr) {
      attr = Url.aliases[attr] || attr;
      if (attr !== void 0) {
        return this.data.attr[attr];
      } else {
        return this.data.attr;
      }
    };

    Url.prototype.param = function(param) {
      if (param !== void 0) {
        return this.data.param.query[param];
      } else {
        return this.data.param.query;
      }
    };

    Url.prototype.fparam = function(param) {
      if (param !== void 0) {
        return this.data.param.fragment[param];
      } else {
        return this.data.param.fragment;
      }
    };

    Url.prototype.segment = function(seg) {
      if (seg === void 0) {
        return this.data.seg.path;
      } else {
        seg = (seg < 0 ? this.data.seg.path.length + seg : seg - 1);
        return this.data.seg.path[seg];
      }
    };

    Url.prototype.fsegment = function(seg) {
      if (seg === void 0) {
        return this.data.seg.fragment;
      } else {
        seg = (seg < 0 ? this.data.seg.fragment.length + seg : seg - 1);
        return this.data.seg.fragment[seg];
      }
    };

    return Url;

  })();

  Namespace = (function() {

    function Namespace() {}

    Namespace.prototype.defaultLimit = 100;

    Namespace.prototype.reservedOperators = {
      "_sort": "_sort",
      "_limit": "_limit"
    };

    Namespace.prototype.queryOperators = {
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
    };

    return Namespace;

  })();

  Metro.Store = new Namespace;

  Metro.Store.Memory = (function() {

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
      var _ref2;
      if (!record.id) {
        Metro.raise("errors.store.missingAttribute", "id", "Store#create", record);
      }
      if ((_ref2 = record.id) == null) record.id = this.generateId();
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
      var _ref2;
      return (_ref2 = Metro.Support.Array).sortBy.apply(_ref2, arguments);
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
      var self;
      if (this.constructor !== Metro.Middleware.Router) {
        return new Metro.Middleware.Router(request, response, next);
      }
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
      response;
    }

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
      url = request.parsedUrl || (request.parsedUrl = new Metro.Route.Url(request.url));
      path = url.attr("path");
      match = route.match(path);
      if (!match) return null;
      method = request.method.toLowerCase();
      keys = route.keys;
      params = _.extend({}, route.defaults, request.query || {}, request.body || {});
      match = match.slice(1);
      for (i = 0, _len = match.length; i < _len; i++) {
        capture = match[i];
        params[keys[i].name] = capture ? decodeURIComponent(capture) : null;
      }
      controller = route.controller;
      if (controller) params.action = controller.action;
      request.params = params;
      if (controller) {
        try {
          controller = new global[route.controller.className];
        } catch (error) {
          throw new Error("" + route.controller.className + " wasn't found");
        }
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
