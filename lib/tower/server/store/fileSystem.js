var File,
  __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) { 
    if(typeof parent.__extend == 'function') return parent.__extend();
      
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if(typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

File = require('pathfinder').File;

Tower.Store.FileSystem = (function(_super) {
  var FileSystem;

  FileSystem = __extends(FileSystem, _super);

  function FileSystem(loadPaths) {
    if (loadPaths == null) {
      loadPaths = [];
    }
    this.loadPaths = loadPaths;
    this.records = {};
  }

  __defineProperty(FileSystem,  "findPath", function(query, callback) {
    var ext, loadPath, loadPaths, path, pattern, patterns, prefix, prefixes, templatePath, templatePaths, _i, _j, _k, _l, _len, _len1, _len2, _len3;
    path = query.path;
    ext = query.ext || "";
    prefixes = query.prefixes || [];
    loadPaths = this.loadPaths;
    patterns = [];
    if (typeof path === "string") {
      for (_i = 0, _len = loadPaths.length; _i < _len; _i++) {
        loadPath = loadPaths[_i];
        for (_j = 0, _len1 = prefixes.length; _j < _len1; _j++) {
          prefix = prefixes[_j];
          patterns.push(new RegExp("" + loadPath + "/" + prefix + "/" + path + "\\." + ext));
        }
        patterns.push(new RegExp("" + loadPath + "/" + path + "\\." + ext));
      }
    } else {
      patterns.push(path);
    }
    templatePaths = File.files.apply(File, loadPaths);
    for (_k = 0, _len2 = patterns.length; _k < _len2; _k++) {
      pattern = patterns[_k];
      for (_l = 0, _len3 = templatePaths.length; _l < _len3; _l++) {
        templatePath = templatePaths[_l];
        if (!!templatePath.match(pattern)) {
          if (callback) {
            callback(null, templatePath);
          }
          return templatePath;
        }
      }
    }
    if (callback) {
      callback(null, null);
    }
    return null;
  });

  __defineProperty(FileSystem,  "find", function(query, callback) {
    var path;
    path = this.findPath(query);
    if (path) {
      return File.read(path) || "";
    }
    return null;
  });

  __defineProperty(FileSystem,  "defaultPath", function(query, callback) {
    var path;
    path = "" + this.loadPaths[0] + "/" + query.path;
    return path = path.replace(new RegExp("(\\." + query.ext + ")?$"), "." + query.ext);
  });

  return FileSystem;

})(Tower.Store);

module.exports = Tower.Store.FileSystem;
