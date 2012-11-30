var fs, _, _path,
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

_ = Tower._;

fs = require('fs');

_path = require('path');

Tower.StoreFileSystem = (function(_super) {
  var StoreFileSystem;

  function StoreFileSystem() {
    return StoreFileSystem.__super__.constructor.apply(this, arguments);
  }

  StoreFileSystem = __extends(StoreFileSystem, _super);

  StoreFileSystem.reopen({
    init: function(loadPaths) {
      if (loadPaths == null) {
        loadPaths = [];
      }
      this.loadPaths = loadPaths;
      return this.records = {};
    },
    getTemplatePaths: function() {
      return this._templatePaths || (this._templatePaths = _.map(Tower.files(_.map(this.loadPaths, function(i) {
        return _path.join(Tower.root, i);
      })), function(i) {
        return _path.relative(Tower.root, i);
      }));
    },
    findPath: function(query, callback) {
      var ext, loadPath, loadPaths, path, pattern, patterns, prefix, prefixes, sep, templatePath, templatePaths, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      path = query.path.replace(/\//g, _path.sep);
      ext = query.ext || "";
      prefixes = query.prefixes || [];
      loadPaths = _.map(this.loadPaths, function(i) {
        return i.replace(/\//g, _path.sep);
      });
      patterns = [];
      sep = _path.sep;
      if (typeof path === "string") {
        for (_i = 0, _len = loadPaths.length; _i < _len; _i++) {
          loadPath = loadPaths[_i];
          for (_j = 0, _len1 = prefixes.length; _j < _len1; _j++) {
            prefix = prefixes[_j];
            patterns.push(new RegExp(_.regexpEscape("" + loadPath + sep + prefix + sep + path + "\." + ext)));
          }
          patterns.push(new RegExp(_.regexpEscape("" + loadPath + sep + path + "\." + ext)));
        }
      } else {
        patterns.push(path);
      }
      templatePaths = this.getTemplatePaths();
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
    },
    find: function(query, callback) {
      var path;
      path = this.findPath(query);
      if (path) {
        return fs.readFileSync(path, 'utf-8') || "";
      }
      return null;
    },
    defaultPath: function(query, callback) {
      var path;
      path = "" + this.loadPaths[0] + _path.sep + query.path;
      return path = path.replace(new RegExp("(\\." + query.ext + ")?$"), "." + query.ext);
    },
    create: function(cursor, callback) {},
    update: function(updates, cursor, callback) {},
    destroy: function(cursor, callback) {},
    exists: function(cursor, callback) {},
    count: function(cursor, callback) {}
  });

  return StoreFileSystem;

})(Tower.Store);

module.exports = Tower.StoreFileSystem;
