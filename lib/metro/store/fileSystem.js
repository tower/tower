(function() {
  var File;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  File = require('pathfinder').File;

  Metro.Store.FileSystem = (function() {

    __extends(FileSystem, Metro.Object);

    function FileSystem(loadPaths) {
      if (loadPaths == null) loadPaths = [];
      this.loadPaths = loadPaths;
      this.records = {};
    }

    FileSystem.prototype.findPath = function(query, callback) {
      var ext, path, pattern, templatePath, templatePaths, _i, _len;
      path = query.path;
      ext = query.ext || "";
      if (this.records[path]) return this.records[path];
      pattern = typeof path === "string" ? new RegExp("" + path + "\\." + ext, "i") : path;
      templatePaths = File.files.apply(File, this.loadPaths);
      for (_i = 0, _len = templatePaths.length; _i < _len; _i++) {
        templatePath = templatePaths[_i];
        if (!!pattern.exec(templatePath)) {
          this.records[path] = templatePath;
          if (callback) callback(null, templatePath);
          return templatePath;
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

  module.exports = Metro.Store.FileSystem;

}).call(this);
