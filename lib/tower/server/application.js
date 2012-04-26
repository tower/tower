(function() {
  var File, connect, io, server,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  connect = require('express');

  File = require('pathfinder').File;

  server = null;

  io = null;

  Tower.Application = (function(_super) {

    __extends(Application, _super);

    Application.before("initialize", "setDefaults");

    Application.prototype.setDefaults = function() {
      Tower.Model["default"]("store", Tower.Store.MongoDB);
      Tower.Model.field("id", {
        type: "Id"
      });
      return true;
    };

    Application.autoloadPaths = ["app/helpers", "app/models", "app/controllers", "app/presenters", "app/mailers", "app/middleware"];

    Application.configNames = ["session", "assets", "credentials", "databases", "routes"];

    Application.defaultStack = function() {
      this.use(connect.favicon(Tower.publicPath + "/favicon.ico"));
      this.use(connect.static(Tower.publicPath, {
        maxAge: Tower.publicCacheDuration
      }));
      if (Tower.env !== "production") this.use(connect.profiler());
      this.use(connect.logger());
      this.use(connect.query());
      this.use(connect.cookieParser(Tower.cookieSecret));
      this.use(connect.session({
        secret: Tower.sessionSecret
      }));
      this.use(connect.bodyParser());
      this.use(connect.csrf());
      this.use(connect.methodOverride("_method"));
      this.use(Tower.Middleware.Agent);
      this.use(Tower.Middleware.Location);
      if (Tower.httpCredentials) {
        this.use(connect.basicAuth(Tower.httpCredentials.username, Tower.httpCredentials.password));
      }
      this.use(Tower.Middleware.Router);
      return this.middleware;
    };

    Application.instance = function() {
      var ref;
      if (!this._instance) {
        ref = require("" + Tower.root + "/config/application");
        this._instance || (this._instance = new ref);
      }
      return this._instance;
    };

    Application.configure = function(block) {
      return this.initializers().push(block);
    };

    Application.initializers = function() {
      return this._initializers || (this._initializers = []);
    };

    function Application() {
      var _base;
      if (Tower.Application._instance) {
        throw new Error("Already initialized application");
      }
      this.server || (this.server = require('express').createServer());
      (_base = Tower.Application).middleware || (_base.middleware = []);
      Tower.Application._instance = this;
      global[this.constructor.name] = this;
    }

    Application.prototype.initialize = function(complete) {
      var configNames, initializer, reloadMap, self,
        _this = this;
      require("" + Tower.root + "/config/application");
      configNames = this.constructor.configNames;
      reloadMap = this.constructor.reloadMap;
      self = this;
      initializer = function(done) {
        var config, key, path, paths, requirePaths, _i, _j, _k, _len, _len2, _len3, _ref;
        requirePaths = function(paths) {
          var path, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            path = paths[_i];
            if (path.match(/\.(coffee|js|iced)$/)) {
              _results.push(require(path));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
        requirePaths(File.files("" + Tower.root + "/config/preinitializers"));
        for (_i = 0, _len = configNames.length; _i < _len; _i++) {
          key = configNames[_i];
          config = null;
          try {
            config = require("" + Tower.root + "/config/" + key);
          } catch (error) {
            config = {};
          }
          if (_.isPresent(config)) Tower.config[key] = config;
        }
        Tower.Application.Assets.loadManifest();
        paths = File.files("" + Tower.root + "/config/locales");
        for (_j = 0, _len2 = paths.length; _j < _len2; _j++) {
          path = paths[_j];
          if (path.match(/\.(coffee|js|iced)$/)) Tower.Support.I18n.load(path);
        }
        require("" + Tower.root + "/config/environments/" + Tower.env);
        requirePaths(File.files("" + Tower.root + "/config/initializers"));
        self.stack();
        requirePaths(File.files("" + Tower.root + "/app/helpers"));
        requirePaths(File.files("" + Tower.root + "/app/models"));
        require("" + Tower.root + "/app/controllers/applicationController");
        _ref = ["controllers", "mailers", "observers", "presenters", "middleware"];
        for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
          path = _ref[_k];
          requirePaths(File.files("" + Tower.root + "/app/" + path));
        }
        return done();
      };
      return this.runCallbacks("initialize", initializer, complete);
    };

    Application.prototype.teardown = function() {
      this.server.stack.length = 0;
      Tower.Route.clear();
      return delete require.cache[require.resolve("" + Tower.root + "/config/routes")];
    };

    Application.prototype.handle = function() {
      var _ref;
      return (_ref = this.server).handle.apply(_ref, arguments);
    };

    Application.prototype.use = function() {
      var args, middleware, _ref;
      args = _.args(arguments);
      if (typeof args[0] === "string") {
        middleware = args.shift();
        return this.server.use(connect[middleware].apply(connect, args));
      } else {
        return (_ref = this.server).use.apply(_ref, args);
      }
    };

    Application.prototype.stack = function() {
      var config, configs, self, _i, _len;
      configs = this.constructor.initializers();
      self = this;
      for (_i = 0, _len = configs.length; _i < _len; _i++) {
        config = configs[_i];
        config.call(self);
      }
      return this;
    };

    Application.prototype.get = function() {
      var _ref;
      return (_ref = this.server).get.apply(_ref, arguments);
    };

    Application.prototype.post = function() {
      var _ref;
      return (_ref = this.server).post.apply(_ref, arguments);
    };

    Application.prototype.put = function() {
      var _ref;
      return (_ref = this.server).put.apply(_ref, arguments);
    };

    Application.prototype.listen = function() {
      var _this = this;
      if (Tower.env !== "test") {
        this.server.on("error", function(error) {
          if (error.errno === "EADDRINUSE") {
            return console.log("   Try using a different port: `node server -p 3001`");
          }
        });
        this.io || (this.io = require('socket.io').listen(this.server));
        return this.server.listen(Tower.port, function() {
          var key, value;
          _console.info("Tower " + Tower.env + " server listening on port " + Tower.port);
          for (key in _this) {
            value = _this[key];
            if (key.match(/(Controller)$/)) value.applySocketEventHandlers();
          }
          if (Tower.watch) return _this.watch();
        });
      }
    };

    Application.prototype.run = function() {
      this.initialize();
      return this.listen();
    };

    Application.prototype.watch = function() {
      return Tower.Application.Watcher.watch();
    };

    return Application;

  })(Tower.Engine);

  require('./application/assets');

  require('./application/watcher');

  module.exports = Tower.Application;

}).call(this);
