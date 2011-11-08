(function() {
  var crypto, fs, mime, util, _path;
  fs = require('fs');
  crypto = require('crypto');
  mime = require('mime');
  _path = require('path');
  util = require('util');
  Metro.Support.Path = (function() {
    Path.stat = function(path) {
      return fs.statSync(path);
    };
    Path.digestHash = function() {
      return crypto.createHash('md5');
    };
    Path.digest = function(path, data) {
      var stat;
      stat = this.stat(path);
      if (stat == null) {
        return;
      }
      data || (data = this.read(path));
      if (data == null) {
        return;
      }
      return this.digestHash().update(data).digest("hex");
    };
    Path.read = function(path) {
      return fs.readFileSync(path, "utf-8");
    };
    Path.readAsync = function(path, callback) {
      return fs.readFile(path, "utf-8", callback);
    };
    Path.slug = function(path) {
      return this.basename(path).replace(new RegExp(this.extname(path) + "$"), "");
    };
    Path.contentType = function(path) {
      return mime.lookup(path);
    };
    Path.mtime = function(path) {
      return this.stat(path).mtime;
    };
    Path.size = function(path) {
      return this.stat(path).size;
    };
    Path.expandPath = function(path) {
      return _path.normalize(path);
    };
    Path.absolutePath = function(path, root) {
      if (root == null) {
        root = this.pwd();
      }
      if (path.charAt(0) !== "/") {
        path = root + "/" + path;
      }
      return _path.normalize(path);
    };
    Path.relativePath = function(path, root) {
      if (root == null) {
        root = this.pwd();
      }
      if (path[0] === ".") {
        path = this.join(root, path);
      }
      return _path.normalize(path.replace(new RegExp("^" + Metro.Support.RegExp.escape(root + "/")), ""));
    };
    Path.pwd = function() {
      return process.cwd();
    };
    Path.basename = function() {
      return _path.basename.apply(_path, arguments);
    };
    Path.extname = function(path) {
      return _path.extname(path);
    };
    Path.exists = function(path) {
      return _path.existsSync(path);
    };
    Path.existsAsync = function(path, callback) {
      return _path.exists(path, callback);
    };
    Path.extensions = function(path) {
      return this.basename(path).match(/(\.\w+)/g);
    };
    Path.join = function() {
      return Array.prototype.slice.call(arguments, 0, arguments.length).join("/").replace(/\/+/, "/");
    };
    Path.isUrl = function(path) {
      return !!path.match(/^[-a-z]+:\/\/|^cid:|^\/\//);
    };
    Path.isAbsolute = function(path) {
      return path.charAt(0) === "/";
    };
    Path.glob = function() {
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
    Path.files = function() {
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
    Path.directories = function() {
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
    Path.entries = function(path) {
      return fs.readdirSync(path);
    };
    Path.dirname = function(path) {
      return _path.dirname(path);
    };
    Path.isDirectory = function(path) {
      return this.stat(path).isDirectory();
    };
    Path.isFile = function(path) {
      return !this.isDirectory(path);
    };
    Path.copy = function(from, to) {
      var newFile, oldFile;
      oldFile = fs.createReadStream(from);
      newFile = fs.createWriteStream(to);
      return newFile.once('open', function(data) {
        return util.pump(oldFile, newFile);
      });
    };
    Path.watch = function() {};
    function Path(path) {
      this.path = path;
      this.previousMtime = this.mtime();
    }
    Path.prototype.stale = function() {
      var newMtime, oldMtime, result;
      oldMtime = this.previousMtime;
      newMtime = this.mtime();
      result = oldMtime.getTime() !== newMtime.getTime();
      this.previousMtime = newMtime;
      return result;
    };
    Path.prototype.stat = function() {
      return this.constructor.stat(this.path);
    };
    Path.prototype.contentType = function() {
      return this.constructor.contentType(this.path);
    };
    Path.prototype.mtime = function() {
      return this.constructor.mtime(this.path);
    };
    Path.prototype.size = function() {
      return this.constructor.size(this.path);
    };
    Path.prototype.digest = function() {
      return this.constructor.digest(this.path);
    };
    Path.prototype.extensions = function() {
      return this.constructor.extensions(this.path);
    };
    Path.prototype.extension = function() {
      return this.constructor.extname(this.path);
    };
    Path.prototype.read = function() {
      return this.constructor.read(this.path);
    };
    Path.prototype.readAsync = function(callback) {
      return this.constructor.readAsync(this.path, callback);
    };
    Path.prototype.absolutePath = function() {
      return this.constructor.absolutePath(this.path);
    };
    Path.prototype.relativePath = function() {
      return this.constructor.relativePath(this.path);
    };
    return Path;
  })();
  module.exports = Metro.Support.Path;
}).call(this);
