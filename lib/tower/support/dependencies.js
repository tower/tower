var File;

File = require('pathfinder').File;

Tower.Support.Dependencies = {
  load: function(directory, callback) {
    var path, paths, _i, _len, _results;
    if (File.exists(directory)) paths = File.files(directory);
    paths || (paths = []);
    _results = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (callback) {
        _results.push(callback(path));
      } else {
        if (!!path.match(/\.(coffee|js)/)) {
          _results.push(this.loadPath(path));
        } else {
          _results.push(void 0);
        }
      }
    }
    return _results;
  },
  loadPath: function(path) {
    var keys, klass, self;
    self = this;
    keys = this.keys;
    klass = File.basename(path).split(".")[0];
    klass = Tower.Support.String.camelize("" + klass);
    if (!keys[klass]) {
      keys[klass] = new File(path);
      return global[klass] || (global[klass] = require(path));
    }
  },
  clear: function() {
    var file, key, _ref, _results;
    _ref = this.keys;
    _results = [];
    for (key in _ref) {
      file = _ref[key];
      _results.push(this.clearDependency(key));
    }
    return _results;
  },
  clearDependency: function(key) {
    var file;
    file = this.keys[key];
    delete require.cache[require.resolve(file.path)];
    global[key] = null;
    delete global[key];
    this.keys[key] = null;
    return delete this.keys[key];
  },
  reloadModified: function() {
    var file, key, keys, self, _results;
    self = this;
    keys = this.keys;
    _results = [];
    for (key in keys) {
      file = keys[key];
      if (file.stale()) {
        self.clearDependency(key);
        keys[key] = file;
        _results.push(global[key] = require(file.path));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  keys: {}
};

module.exports = Tower.Support.Dependencies;
