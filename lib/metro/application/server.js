(function() {
  var File, connect;

  connect = require('express');

  File = require('pathfinder').File;

  Metro.Application = (function() {

    Application.instance = function() {
      if (!this._instance) require("" + Metro.root + "/config/application");
      return this._instance;
    };

    function Application() {
      Metro.Application._instance = this;
      this.server || (this.server = require('express').createServer());
    }

    Application.prototype.use = function() {
      return server.use.apply(server, arguments);
    };

    Application.prototype.initialize = function() {
      require("" + Metro.root + "/config/application");
      Metro.Support.I18n.load("../application/locale/en");
      Metro.Support.I18n.load("../model/locale/en");
      Metro.Support.I18n.load("" + Metro.root + "/config/locales/en");
      require("" + Metro.root + "/config/routes");
      Metro.Support.Dependencies.load("" + Metro.root + "/app/helpers");
      Metro.Support.Dependencies.load("" + Metro.root + "/app/controllers");
      return this.loadInitializers();
    };

    Application.prototype.teardown = function() {
      Metro.Route.clear();
      delete require.cache[require.resolve("" + Metro.root + "/config/locales/en")];
      delete require.cache[require.resolve("" + Metro.root + "/config/routes")];
      delete Metro.Route._store;
      delete Metro.Controller._helpers;
      delete Metro.Controller._layout;
      return delete Metro.Controller._theme;
    };

    Application.prototype.loadInitializers = function() {
      var path, paths, _i, _len, _results;
      require("" + Metro.root + "/config/environments/" + Metro.env);
      paths = File.files("" + Metro.root + "/config/initializers");
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
      server.use(connect.favicon(Metro.publicPath + "/favicon.ico"));
      server.use(connect.static(Metro.publicPath, {
        maxAge: Metro.publicCacheDuration
      }));
      if (Metro.env !== "production") server.use(connect.profiler());
      server.use(connect.logger());
      server.use(connect.query());
      server.use(connect.cookieParser(Metro.cookieSecret));
      server.use(connect.session({
        secret: Metro.sessionSecret
      }));
      server.use(connect.bodyParser());
      server.use(connect.csrf());
      server.use(connect.methodOverride("_method"));
      server.use(Metro.Middleware.Location);
      if (Metro.httpCredentials) {
        server.use(connect.basicAuth(Metro.httpCredentials.username, Metro.httpCredentials.password));
      }
      server.use(Metro.Middleware.Router);
      return server;
    };

    Application.prototype.listen = function() {
      if (Metro.env !== "test") {
        this.server.listen(Metro.port);
        return _console.info("Metro " + Metro.env + " server listening on port " + Metro.port);
      }
    };

    Application.prototype.run = function() {
      this.initialize();
      this.stack();
      return this.listen();
    };

    return Application;

  })();

  module.exports = Metro.Application;

}).call(this);
