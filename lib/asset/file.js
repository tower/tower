(function() {
  var File, crypto, exports, fs, mime, util, _path;
  fs = require('fs');
  crypto = require('crypto');
  mime = require('mime');
  _path = require('path');
  util = require('util');
  File = (function() {
    File.stat = function(path) {
      return fs.statSync(path);
    };
    /*
      see http://nodejs.org/docs/v0.3.1/api/crypto.html#crypto
      */
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
    function File(environment, path) {
      this.environment = environment;
      this.path = this.constructor.expand_path(path);
    }
    File.prototype.stat = function() {
      return this.constructor.stat(this.path);
    };
    /*
      Returns `Content-Type` from path.
      */
    File.prototype.content_type = function() {
      var _ref;
      return (_ref = this._content_type) != null ? _ref : this._content_type = this.constructor.content_type(this.path);
    };
    /*
      Get mtime at the time the `Asset` is built.
      */
    File.prototype.mtime = function() {
      var _ref;
      return (_ref = this._mtime) != null ? _ref : this._mtime = this.constructor.stat(this.path).mtime;
    };
    /*
      Get size at the time the `Asset` is built.
      */
    File.prototype.size = function() {
      var _ref;
      return (_ref = this._size) != null ? _ref : this._size = this.constructor.stat(this.path).size;
    };
    /*
      Get content digest at the time the `Asset` is built.
      */
    File.prototype.digest = function() {
      var _ref;
      return (_ref = this._digest) != null ? _ref : this._digest = this.constructor.digest(this.path);
    };
    /*
      Return logical path with digest spliced in.
      
        "foo/bar-37b51d194a7513e45b56f6524f2d51f2.js"
      */
    File.prototype.digest_path = function() {
      return this.path_with_fingerprint(this.digest());
    };
    /*
      Returns `Array` of extension `String`s.
      
          "foo.js.coffee"
          # => [".js", ".coffee"]
      */
    File.prototype.extensions = function() {
      var _ref;
      return (_ref = this._extensions) != null ? _ref : this._extensions = this.constructor.extensions(this.path);
    };
    /*
      Gets digest fingerprint.
      
          "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
          # => "0aa2105d29558f3eb790d411d7d8fb66"
      */
    File.prototype.path_fingerprint = function() {
      var result;
      result = this.constructor.basename(this.path).match(/-([0-9a-f]{32})\.?/);
      if (result != null) {
        return result[1];
      } else {
        return null;
      }
    };
    /*
      Injects digest fingerprint into path.
      
          "foo.js"
          # => "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
      */
    File.prototype.path_with_fingerprint = function(digest) {
      var old_digest;
      if (old_digest = this.path_fingerprint()) {
        return this.path.replace(old_digest, digest);
      } else {
        return this.path.replace(/\.(\w+)$/, "-" + digest + ".\$1");
      }
    };
    /*
      Returns file contents as its `body`.
      */
    File.prototype.body = function() {
      return this.constructor.read(this.path);
    };
    File.prototype.write = function(to, options) {
      var _ref;
      if ((_ref = options.compress) == null) {
        options.compress = this.constructor.extname(to) === '.gz';
      }
      if (options.compress) {
        fs.readFile(this.path, function(data) {
          return fs.writeFile("" + to + "+", data);
        });
      } else {
        this.constructor.copy(this.path, "" + to + "+");
      }
      FileUtils.mv("" + filename + "+", filename);
      File.utime(mtime, mtime, filename);
      return nil;
    };
    return File;
  })();
  exports = module.exports = File;
}).call(this);
