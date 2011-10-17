(function() {
  var Dependencies, fs, _;
  _ = require("underscore");
  _.mixin(require("underscore.string"));
  fs = require('fs');
  Dependencies = (function() {
    function Dependencies() {}
    Dependencies.load = function(directory) {
      var path, paths, _i, _len, _results;
      paths = require('findit').sync(directory);
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _results.push(this.load_path(path));
      }
      return _results;
    };
    Dependencies.load_path = function(path) {
      var keys, klass, self;
      self = this;
      keys = this.keys;
      klass = Metro.Support.File.basename(path).split(".")[0];
      klass = _.camelize("_" + klass);
      if (!keys[klass]) {
        keys[klass] = new Metro.Support.File(path);
        return global[klass] = require(path);
      }
    };
    Dependencies.clear = function() {
      var file, key, _ref, _results;
      _ref = this.keys;
      _results = [];
      for (key in _ref) {
        file = _ref[key];
        _results.push(this.clear_dependency(key));
      }
      return _results;
    };
    Dependencies.clear_dependency = function(key) {
      var file;
      file = this.keys[key];
      delete require.cache[file.path];
      global[key] = null;
      delete global[key];
      this.keys[key] = null;
      return delete this.keys[key];
    };
    Dependencies.reload_modified = function() {
      var file, key, keys, self, _results;
      self = this;
      keys = this.keys;
      _results = [];
      for (key in keys) {
        file = keys[key];
        _results.push(file.stale() ? (self.clear_dependency(key), keys[key] = file, global[key] = require(file.path)) : void 0);
      }
      return _results;
    };
    Dependencies.keys = {};
    return Dependencies;
  })();
  module.exports = Dependencies;
}).call(this);
