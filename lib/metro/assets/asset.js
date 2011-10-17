(function() {
  var Asset;
  Asset = (function() {
    function Asset(environment, path) {
      this.environment = environment;
      this.path = Metro.Support.File.expand_path(path);
    }
    Asset.prototype.stat = function() {
      return Metro.Support.File.stat(this.path);
    };
    Asset.prototype.content_type = function() {
      var _ref;
      return (_ref = this._content_type) != null ? _ref : this._content_type = Metro.Support.File.content_type(this.path);
    };
    Asset.prototype.mtime = function() {
      var _ref;
      return (_ref = this._mtime) != null ? _ref : this._mtime = Metro.Support.File.stat(this.path).mtime;
    };
    Asset.prototype.size = function() {
      var _ref;
      return (_ref = this._size) != null ? _ref : this._size = Metro.Support.File.stat(this.path).size;
    };
    Asset.prototype.digest = function() {
      var _ref;
      return (_ref = this._digest) != null ? _ref : this._digest = Metro.Support.File.digest(this.path);
    };
    Asset.prototype.digest_path = function() {
      return this.path_with_fingerprint(this.digest());
    };
    Asset.prototype.extensions = function() {
      var _ref;
      return (_ref = this._extensions) != null ? _ref : this._extensions = Metro.Support.File.extensions(this.path);
    };
    Asset.prototype.path_fingerprint = function() {
      var result;
      result = Metro.Support.File.basename(this.path).match(/-([0-9a-f]{32})\.?/);
      if (result != null) {
        return result[1];
      } else {
        return null;
      }
    };
    Asset.prototype.path_with_fingerprint = function(digest) {
      var old_digest;
      if (old_digest = this.path_fingerprint()) {
        return this.path.replace(old_digest, digest);
      } else {
        return this.path.replace(/\.(\w+)$/, "-" + digest + ".\$1");
      }
    };
    Asset.prototype.body = function() {
      return Metro.Support.File.read(this.path);
    };
    Asset.prototype.write = function(to, options) {
      var _ref;
      if ((_ref = options.compress) == null) {
        options.compress = Metro.Support.File.extname(to) === '.gz';
      }
      if (options.compress) {
        fs.readFile(this.path, function(data) {
          return fs.writeFile("" + to + "+", data);
        });
      } else {
        Metro.Support.File.copy(this.path, "" + to + "+");
      }
      FileUtils.mv("" + filename + "+", filename);
      Metro.Support.File.utime(mtime, mtime, filename);
      return nil;
    };
    return Asset;
  })();
  module.exports = Asset;
}).call(this);
