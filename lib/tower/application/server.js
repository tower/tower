var File, connect, io, server,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

connect = require('express');

File = require('pathfinder').File;

server = require('express').createServer();

io = require('socket.io').listen(server);

Tower.Application = (function(_super) {

  __extends(Application, _super);

  Application.include(Tower.Support.Callbacks);

  Application.autoloadPaths = ["app/helpers", "app/models", "app/controllers", "app/presenters", "app/mailers", "app/middleware"];

  Application.configNames = ["session", "assets", "credentials", "databases", "routes"];

  Application.use = function() {
    this.middleware || (this.middleware = []);
    return this.middleware.push(arguments);
  };

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
    (_base = Tower.Application).middleware || (_base.middleware = []);
    Tower.Application._instance = this;
    global[this.constructor.name] = this;
    this.server || (this.server = server);
    this.io || (this.io = io);
  }

  Application.prototype.use = function() {
    var _ref;
    return (_ref = this.constructor).use.apply(_ref, arguments);
  };

  Application.prototype.initialize = function() {
    var _this = this;
    require("" + Tower.root + "/config/application");
    return this.runCallbacks("initialize", function() {
      var config, configs, path, paths, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _m, _ref, _results;
      paths = File.files("" + Tower.root + "/config/preinitializers");
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        if (path.match(/\.(coffee|js)$/)) require(path);
      }
      _this.runCallbacks("configure", function() {
        var config, key, path, _j, _k, _len2, _len3, _ref;
        _ref = _this.constructor.configNames;
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          key = _ref[_j];
          config = null;
          try {
            config = require("" + Tower.root + "/config/" + key);
          } catch (error) {
            config = {};
          }
          if (Tower.Support.Object.isPresent(config)) Tower.config[key] = config;
        }
        Tower.Application.Assets.loadManifest();
        paths = File.files("" + Tower.root + "/config/locales");
        for (_k = 0, _len3 = paths.length; _k < _len3; _k++) {
          path = paths[_k];
          if (path.match(/\.(coffee|js)$/)) Tower.Support.I18n.load(path);
        }
        return require("" + Tower.root + "/config/environments/" + Tower.env);
      });
      paths = File.files("" + Tower.root + "/config/initializers");
      for (_j = 0, _len2 = paths.length; _j < _len2; _j++) {
        path = paths[_j];
        if (path.match(/\.(coffee|js)$/)) require(path);
      }
      configs = _this.constructor.initializers();
      for (_k = 0, _len3 = configs.length; _k < _len3; _k++) {
        config = configs[_k];
        config.call(_this);
      }
      paths = File.files("" + Tower.root + "/app/helpers");
      paths = paths.concat(File.files("" + Tower.root + "/app/models"));
      paths = paths.concat(["" + Tower.root + "/app/controllers/applicationController"]);
      _ref = ["controllers", "mailers", "observers", "presenters", "middleware"];
      for (_l = 0, _len4 = _ref.length; _l < _len4; _l++) {
        path = _ref[_l];
        paths = paths.concat(File.files("" + Tower.root + "/app/" + path));
      }
      _results = [];
      for (_m = 0, _len5 = paths.length; _m < _len5; _m++) {
        path = paths[_m];
        if (path.match(/\.(coffee|js)$/)) {
          _results.push(require(path));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
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

  Application.prototype.stack = function() {
    var args, middleware, middlewares, _i, _len, _ref;
    middlewares = this.constructor.middleware;
    if (!(middlewares && middlewares.length > 0)) {
      middlewares = this.constructor.defaultStack();
    }
    for (_i = 0, _len = middlewares.length; _i < _len; _i++) {
      middleware = middlewares[_i];
      args = Tower.Support.Array.args(middleware);
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
    if (Tower.env !== "test") {
      this.server.listen(Tower.port);
      return _console.info("Tower " + Tower.env + " server listening on port " + Tower.port);
    }
  };

  Application.prototype.run = function() {
    this.initialize();
    this.stack();
    return this.listen();
  };

  Application.prototype.watch = function() {
    var child, forever,
      _this = this;
    forever = require("forever");
    child = new forever.Monitor("node_modules/design.io/bin/design.io", {
      max: 3,
      silent: true,
      options: []
    });
    child.start();
    return child.on("stdout", function(data) {
      data = data.toString();
      try {
        return data.replace(/\[([^\]]+)\] (\w+) (\w+) (.+)/, function(_, date, type, action, path) {
          var ext;
          path = path.split('\033')[0];
          ext = path.match(/\.(\w+)$/g);
          if (ext) ext = ext[0];
          if (ext && ext.match(/(js|coffee)/) && action.match(/(updated|deleted)/)) {
            _this.fileChanged(path);
          }
          return _;
        });
      } catch (error) {
        return _this;
      }
    });
  };

  Application.prototype.fileChanged = function(path) {
    return delete require.cache[require.resolve(path)];
  };

  return Application;

})(Tower.Class);

require('./assets');

module.exports = Tower.Application;
