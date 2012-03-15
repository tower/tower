var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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
    if ("/" === route[route.length - 1]) route = route.substr(0, route.length - 1);
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

module.exports = Tower.Application;
