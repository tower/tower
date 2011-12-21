(function() {
  var File;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  File = require('pathfinder').File;

  Tower.Store.FileSystem = (function() {

    __extends(FileSystem, Tower.Store);

    function FileSystem(loadPaths) {
      if (loadPaths == null) loadPaths = [];
      this.loadPaths = loadPaths;
      this.records = {};
    }

    FileSystem.prototype.findPath = function(query, callback) {
      var ext, loadPath, loadPaths, path, pattern, patterns, templatePath, templatePaths, _i, _j, _k, _len, _len2, _len3;
      path = query.path;
      ext = query.ext || "";
      if (this.records[path]) return this.records[path];
      loadPaths = this.loadPaths;
      patterns = [];
      if (typeof path === "string") {
        for (_i = 0, _len = loadPaths.length; _i < _len; _i++) {
          loadPath = loadPaths[_i];
          patterns.push(new RegExp("" + loadPath + "/" + path + "\\." + ext, "i"));
        }
      } else {
        patterns.push(path);
      }
      templatePaths = File.files.apply(File, loadPaths);
      for (_j = 0, _len2 = templatePaths.length; _j < _len2; _j++) {
        templatePath = templatePaths[_j];
        for (_k = 0, _len3 = patterns.length; _k < _len3; _k++) {
          pattern = patterns[_k];
          if (!!templatePath.match(pattern)) {
            this.records[path] = templatePath;
            if (callback) callback(null, templatePath);
            return templatePath;
          }
        }
      }
      if (callback) callback(null, null);
      return null;
    };

    FileSystem.prototype.find = function(query, callback) {
      var path;
      path = this.findPath(query);
      if (path) return File.read(path);
      return null;
    };

    FileSystem.alias("select", "find");

    FileSystem.prototype.first = function(query, callback) {};

    FileSystem.prototype.last = function(query, callback) {};

    FileSystem.prototype.all = function(query, callback) {};

    FileSystem.prototype.length = function(query, callback) {};

    FileSystem.alias("count", "length");

    FileSystem.prototype.remove = function(query, callback) {};

    FileSystem.prototype.clear = function() {};

    FileSystem.prototype.toArray = function() {};

    FileSystem.prototype.create = function(record, callback) {
      return this.collection().insert(record, callback);
    };

    FileSystem.prototype.update = function(record) {};

    FileSystem.prototype.destroy = function(record) {};

    FileSystem.prototype.sort = function() {};

    return FileSystem;

  })();

  module.exports = Tower.Store.FileSystem;

}).call(this);
