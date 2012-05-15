var __defineStaticProperty = function(clazz, key, value) {
  if (typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);
  return clazz[key] = value;
},
  __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

if (typeof History !== 'undefined') {
  Tower.history = History;
  Tower.forward = History.forward;
  Tower.back = History.back;
  Tower.go = History.go;
}

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
    this.stack = [];
    _results = [];
    for (_i = 0, _len = middlewares.length; _i < _len; _i++) {
      middleware = middlewares[_i];
      _results.push(this.use(middleware));
    }
    return _results;
  });

  __defineProperty(Application,  "ready", function() {
    this._super.apply(this, arguments);
    return $("a").on('click', function() {
      return Tower.get($(this).attr("href"));
    });
  });

  __defineProperty(Application,  "initialize", function() {
    this.extractAgent();
    this.applyMiddleware();
    this.setDefaults();
    return this;
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
    var _this = this;
    if (this.listening) {
      return;
    }
    this.listening = true;
    if (Tower.history && Tower.history.enabled) {
      Tower.history.Adapter.bind(global, "statechange", function() {
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
        return _this.handle(request, response);
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

module.exports = Tower.Application;
