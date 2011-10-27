(function() {
  var Digest;
  Digest = (function() {
    function Digest() {}
    Digest.include(Metro.Support.Concern);
    Digest.digest_path = function(path) {
      return this.path_with_fingerprint(path, this.digest(path));
    };
    Digest.path_fingerprint = function(path) {
      var result;
      result = Metro.Support.Path.basename(path).match(/-([0-9a-f]{32})\.?/);
      if (result != null) {
        return result[1];
      } else {
        return null;
      }
    };
    Digest.path_with_fingerprint = function(path, digest) {
      var old_digest;
      if (old_digest = this.path_fingerprint(path)) {
        return path.replace(old_digest, digest);
      } else {
        return path.replace(/\.(\w+)$/, "-" + digest + ".\$1");
      }
    };
    Digest.prototype.digest_path = function() {
      return this.constructor.digest_path(this.path);
    };
    Digest.prototype.path_fingerprint = function() {
      return this.constructor.path_fingerprint(this.path);
    };
    Digest.prototype.path_with_fingerprint = function(digest) {
      return this.constructor.path_with_fingerprint(this.path, digest);
    };
    return Digest;
  })();
  module.exports = Digest;
}).call(this);
