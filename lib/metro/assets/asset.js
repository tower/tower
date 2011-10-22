(function() {
  var Asset, async, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  _ = require('underscore');
  async = require('async');
  Asset = (function() {
    __extends(Asset, require("../support/path"));
    Asset.digest_path = function(path) {
      return this.path_with_fingerprint(path, this.digest(path));
    };
    Asset.path_fingerprint = function(path) {
      var result;
      result = Metro.Support.Path.basename(path).match(/-([0-9a-f]{32})\.?/);
      if (result != null) {
        return result[1];
      } else {
        return null;
      }
    };
    Asset.path_with_fingerprint = function(path, digest) {
      var old_digest;
      if (old_digest = this.path_fingerprint(path)) {
        return path.replace(old_digest, digest);
      } else {
        return path.replace(/\.(\w+)$/, "-" + digest + ".\$1");
      }
    };
    function Asset(path, extension) {
      this.path = Metro.Support.Path.expand_path(path);
      this.extension = extension || this.extensions()[0];
    }
    Asset.prototype.digest_path = function() {
      return this.constructor.digest_path(this.path);
    };
    Asset.prototype.path_fingerprint = function() {
      return this.constructor.path_fingerprint(this.path);
    };
    Asset.prototype.path_with_fingerprint = function(digest) {
      return this.constructor.path_with_fingerprint(this.path, digest);
    };
    Asset.prototype.write = function(to, options) {
      var _ref;
      if ((_ref = options.compress) == null) {
        options.compress = Metro.Support.Path.extname(to) === '.gz';
      }
      if (options.compress) {
        fs.readFile(this.path, function(data) {
          return fs.writeFile("" + to + "+", data);
        });
      } else {
        Metro.Support.Path.copy(this.path, "" + to + "+");
      }
      FileUtils.mv("" + filename + "+", filename);
      Metro.Support.Path.utime(mtime, mtime, filename);
      return nil;
    };
    Asset.prototype.render = function(options, callback) {
      var parts;
      parts = Metro.Assets.processor_for(this.extension.slice(1)).parse(this.read());
      return this.render_parts(parts, options, callback);
    };
    Asset.prototype.render_parts = function(parts, options, result, callback) {
      var child, extension, part, self, terminator;
      if (result == null) {
        result = "";
      }
      if (parts.length > 0) {
        extension = this.extension;
        terminator = ";";
        self = this;
        part = parts.shift();
        if (part.hasOwnProperty("content")) {
          return this.compile(part.content, options, function(data) {
            return render_parts.apply(self, _.extend({}, options), data + terminator);
          });
        } else {
          child = Metro.Application.instance().assets().find(part.path, {
            extension: extension
          });
          if (child) {
            return child.render(options, function(data) {
              return callback.apply(self, data + terminator);
            });
          } else {
            console.log("Dependency '" + part.path + "' not found in " + self.path);
            return callback.apply(self, "");
          }
        }
      } else {
        return callback.apply(self, "");
      }
    };
    Asset.prototype.compile = function(data, options) {
      var compiler, compilers, _i, _len;
      if (options == null) {
        options = {};
      }
      compilers = this.compilers();
      for (_i = 0, _len = compilers.length; _i < _len; _i++) {
        compiler = compilers[_i];
        data = compiler.compile(data, _.extend({}, options));
      }
      return data;
    };
    Asset.prototype.compilers = function() {
      var compiler, extension, extensions, result, _i, _len;
      if (!this._compilers) {
        extensions = this.extensions();
        result = [];
        for (_i = 0, _len = extensions.length; _i < _len; _i++) {
          extension = extensions[_i];
          compiler = Metro.Compilers.find(extension.slice(1));
          if (compiler) {
            result.push(compiler);
          }
        }
        this._compilers = result;
      }
      return this._compilers;
    };
    Asset.prototype.body = function() {
      return this.render();
    };
    return Asset;
  })();
  module.exports = Asset;
}).call(this);
