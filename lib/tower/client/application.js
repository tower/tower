(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Tower.Application = (function() {

    __extends(Application, Tower.Class);

    Application.instance = function() {
      return this._instance;
    };

    function Application(middleware) {
      var _i, _len, _middleware;
      if (middleware == null) middleware = [];
      Tower.Application._instance = this;
      this.io = global["io"];
      this.stack = [];
      for (_i = 0, _len = middleware.length; _i < _len; _i++) {
        _middleware = middleware[_i];
        this.use(_middleware);
      }
      this.History = global.History;
    }

    Application.prototype.initialize = function() {
      this.extractAgent();
      this.use(Tower.Middleware.Location);
      this.use(Tower.Middleware.Routes);
      return this;
    };

    Application.prototype.extractAgent = function() {
      return Tower.agent = new Tower.Net.Agent({
        os: navigator,
        ip: navigator,
        browser: navigator,
        language: navigator
      });
    };

    Application.prototype.use = function(route, handle) {
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

    Application.prototype.listen = function() {
      var self;
      self = this;
      if (this.listening) return;
      this.listening = true;
      if (this.History && this.History.enabled) {
        return this.History.Adapter.bind(global, "statechange", function() {
          var location, request, response, state;
          state = History.getState();
          location = new Tower.Route.Url(state.url);
          request = new Request({
            url: state.url,
            location: location,
            params: Tower.Support.Object.extend({
              title: state.title
            }, state.data || {})
          });
          response = new Response({
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

}).call(this);
