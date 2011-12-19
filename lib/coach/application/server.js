(function() {
  var File, connect;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  connect = require('express');

  File = require('pathfinder').File;

  Coach.Application = (function() {

    __extends(Application, Coach.Class);

    Application.instance = function() {
      if (!this._instance) require("" + Coach.root + "/config/application");
      return this._instance;
    };

    function Application() {
      Coach.Application._instance = this;
      this.server || (this.server = require('express').createServer());
      this.io || (this.io = require('socket.io').listen(this.server));
    }

    Application.prototype.use = function() {
      return server.use.apply(server, arguments);
    };

    Application.prototype.initialize = function() {
      require("" + Coach.root + "/config/application");
      Coach.Support.I18n.load("../application/locale/en");
      Coach.Support.I18n.load("../model/locale/en");
      Coach.Support.I18n.load("" + Coach.root + "/config/locales/en");
      require("" + Coach.root + "/config/routes");
      Coach.Support.Dependencies.load("" + Coach.root + "/app/helpers");
      Coach.Support.Dependencies.load("" + Coach.root + "/app/controllers");
      return this.loadInitializers();
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

    Application.prototype.loadInitializers = function() {
      var path, paths, _i, _len, _results;
      require("" + Coach.root + "/config/environments/" + Coach.env);
      paths = File.files("" + Coach.root + "/config/initializers");
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _results.push(require(path));
      }
      return _results;
    };

    Application.prototype.stack = function() {
      var server;
      server = this.server;
      server.use(connect.favicon(Coach.publicPath + "/favicon.ico"));
      server.use(connect.static(Coach.publicPath, {
        maxAge: Coach.publicCacheDuration
      }));
      if (Coach.env !== "production") server.use(connect.profiler());
      server.use(connect.logger());
      server.use(connect.query());
      server.use(connect.cookieParser(Coach.cookieSecret));
      server.use(connect.session({
        secret: Coach.sessionSecret
      }));
      server.use(connect.bodyParser());
      server.use(connect.csrf());
      server.use(connect.methodOverride("_method"));
      server.use(Coach.Middleware.Location);
      if (Coach.httpCredentials) {
        server.use(connect.basicAuth(Coach.httpCredentials.username, Coach.httpCredentials.password));
      }
      server.use(Coach.Middleware.Router);
      return server;
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
