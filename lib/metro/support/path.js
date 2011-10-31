var File, crypto, fs, mime, util, _path;
fs = require('fs');
crypto = require('crypto');
mime = require('mime');
_path = require('path');
util = require('util');
File = (function() {
  File.stat = function(path) {
    return fs.statSync(path);
  };
  File.digestHash = function() {
    return crypto.createHash('md5');
  };
  File.digest = function(path, data) {
    var stat;
    stat = this.stat(path);
    if (stat == null) {
      return;
    }
    if (data == null) {
      data = this.read(path);
    }
    if (data == null) {
      return;
    }
    return this.digestHash().update(data).digest("hex");
  };
  File.read = function(path) {
    return fs.readFileSync(path, "utf-8");
  };
  File.readAsync = function(path, callback) {
    return fs.readFile(path, "utf-8", callback);
  };
  File.slug = function(path) {
    return this.basename(path).replace(new RegExp(this.extname(path) + "$"), "");
  };
  File.contentType = function(path) {
    return mime.lookup(path);
  };
  File.mtime = function(path) {
    return this.stat(path).mtime;
  };
  File.size = function(path) {
    return this.stat(path).size;
  };
  File.expandPath = function(path) {
    return _path.normalize(path);
  };
  File.absolutePath = function(path, root) {
    if (root == null) {
      root = this.pwd();
    }
    if (path.charAt(0) !== "/") {
      path = root + "/" + path;
    }
    return _path.normalize(path);
  };
  File.relativePath = function(path, root) {
    if (root == null) {
      root = this.pwd();
    }
    if (path[0] === ".") {
      path = this.join(root, path);
    }
    return _path.normalize(path.replace(new RegExp("^" + Metro.Support.RegExp.escape(root + "/")), ""));
  };
  File.pwd = function() {
    return process.cwd();
  };
  File.basename = function() {
    return _path.basename.apply(_path, arguments);
  };
  File.extname = function(path) {
    return _path.extname(path);
  };
  File.exists = function(path) {
    return _path.existsSync(path);
  };
  File.existsAsync = function(path, callback) {
    return _path.exists(path, callback);
  };
  File.extensions = function(path) {
    return this.basename(path).match(/(\.\w+)/g);
  };
  File.join = function() {
    return Array.prototype.slice.call(arguments, 0, arguments.length).join("/").replace(/\/+/, "/");
  };
  File.isUrl = function(path) {
    return !!path.match(/^[-a-z]+:\/\/|^cid:|^\/\//);
  };
  File.isAbsolute = function(path) {
    return path.charAt(0) === "/";
  };
  File.glob = function() {
    var path, paths, result, _i, _len;
    paths = Metro.Support.Array.extractArgs(arguments);
    result = [];
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (this.exists(path)) {
        result = result.concat(require('findit').sync(path));
      }
    }
    return result;
  };
  File.files = function() {
    var path, paths, result, self, _i, _len;
    paths = this.glob.apply(this, arguments);
    result = [];
    self = this;
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (self.isFile(path)) {
        result.push(path);
      }
    }
    return result;
  };
  File.directories = function() {
    var path, paths, result, self, _i, _len;
    paths = this.glob.apply(this, arguments);
    result = [];
    self = this;
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (self.isDirectory(path)) {
        result.push(path);
      }
    }
    return result;
  };
  File.entries = function(path) {
    return fs.readdirSync(path);
  };
  File.dirname = function(path) {
    return _path.dirname(path);
  };
  File.isDirectory = function(path) {
    return this.stat(path).isDirectory();
  };
  File.isFile = function(path) {
    return !this.isDirectory(path);
  };
  File.copy = function(from, to) {
    var newFile, oldFile;
    oldFile = fs.createReadStream(from);
    newFile = fs.createWriteStream(to);
    return newFile.once('open', function(data) {
      return util.pump(oldFile, newFile);
    });
  };
  File.watch = function() {};
  function File(path) {
    this.path = path;
    this.previousMtime = this.mtime();
  }
  File.prototype.stale = function() {
    var newMtime, oldMtime, result;
    oldMtime = this.previousMtime;
    newMtime = this.mtime();
    result = oldMtime.getTime() !== newMtime.getTime();
    this.previousMtime = newMtime;
    return result;
  };
  File.prototype.stat = function() {
    return this.constructor.stat(this.path);
  };
  File.prototype.contentType = function() {
    return this.constructor.contentType(this.path);
  };
  File.prototype.mtime = function() {
    return this.constructor.mtime(this.path);
  };
  File.prototype.size = function() {
    return this.constructor.size(this.path);
  };
  File.prototype.digest = function() {
    return this.constructor.digest(this.path);
  };
  File.prototype.extensions = function() {
    return this.constructor.extensions(this.path);
  };
  File.prototype.extension = function() {
    return this.constructor.extname(this.path);
  };
  File.prototype.read = function() {
    return this.constructor.read(this.path);
  };
  File.prototype.readAsync = function(callback) {
    return this.constructor.readAsync(this.path, callback);
  };
  File.prototype.absolutePath = function() {
    return this.constructor.absolutePath(this.path);
  };
  File.prototype.relativePath = function() {
    return this.constructor.relativePath(this.path);
  };
  return File;
})();
module.exports = File;