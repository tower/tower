var fs, io, server, _, _path,
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

fs = require('fs');

_path = require('path');

server = null;

io = null;

_ = Tower._;

Tower.tcpPort = 6969;

Tower.Application = (function(_super) {
  var Application;

  function Application() {
    return Application.__super__.constructor.apply(this, arguments);
  }

  Application = __extends(Application, _super);

  Application.reopenClass({
    _callbacks: {},
    autoloadPaths: ['app/helpers', 'app/concerns', 'app/models', 'app/controllers', 'app/presenters', 'app/services', 'app/mailers', 'app/abilities', 'app/middleware', 'app/jobs'],
    configNames: ['session', 'assets', 'credentials', 'databases', 'routes'],
    instance: function() {
      var app;
      if (!this._instance) {
        app = require("" + Tower.root + "/app/config/shared/application");
        this._instance || (this._instance = app.create());
      }
      return this._instance;
    },
    initializers: function() {
      return this._initializers || (this._initializers = []);
    }
  });

  Application.before('initialize', 'setDefaults');

  Application.reopen({
    paths: [],
    pathsByType: {},
    setDefaults: function() {
      return true;
    },
    errorHandlers: [],
    init: function() {
      if (Tower.Application._instance) {
        throw new Error('Already initialized application');
      }
      this.app || (this.app = require('express')());
      this.server = require('http').createServer(this.app);
      Tower.Application._instance = this;
      return this._super.apply(this, arguments);
    },
    initialize: function(config, complete) {
      var initializer, type,
        _this = this;
      this._loadBase();
      type = typeof config;
      if (type !== 'object') {
        if (type === 'function') {
          complete = config;
          config = {};
        } else {
          config = {};
        }
      }
      type = null;
      initializer = function(done) {
        _this._loadPreinitializers();
        _this._loadConfig(config);
        _this._loadAssets();
        _this._loadLocales();
        _this._loadEnvironment();
        _this._loadInitializers();
        return _this.configureStores(Tower.config.databases, function() {
          if (!Tower.isConsole) {
            _this.stack();
          }
          if (!Tower.lazyLoadApp) {
            return _this._loadApp(done);
          } else {
            done();
            return process.nextTick(function() {
              return _this._loadApp();
            });
          }
        });
      };
      return this.runCallbacks('initialize', initializer, complete);
    },
    teardown: function() {
      this.server.stack.length = 0;
      return Tower.Route.clear();
    },
    handle: function() {
      var _ref;
      return (_ref = this.app).handle.apply(_ref, arguments);
    },
    use: function() {
      var app, args, express, middleware;
      args = _.args(arguments);
      express = require('express');
      app = this.app;
      if (typeof args[0] === 'string') {
        middleware = args.shift();
        return app.use(express[middleware].apply(express, args));
      } else {
        return app.use.apply(app, args);
      }
    },
    configureStores: function(configuration, callback) {
      var databaseNames, defaultDatabase, defaultStoreSet, iterator,
        _this = this;
      if (configuration == null) {
        configuration = {};
      }
      defaultStoreSet = false;
      databaseNames = _.keys(configuration);
      defaultDatabase = configuration["default"];
      iterator = function(databaseName, next) {
        var databaseConfig, store, storeClassName;
        if (databaseName === 'default') {
          return next();
        }
        databaseConfig = configuration[databaseName];
        storeClassName = "Tower.Store" + (_.camelize(databaseName));
        try {
          store = Tower.constant(storeClassName);
        } catch (error) {
          store = require("" + __dirname + "/../../tower-store/server/" + databaseName);
        }
        if (defaultDatabase != null) {
          if (databaseName === defaultDatabase) {
            Tower.Model["default"]('store', store);
            defaultStoreSet = true;
          }
        } else {
          if (!defaultStoreSet || databaseConfig["default"]) {
            if (!Tower.Model["default"]('store')) {
              Tower.Model["default"]('store', store);
            }
            defaultStoreSet = true;
          }
        }
        try {
          store.configure(Tower.config.databases[databaseName][Tower.env]);
        } catch (_error) {}
        return store.initialize(next);
      };
      return Tower.parallel(databaseNames, iterator, function() {
        if (!defaultStoreSet) {
          console.log('Default database not set, using Memory store');
        }
        if (callback) {
          return callback.call(_this);
        }
      });
    },
    stack: function() {
      var config, configs, _i, _len;
      if (this.isStacked) {
        return this;
      }
      this.isStacked = true;
      configs = this.constructor.initializers();
      for (_i = 0, _len = configs.length; _i < _len; _i++) {
        config = configs[_i];
        config.call(this);
      }
      return this;
    },
    get: function() {
      var _ref;
      return (_ref = this.app).get.apply(_ref, arguments);
    },
    post: function() {
      var _ref;
      return (_ref = this.app).post.apply(_ref, arguments);
    },
    put: function() {
      var _ref;
      return (_ref = this.app).put.apply(_ref, arguments);
    },
    listen: function() {
      var _this = this;
      if (Tower.env !== 'test') {
        this.app.on('error', function(error) {
          if (error.errno === 'EADDRINUSE') {
            console.log('   Try using a different port: `node server -p 3001`');
            return process.exit();
          }
        });
        this.initializeSockets();
        return this.server.listen(Tower.port, function() {
          var key, value;
          console.info("Tower " + Tower.env + " server listening on port " + Tower.port);
          for (key in _this) {
            value = _this[key];
            if (key.match(/(Controller)$/)) {
              value.applySocketEventHandlers();
            }
          }
          if (Tower.watch) {
            _this.watch();
          }
          if (Tower.env === 'development') {
            return _this.initializeServerHooks();
          }
        });
      }
    },
    initializeSockets: function() {
      if (!this.io) {
        Tower.NetConnection.initialize();
        return this.io = Tower.NetConnection.listen(this.server);
      }
    },
    initializeConsoleHooks: function() {},
    initializeServerHooks: function() {},
    run: function() {
      this.initialize();
      return this.listen();
    },
    watch: function() {
      return Tower.ApplicationWatcher.watch();
    },
    _loadBase: function() {
      this._requireAny('app/config', 'application');
      return this._requireAny('app/config', 'bootstrap');
    },
    _loadPreinitializers: function() {
      return this._requirePaths(this.selectPaths('app/config', 'preinitializers'));
    },
    _loadConfig: function(options) {
      var config, databases, defaultDatabase, key, _base, _i, _len, _ref;
      _ref = this.constructor.configNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        config = this._requireFirst('app/config', key) || {};
        if (_.isPresent(config)) {
          Tower.config[key] = config;
        }
      }
      (_base = Tower.config).databases || (_base.databases = {});
      databases = options.databases || options.database;
      defaultDatabase = options.defaultDatabase;
      if (databases) {
        if (!(databases instanceof Array)) {
          databases = [databases];
        }
        databases.push('default');
        Tower.config.databases = _.pick(Tower.config.databases, databases);
        if (defaultDatabase != null) {
          return Tower.config.databases["default"] = defaultDatabase;
        }
      }
    },
    _loadAssets: function() {
      Tower.ApplicationAssets.loadManifest();
      //return Tower.Ready.new("loadAssets");
    },
    _loadLocales: function() {
      var path, _i, _len, _ref, _results;
      _ref = this.selectPaths('app/config', 'locales');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        _results.push(Tower.SupportI18n.load(path));
      }
      return _results;
    },
    _loadEnvironment: function() {
      return this._requireAny('app/config', "environments/" + Tower.env);
    },
    _loadInitializers: function() {
      return this._requirePaths(this.selectPaths('app/config', 'initializers'));
    },
    _loadMVC: function() {
      var path, _i, _len, _ref, _results;
      _ref = this.constructor.autoloadPaths;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        if (path.match('app/controllers')) {
          this._requireAny('app/controllers', 'applicationController');
        }
        _results.push(this._requirePaths(this.selectPaths(path)));
      }
      return _results;
    },
    _loadApp: function(done) {
      //this._loadPackages();
      this._loadMVC();
      Tower.isInitialized = true;
      if (done) {
        return done();
      }
    },
    _loadPackages: function() {
      Tower.Packages.initialize();
    },
    requireDirectory: function(path, type) {
      var file, files, pattern, wrench, _i, _len, _ref;
      if (type == null) {
        type = 'script';
      }
      wrench = Tower.module('wrench');
      pattern = this._typeToPattern[type];
      _ref = files = wrench.readdirSyncRecursive(path);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.match(pattern)) {
          require(_path.join(Tower.root, path, file));
        }
      }
      return files;
    },
    _requirePaths: function(paths) {
      var path, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _results.push(require(path));
      }
      return _results;
    },
    _requireAny: function(pathStart, pathEnd) {
      var path, _i, _len, _ref, _results;
      _ref = this._buildRequirePaths(pathStart, pathEnd);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        _results.push(this._tryToRequire(path));
      }
      return _results;
    },
    _requireFirst: function(pathStart, pathEnd) {
      var path, result, _i, _len, _ref;
      _ref = this._buildRequirePaths(pathStart, pathEnd);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        result = this._tryToRequire(path);
        if (result != null) {
          return result;
        }
      }
      return null;
    },
    _buildRequirePaths: function(pathStart, pathEnd) {
      return [_path.join(Tower.root, pathStart, pathEnd), _path.join(Tower.root, pathStart, 'shared', pathEnd), _path.join(Tower.root, pathStart, 'server', pathEnd)];
    },
    _tryToRequire: function(path) {
      try {
        return require(path);
      } catch (error) {
        if (Tower.debug) {
          console.error(error);
        }
        return null;
      }
    },
    selectPaths: function(pathStart, pathEnd, type) {
      var clientDir, index, key, paths, pattern, requirePath, wrench, _i, _len, _ref;
      if (type == null) {
        type = 'script';
      }
      key = this._pathCacheKey(pathStart, pathEnd);
      paths = this.pathsByType[key];
      if (paths != null) {
        return paths;
      }
      paths = [];
      wrench = Tower.module('wrench');
      pattern = this._typeToPattern[type];
      _ref = this._buildRequirePaths(pathStart, pathEnd);
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        requirePath = _ref[index];
        if (!fs.existsSync(requirePath)) {
          continue;
        }
        if (index === 0) {
          clientDir = new RegExp(_.regexpEscape(_path.join(requirePath, 'client')), 'g');
          paths = paths.concat(_.select(this._selectNestedPaths(requirePath, wrench.readdirSyncRecursive(requirePath)), function(path) {
            return !path.match(clientDir);
          }));
        } else {
          paths = paths.concat(this._selectNestedPaths(requirePath, wrench.readdirSyncRecursive(requirePath)));
        }
      }
      return this.pathsByType[key] = _.select(paths, function(path) {
        return path.match(pattern);
      });
    },
    _selectNestedPaths: function(dir, paths) {
      return _.select(_.map(paths, function(path) {
        return _path.join(dir, path);
      }), function(path) {
        return !fs.statSync(path).isDirectory();
      });
    },
    _typeToPattern: {
      script: /\.(coffee|js|iced)$/,
      stylesheet: /\.(css|less|styl|sass)$/,
      template: /\.(jade|ejs|handlebars|html|eco|coffee)/
    },
    _pathCacheKey: function(pathStart, pathEnd) {
      var key;
      key = pathStart;
      if (pathEnd != null) {
        key += "," + pathEnd;
      }
      return key;
    }
  });

  return Application;

})(Tower.Engine);

module.exports = Tower.Application;
