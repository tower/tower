(function() {
  var File, exports;
  File = (function() {
    function File(environment, logical_path, pathname) {
      this.environment = environment;
      this.logical_path = logical_path.to_s;
      this.pathname = Pathname["new"](pathname);
      this.id = this.environment.digest.update(object_id.to_s).to_s;
    }
    /*
      Returns `Content-Type` from pathname.
      */
    File.prototype.content_type = function() {
      var _ref;
      return (_ref = this._content_type) != null ? _ref : this._content_type = this.environment.content_type_of(this.pathname);
    };
    /*
      Get mtime at the time the `Asset` is built.
      */
    File.prototype.mtime = function() {
      var _ref;
      return (_ref = this._mtime) != null ? _ref : this._mtime = this.environment.stat(this.pathname).mtime;
    };
    /*
      Get length at the time the `Asset` is built.
      */
    File.prototype.length = function() {
      var _ref;
      return (_ref = this._length) != null ? _ref : this._length = this.environment.stat(this.pathname).size;
    };
    /*
      Get content digest at the time the `Asset` is built.
      */
    File.prototype.digest = function() {
      var _ref;
      return (_ref = this._digest) != null ? _ref : this._digest = this.environment.file_digest(this.pathname).hexdigest;
    };
    /*
      Return logical path with digest spliced in.
      
        "foo/bar-37b51d194a7513e45b56f6524f2d51f2.js"
      */
    File.prototype.digest_path = function() {
      return this.environment.attributes_for(this.logical_path()).path_with_fingerprint(this.digest());
    };
    /*
      Returns `Array` of extension `String`s.
      
          "foo.js.coffee"
          # => [".js", ".coffee"]
      */
    File.prototype.extensions = function() {
      var _ref;
      return (_ref = this._extensions) != null ? _ref : this._extensions = this.pathname.basename.to_s.scan(/\.[^.]+/);
    };
    /*
      Gets digest fingerprint.
      
          "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
          # => "0aa2105d29558f3eb790d411d7d8fb66"
      */
    File.prototype.path_fingerprint = function() {
      var _ref;
      return this.pathname.basename(extensions.join).to_s = (_ref = ~/-([0-9a-f]{7,40})$/) != null ? _ref : {
        $1: null
      };
    };
    /*
      Injects digest fingerprint into path.
      
          "foo.js"
          # => "foo-0aa2105d29558f3eb790d411d7d8fb66.js"
      */
    File.prototype.path_with_fingerprint = function(digest) {
      var old_digest;
      if (old_digest = this.path_fingerprint()) {
        return this.pathname.sub(old_digest, digest).to_s;
      } else {
        return this;
      }
    };
    return File;
  })();
  exports = module.exports = File;
}).call(this);
