(function() {
  var Dependencies, fs;
  fs = require('fs');
  Dependencies = (function() {
    function Dependencies() {}
    Dependencies.load = function(directory) {
      var path, paths, _i, _len, _results;
      paths = require('findit').sync(directory);
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _results.push(this.loadPath(path));
      }
      return _results;
    };
    Dependencies.loadPath = function(path) {
      var keys, klass, self;
      self = this;
      keys = this.keys;
      klass = Metro.Support.Path.basename(path).split(".")[0];
      klass = Metro.Support.String.camelize("_" + klass);
      if (!keys[klass]) {
        keys[klass] = new Metro.Support.Path(path);
        return global[klass] = require(path);
      }
    };
    Dependencies.clear = function() {
      var file, key, _ref, _results;
      _ref = this.keys;
      _results = [];
      for (key in _ref) {
        file = _ref[key];
        _results.push(this.clearDependency(key));
      }
      return _results;
    };
    Dependencies.clearDependency = function(key) {
      var file;
      file = this.keys[key];
      delete require.cache[file.path];
      global[key] = null;
      delete global[key];
      this.keys[key] = null;
      return delete this.keys[key];
    };
    Dependencies.reloadModified = function() {
      var file, key, keys, self, _results;
      self = this;
      keys = this.keys;
      _results = [];
      for (key in keys) {
        file = keys[key];
        _results.push(file.stale() ? (self.clearDependency(key), keys[key] = file, global[key] = require(file.path)) : void 0);
      }
      return _results;
    };
    Dependencies.keys = {};
    return Dependencies;
  })();
  module.exports = Dependencies;
}).call(this);
