(function() {
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
    File.digest_hash = function() {
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
      return this.digest_hash().update(data).digest("hex");
    };
    File.read = function(path) {
      return fs.readFileSync(path);
    };
    File.slug = function(path) {
      return this.basename(path).replace(new RegExp(this.extname(path) + "$"), "");
    };
    File.content_type = function(path) {
      return mime.lookup(path);
    };
    File.mtime = function(path) {
      return this.stat(path).mtime;
    };
    File.expand_path = function(path) {
      return _path.normalize(path);
    };
    File.basename = function(path) {
      return _path.basename(path);
    };
    File.extname = function(path) {
      return _path.extname(path);
    };
    File.exists = function(path) {
      return _path.exists(path);
    };
    File.extensions = function(path) {
      return this.basename(path).split(".").slice(1);
    };
    File.copy = function(from, to) {
      var new_file, old_file;
      old_file = fs.createReadStream(from);
      new_file = fs.createWriteStream(to);
      return new_file.once('open', function(data) {
        return util.pump(old_file, new_file);
      });
    };
    File.watch = function() {};
    function File(path) {
      this.path = path;
      this.previous_mtime = this.mtime();
    }
    File.prototype.stale = function() {
      var new_mtime, old_mtime, result;
      old_mtime = this.previous_mtime;
      new_mtime = this.mtime();
      result = old_mtime.getTime() !== new_mtime.getTime();
      console.log("stale? " + (result.toString()) + ", old_mtime: " + old_mtime + ", new_mtime: " + new_mtime);
      this.previous_mtime = new_mtime;
      return result;
    };
    File.prototype.mtime = function() {
      return this.constructor.mtime(this.path);
    };
    return File;
  })();
  module.exports = File;
}).call(this);
