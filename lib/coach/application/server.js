(function() {
  var File, connect, io, server;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  connect = require('express');

  File = require('pathfinder').File;

  server = require('express').createServer();

  io = require('socket.io').listen(server);

  Coach.Application = (function() {

    __extends(Application, Coach.Class);

    Application.use = function() {
      this.middleware || (this.middleware = []);
      return this.middleware.push(arguments);
    };

    Application.defaultStack = function() {
      this.use(connect.favicon(Coach.publicPath + "/favicon.ico"));
      this.use(connect.static(Coach.publicPath, {
        maxAge: Coach.publicCacheDuration
      }));
      if (Coach.env !== "production") this.use(connect.profiler());
      this.use(connect.logger());
      this.use(connect.query());
      this.use(connect.cookieParser(Coach.cookieSecret));
      this.use(connect.session({
        secret: Coach.sessionSecret
      }));
      this.use(connect.bodyParser());
      this.use(connect.csrf());
      this.use(connect.methodOverride("_method"));
      this.use(Coach.Middleware.Agent);
      this.use(Coach.Middleware.Location);
      if (Coach.httpCredentials) {
        this.use(connect.basicAuth(Coach.httpCredentials.username, Coach.httpCredentials.password));
      }
      this.use(Coach.Middleware.Router);
      return this.middleware;
    };

    Application.instance = function() {
      if (!this._instance) require("" + Coach.root + "/config/application");
      return this._instance;
    };

    function Application() {
      var _base;
      if (Coach.Application._instance) {
        throw new Error("Already initialized application");
      }
      (_base = Coach.Application).middleware || (_base.middleware = []);
      Coach.Application._instance = this;
      this.server || (this.server = server);
      this.io || (this.io = io);
    }

    Application.prototype.use = function() {
      var _ref;
      return (_ref = this.constructor).use.apply(_ref, arguments);
    };

    Application.prototype.initialize = function() {
      var path, paths, _i, _len, _results;
      require("" + Coach.root + "/config/application");
      Coach.Support.Dependencies.load("" + Coach.root + "/config/locales/en", function(path) {
        return Coach.Support.I18n.load(path);
      });
      require("" + Coach.root + "/config/routes");
      Coach.Support.Dependencies.load("" + Coach.root + "/app/helpers");
      Coach.Support.Dependencies.load("" + Coach.root + "/app/controllers");
      require("" + Coach.root + "/config/environments/" + Coach.env);
      paths = File.files("" + Coach.root + "/config/initializers");
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _results.push(require(path));
      }
      return _results;
    };

    Application.prototype.teardown = function() {
      Coach.Route.clear();
      delete require.cache[require.resolve("" + Coach.root + "/config/locales/en")];
      delete require.cache[require.resolve("" + Coach.root + "/config/routes")];
      delete Coach.Route._store;
      delete Coach.Controller._helpers;
      delete Coach.Controller._layout;
      return delete Coach.Controller._theme;
    };

    Application.prototype.stack = function() {
      var args, middleware, middlewares, _i, _len, _ref;
      middlewares = this.constructor.middleware;
      if (!(middlewares && middlewares.length > 0)) {
        middlewares = this.constructor.defaultStack();
      }
      for (_i = 0, _len = middlewares.length; _i < _len; _i++) {
        middleware = middlewares[_i];
        args = Coach.Support.Array.args(middleware);
        if (typeof args[0] === "string") {
          middleware = args.shift();
          this.server.use(connect[middleware].apply(connect, args));
        } else {
          (_ref = this.server).use.apply(_ref, args);
        }
      }
      return this;
    };

    Application.prototype.listen = function() {
      if (Coach.env !== "test") {
        this.server.listen(Coach.port);
        return _console.info("Coach " + Coach.env + " server listening on port " + Coach.port);
      }
    };

    Application.prototype.run = function() {
      this.initialize();
      this.stack();
      return this.listen();
    };

    return Application;

  })();

  module.exports = Coach.Application;

}).call(this);
