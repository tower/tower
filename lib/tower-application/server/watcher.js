var File, fs, _, _path;

File = require('pathfinder').File;

_path = require('path');

fs = require('fs');

_ = Tower._;

Tower.ApplicationWatcher = {
  reloadMap: {
    models: {
      pattern: /app\/models/,
      paths: []
    },
    controllers: {
      pattern: /app\/controllers/,
      paths: []
    },
    helpers: {
      pattern: /app\/helpers/,
      paths: []
    }
  },
  checkIfGruntIsWatching: function() {
    var child, forever,
      _this = this;
    return;
    forever = require('forever');
    child = new forever.Monitor('grunt.coffee', {
      max: 1,
      silent: false,
      options: []
    });
    child.start();
    child.on('stdout', function(data) {});
    child.on('error', function(error) {
      return console.log(error);
    });
    return forever.startServer(child);
  },
  watch: function() {
    var chokidar, clientPath, directories, watcher,
      _this = this;
    chokidar = require('chokidar');
    directories = ['app', 'config', 'public'];
    clientPath = new RegExp(_.regexpEscape(_path.join('app', 'client')));
    watcher = chokidar.watch(directories, {
      ignored: function(path) {
        if (path.match(/\./)) {
          return !path.match(/\.(js|coffee|iced|styl)$/);
        } else {
          return !path.match(/(app|config|public)/);
        }
      },
      persistent: true
    });
    return watcher.on('add', function(path) {
      return _this.fileCreated(_path.resolve(Tower.root, path));
    }).on('change', function(path) {
      path = _path.resolve(Tower.root, path);
      if (fs.existsSync(path)) {
        if (!Tower.Application.instance().isConsole && path.match(Tower.publicPath) || path.match(/\.styl$/)) {
          return _this.clientFileUpdated(path);
        } else {
          if (!path.match("" + _path.sep + "client" + _path.sep)) {
            return _this.fileUpdated(path);
          }
        }
      } else {
        return _this.fileDeleted(path);
      }
    }).on('unlink', function(path) {
      return _this.fileDeleted(_path.resolve(Tower.root, path));
    }).on('error', function(error) {
      return this;
    });
  },
  clientFileCreated: function(path) {
    return this._clientFileChanged('fileCreated', path, fs.readFileSync(path, 'utf-8'));
  },
  clientFileUpdated: function(path) {
    return this._clientFileChanged('fileUpdated', path, fs.readFileSync(path, 'utf-8'));
  },
  _clientFileChanged: function(action, path, content) {
    var data;
    data = {
      path: _path.relative(Tower.root, path)
    };
    if (content != null) {
      if (path.match(/\.styl$/)) {
        content = require('mint').stylus(content, {});
        data.path = 'stylesheets/' + data.path.replace(/\.styl$/, '.css');
      }
      data.content = content;
    }
    data.url = '/' + data.path.replace(new RegExp(_.regexpEscape(_path.sep), 'g'), '/').replace(/^public\//, '');
    return Tower.Application.instance().io.sockets.emit(action, JSON.stringify(data, this._jsonReplacer));
  },
  _jsonReplacer: function(key, value) {
    if (value instanceof RegExp) {
      return "(function() { return new RegExp('" + value + "') })";
    } else if (typeof value === "function") {
      return "(" + value + ")";
    } else {
      return value;
    }
  },
  fileCreated: function(path) {
    if (path.match('app/views')) {
      return;
    }
    try {
      return require.resolve(path);
    } catch (error) {
      return require(path);
    }
  },
  fileDeleted: function(path) {
    return delete require.cache[require.resolve(path)];
  },
  fileUpdated: function(path) {
    var app, directory, index, isController, key, klass, klassName, language, name, pattern, subclasses, value, _i, _j, _len, _len1, _ref,
      _this = this;
    app = Tower.Application.instance();
    if (!app.isInitialized) {
      app._loadApp();
    }
    pattern = function(string) {
      return new RegExp(_.regexpEscape(string));
    };
    if (path.match(pattern(_path.join('app', 'templates')))) {
      return Tower.View.cache = {};
    } else if (path.match(pattern(_path.join('app', 'helpers')))) {
      return this.reloadPath(path, function() {
        return _this.reloadPaths(_path.join(Tower.root, 'app', 'controllers'));
      });
    } else if (path.match(pattern(_path.join('config/server', 'assets.coffee')))) {
      return this.reloadPath(path, function(error, config) {
        Tower.config.assets = config || {};
        return Tower.ApplicationAssets.loadManifest();
      });
    } else if (path.match(/app\/(models|controllers)\/.+\.(?:coffee|js|iced)/)) {
      isController = RegExp.$1 === 'controllers';
      directory = "app/" + RegExp.$1;
      klassName = path.split('/');
      klassName = klassName[klassName.length - 1];
      klassName = klassName.split('.');
      klassName.pop();
      klassName = klassName.join('.');
      klassName = _.camelize(klassName);
      klass = (function() {
        try {
          return Tower.constant(klassName);
        } catch (_error) {}
      })();
      if (!klass) {
        return require(path);
      } else {
        app = Tower.Application.instance();
        subclasses = [];
        _ref = _.keys(app);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          value = app[key];
          if (klass !== value && klass.detect(value)) {
            subclasses.push(key);
          }
        }
        for (index = _j = 0, _len1 = subclasses.length; _j < _len1; index = ++_j) {
          name = subclasses[index];
          subclasses[index] = _path.join(directory, _.camelize(name, true));
        }
        return this.reloadPath(path, function() {
          return _this.reloadPaths(subclasses, function() {
            var paths, _k, _len2, _results;
            if (isController) {
              paths = Tower.Application.instance()._buildRequirePaths('app/config', 'routes');
              _results = [];
              for (_k = 0, _len2 = paths.length; _k < _len2; _k++) {
                path = paths[_k];
                try {
                  _results.push(_this.reloadPath(path));
                } catch (_error) {}
              }
              return _results;
            }
          });
        });
      }
    } else if (path.match(/config\/(server|shared)\/routes\.(?:coffee|js|iced)/)) {
      return this.reloadPath(path);
    } else if (path.match(/config\/(server|shared)\/locales\/(\w+)\.(?:coffee|js|iced)/)) {
      language = RegExp.$1;
      return this.reloadPath(path, function(error, locale) {
        return Tower.SupportI18n.load(locale, language);
      });
    }
  },
  reloadPath: function(path, callback) {
    path = require.resolve(_path.resolve(Tower.root, _path.relative(Tower.root, path)));
    delete require.cache[path];
    return process.nextTick(function() {
      var result;
      result = require(path);
      if (callback) {
        return callback(null, result);
      }
    });
  },
  reloadPaths: function(directory, callback) {
    var path, _i, _len, _ref;
    _ref = File.files(directory);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      path = _ref[_i];
      if (path.match(/\.(?:coffee|js|iced)$/)) {
        this.reloadPath(path);
      }
    }
    if (callback) {
      return process.nextTick(function() {
        return callback();
      });
    }
  }
};
