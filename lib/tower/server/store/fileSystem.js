var File,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

File = require('pathfinder').File;

Tower.Store.FileSystem = (function(_super) {

  __extends(FileSystem, _super);

  function FileSystem(loadPaths) {
    if (loadPaths == null) loadPaths = [];
    this.loadPaths = loadPaths;
    this.records = {};
  }

  FileSystem.prototype.findPath = function(query, callback) {
    var ext, loadPath, loadPaths, path, pattern, patterns, prefix, prefixes, templatePath, templatePaths, _i, _j, _k, _l, _len, _len2, _len3, _len4;
    path = query.path;
    ext = query.ext || "";
    prefixes = query.prefixes || [];
    loadPaths = this.loadPaths;
    patterns = [];
    if (typeof path === "string") {
      for (_i = 0, _len = loadPaths.length; _i < _len; _i++) {
        loadPath = loadPaths[_i];
        for (_j = 0, _len2 = prefixes.length; _j < _len2; _j++) {
          prefix = prefixes[_j];
          patterns.push(new RegExp("" + loadPath + "/" + prefix + "/" + path + "\\." + ext));
        }
        patterns.push(new RegExp("" + loadPath + "/" + path + "\\." + ext));
      }
    } else {
      patterns.push(path);
    }
    templatePaths = File.files.apply(File, loadPaths);
    for (_k = 0, _len3 = patterns.length; _k < _len3; _k++) {
      pattern = patterns[_k];
      for (_l = 0, _len4 = templatePaths.length; _l < _len4; _l++) {
        templatePath = templatePaths[_l];
        if (!!templatePath.match(pattern)) {
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
    if (path) return File.read(path) || "";
    return null;
  };

  return FileSystem;

})(Tower.Store);

module.exports = Tower.Store.FileSystem;
