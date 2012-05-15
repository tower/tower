var File, connect, fs, io, server,
  __defineStaticProperty = function(clazz, key, value) {
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

connect = require('express');

File = require('pathfinder').File;

fs = require('fs');

server = null;

io = null;

/*
process.on 'uncaughtException', (error) ->
  handlers = Tower.Application.instance().currentErrorHandlers
  for handler in handlers
    handler(error)
*/


Tower.Application = (function(_super) {
  var Application;

  function Application() {
    return Application.__super__.constructor.apply(this, arguments);
  }

  Application = __extends(Application, _super);

  __defineStaticProperty(Application,  "_callbacks", {});

  __defineStaticProperty(Application,  "extended", function() {
    return global[this.className()] = this.create();
  });

  Application.before("initialize", "setDefaults");

  __defineProperty(Application,  "setDefaults", function() {
    Tower.Model.field("id", {
      type: "Id"
    });
    return true;
  });

  __defineStaticProperty(Application,  "autoloadPaths", ["app/helpers", "app/models", "app/controllers", "app/presenters", "app/mailers", "app/middleware"]);

  __defineStaticProperty(Application,  "configNames", ["session", "assets", "credentials", "databases", "routes"]);

  __defineProperty(Application,  "defaultStack", function() {
    var _this = this;
    this.use(connect["static"](Tower.publicPath, {
      maxAge: Tower.publicCacheDuration
    }));
    if (Tower.env !== "production") {
      this.use(connect.profiler());
    }
    this.use(connect.logger());
    this.use(Tower.Middleware.Agent);
    this.use(Tower.Middleware.Location);
    if (Tower.httpCredentials) {
      this.use(connect.basicAuth(Tower.httpCredentials.username, Tower.httpCredentials.password));
    }
    this.server.get('/', function(request, response) {
      var view;
      view = new Tower.View({});
      return fs.readFile("" + Tower.root + "/index.coffee", 'utf-8', function(error, result) {
        return view.render({
          template: result,
          inline: true,
          type: 'coffee'
        }, function(error, result) {
          if (error) {
            response.writeHead(404, {});
            response.write(error.stack || error.toString());
          } else {
            response.writeHead(200, {
              'Content-Type': 'text/html'
            });
            response.write(result);
          }
          return response.end();
        });
      });
    });
    return this.middleware;
  });

  __defineStaticProperty(Application,  "instance", function() {
    var ref;
    if (!this._instance) {
      if (Tower.isSinglePage) {
        this._instance = this.create();
      } else {
        ref = require("" + Tower.root + "/config/application");
        this._instance || (this._instance = new ref);
      }
    }
    return this._instance;
  });

  __defineStaticProperty(Application,  "configure", function(block) {
    return this.initializers().push(block);
  });

  __defineStaticProperty(Application,  "initializers", function() {
    return this._initializers || (this._initializers = []);
  });

  __defineProperty(Application,  "init", function() {
    var _base;
    if (Tower.Application._instance) {
      throw new Error("Already initialized application");
    }
    this.server || (this.server = require('express').createServer());
    (_base = Tower.Application).middleware || (_base.middleware = []);
    Tower.Application._instance = this;
    return this._super.apply(this, arguments);
  });

  __defineProperty(Application,  "subscribe", function(key, block) {
    Tower.Model.Cursor.subscriptions.push(key);
    return this[key] = typeof block === 'function' ? block() : block;
  });

  __defineProperty(Application,  "unsubscribe", function(key) {
    Tower.Model.Cursor.subscriptions.push(key).splice(_.indexOf(key), 1);
    return delete this[key];
  });

  __defineProperty(Application,  "initialize", function(complete) {
    var configNames, initializer, reloadMap, self,
      _this = this;
    require("" + Tower.root + "/config/application");
    configNames = this.constructor.configNames;
    reloadMap = this.constructor.reloadMap;
    self = this;
    initializer = function(done) {
      var config, key, path, paths, requirePaths, _i, _j, _k, _len, _len1, _len2, _ref;
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
        if (_.isPresent(config)) {
          Tower.config[key] = config;
        }
      }
      Tower.Application.Assets.loadManifest();
      paths = File.files("" + Tower.root + "/config/locales");
      for (_j = 0, _len1 = paths.length; _j < _len1; _j++) {
        path = paths[_j];
        if (path.match(/\.(coffee|js|iced)$/)) {
          Tower.Support.I18n.load(path);
        }
      }
      require("" + Tower.root + "/config/environments/" + Tower.env);
      requirePaths(File.files("" + Tower.root + "/config/initializers"));
      self.configureStores(Tower.config.databases);
      self.stack();
      requirePaths(File.files("" + Tower.root + "/app/helpers"));
      requirePaths(File.files("" + Tower.root + "/app/models"));
      require("" + Tower.root + "/app/controllers/applicationController");
      _ref = ["controllers", "mailers", "observers", "presenters", "middleware"];
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        path = _ref[_k];
        requirePaths(File.files("" + Tower.root + "/app/" + path));
      }
      if (done) {
        return done();
      }
    };
    return this.runCallbacks("initialize", initializer, complete);
  });

  __defineProperty(Application,  "teardown", function() {
    this.server.stack.length = 0;
    Tower.Route.clear();
    return delete require.cache[require.resolve("" + Tower.root + "/config/routes")];
  });

  __defineProperty(Application,  "handle", function() {
    var _ref;
    return (_ref = this.server).handle.apply(_ref, arguments);
  });

  __defineProperty(Application,  "use", function() {
    var args, middleware, _ref;
    args = _.args(arguments);
    if (typeof args[0] === "string") {
      middleware = args.shift();
      return this.server.use(connect[middleware].apply(connect, args));
    } else {
      return (_ref = this.server).use.apply(_ref, args);
    }
  });

  __defineProperty(Application,  "configureStores", function(configuration) {
    var databaseConfig, databaseName, defaultStoreSet, store, _results;
    if (configuration == null) {
      configuration = {};
    }
    defaultStoreSet = false;
    _results = [];
    for (databaseName in configuration) {
      databaseConfig = configuration[databaseName];
      store = Tower.constant("Tower.Store." + (Tower.Support.String.camelize(databaseName)));
      if (!defaultStoreSet || databaseConfig["default"]) {
        Tower.Model["default"]("store", store);
        defaultStoreSet = true;
      }
      _results.push(Tower.callback("initialize", {
        name: "" + store.className + ".initialize"
      }, function(done) {
        try {
          store.configure(Tower.config.databases[databaseName][Tower.env]);
        } catch (_error) {}
        return store.initialize(done);
      }));
    }
    return _results;
  });

  __defineProperty(Application,  "stack", function() {
    var config, configs, self, _i, _len;
    configs = this.constructor.initializers();
    self = this;
    for (_i = 0, _len = configs.length; _i < _len; _i++) {
      config = configs[_i];
      config.call(self);
    }
    return this;
  });

  __defineProperty(Application,  "get", function() {
    var _ref;
    return (_ref = this.server).get.apply(_ref, arguments);
  });

  __defineProperty(Application,  "post", function() {
    var _ref;
    return (_ref = this.server).post.apply(_ref, arguments);
  });

  __defineProperty(Application,  "put", function() {
    var _ref;
    return (_ref = this.server).put.apply(_ref, arguments);
  });

  __defineProperty(Application,  "listen", function() {
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
          if (key.match(/(Controller)$/)) {
            value.applySocketEventHandlers();
          }
        }
        if (Tower.watch) {
          return _this.watch();
        }
      });
    }
  });

  __defineProperty(Application,  "run", function() {
    if (Tower.isSinglePage) {
      this.defaultStack();
    } else {
      this.initialize();
    }
    return this.listen();
  });

  __defineProperty(Application,  "watch", function() {
    return Tower.Application.Watcher.watch();
  });

  return Application;

})(Tower.Engine);

require('./application/assets');

require('./application/watcher');

module.exports = Tower.Application;
