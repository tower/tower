var Digest;
Digest = (function() {
  function Digest() {}
  Digest.include(Metro.Support.Concern);
  Digest.digestPath = function(path) {
    return this.pathWithFingerprint(path, this.digest(path));
  };
  Digest.pathFingerprint = function(path) {
    var result;
    result = Metro.Support.Path.basename(path).match(/-([0-9a-f]{32})\.?/);
    if (result != null) {
      return result[1];
    } else {
      return null;
    }
  };
  Digest.pathWithFingerprint = function(path, digest) {
    var oldDigest;
    if (oldDigest = this.pathFingerprint(path)) {
      return path.replace(oldDigest, digest);
    } else {
      return path.replace(/\.(\w+)$/, "-" + digest + ".\$1");
    }
  };
  Digest.prototype.digestPath = function() {
    return this.constructor.digestPath(this.path);
  };
  Digest.prototype.pathFingerprint = function() {
    return this.constructor.pathFingerprint(this.path);
  };
  Digest.prototype.pathWithFingerprint = function(digest) {
    return this.constructor.pathWithFingerprint(this.path, digest);
  };
  return Digest;
})();
module.exports = Digest;