var File, connect, io, server;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

connect = require('express');

File = require('pathfinder').File;

server = null;

io = null;

Tower.Application = (function() {

  __extends(Application, Tower.Engine);

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
    this.server || (this.server = require('express').createServer());
    (_base = Tower.Application).middleware || (_base.middleware = []);
    Tower.Application._instance = this;
    global[this.constructor.name] = this;
  }

  Application.prototype.use = function() {
    var _ref;
    return (_ref = this.constructor).use.apply(_ref, arguments);
  };

  Application.prototype.initialize = function(complete) {
    var initializer;
    var _this = this;
    require("" + Tower.root + "/config/application");
    initializer = function(done) {
      var config, configs, key, path, paths, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _m, _n, _ref, _ref2;
      _ref = _this.constructor.configNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
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
      for (_j = 0, _len2 = paths.length; _j < _len2; _j++) {
        path = paths[_j];
        if (path.match(/\.(coffee|js)$/)) Tower.Support.I18n.load(path);
      }
      require("" + Tower.root + "/config/environments/" + Tower.env);
      paths = File.files("" + Tower.root + "/config/initializers");
      for (_k = 0, _len3 = paths.length; _k < _len3; _k++) {
        path = paths[_k];
        if (path.match(/\.(coffee|js)$/)) require(path);
      }
      configs = _this.constructor.initializers();
      for (_l = 0, _len4 = configs.length; _l < _len4; _l++) {
        config = configs[_l];
        config.call(_this);
      }
      paths = File.files("" + Tower.root + "/app/helpers");
      paths = paths.concat(File.files("" + Tower.root + "/app/models"));
      paths = paths.concat(["" + Tower.root + "/app/controllers/applicationController"]);
      _ref2 = ["controllers", "mailers", "observers", "presenters", "middleware"];
      for (_m = 0, _len5 = _ref2.length; _m < _len5; _m++) {
        path = _ref2[_m];
        paths = paths.concat(File.files("" + Tower.root + "/app/" + path));
      }
      for (_n = 0, _len6 = paths.length; _n < _len6; _n++) {
        path = paths[_n];
        if (path.match(/\.(coffee|js)$/)) require(path);
      }
      return done();
    };
    console.log("RUN INITIALIZER");
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
    var _this = this;
    if (Tower.env !== "test") {
      this.server.on("error", function(error) {
        if (error.errno === "EADDRINUSE") {
          return console.log("   Try using a different port: `node server -p 3001`");
        }
      });
      this.io || (this.io = require('socket.io').listen(this.server));
      return this.server.listen(Tower.port, function() {
        return _console.info("Tower " + Tower.env + " server listening on port " + Tower.port);
      });
    }
  };

  Application.prototype.run = function() {
    this.initialize();
    this.stack();
    return this.listen();
  };

  Application.prototype.watch = function() {
    var child, forever;
    var _this = this;
    forever = require("forever");
    child = new forever.Monitor("node_modules/design.io/bin/design.io", {
      max: 1,
      silent: false,
      options: []
    });
    child.start();
    child.on("stdout", function(data) {
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
    child.on("error", function(error) {
      return console.log(error);
    });
    return forever.startServer(child);
  };

  Application.prototype.fileChanged = function(path) {
    return delete require.cache[require.resolve(path)];
  };

  return Application;

})();

require('./assets');

module.exports = Tower.Application;
