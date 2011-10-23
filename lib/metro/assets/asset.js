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
    Asset.prototype.paths = function(options, callback) {
      var self;
      self = this;
      return this.parts(options, function(parts) {
        var part, paths, _i, _len;
        paths = [];
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          paths.push(part.path);
        }
        return callback.call(self, paths);
      });
    };
    Asset.prototype.parts = function(options, callback) {
      var data, extension, require_directives, self;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (options == null) {
        options = {};
      }
      self = this;
      extension = this.extension;
      require_directives = options.hasOwnProperty("require") ? options.require : true;
      data = this.read();
      if (require_directives) {
        return callback.call(self, Metro.Assets.processor_for(extension.slice(1)).parse(data, self.path));
      } else {
        return callback.call(self, [
          {
            content: data,
            path: self.path
          }
        ]);
      }
    };
    Asset.prototype.parse = function(options, callback) {
      var extension, result, self, terminator;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (options == null) {
        options = {};
      }
      if (!callback) {
        Metro.raise("errors.missing_callback", "Asset#render");
      }
      self = this;
      extension = this.extension;
      result = [];
      terminator = "\n";
      return this.parts(function(options, parts) {
        var iterate;
        iterate = function(part, next) {
          var child;
          if (part.hasOwnProperty("content")) {
            return self.compile(part.content, _.extend({}, options), function(data) {
              part.content = data;
              result.push(part);
              return next();
            });
          } else {
            child = Metro.Application.instance().assets().find(part.path, {
              extension: extension
            });
            if (child) {
              return child.render(_.extend({}, options), function(data) {
                part.content = data;
                result.push(part);
                return next();
              });
            } else {
              console.log("Dependency '" + part.path + "' not found in " + self.path);
              return next();
            }
          }
        };
        return async.forEachSeries(parts, iterate, function() {
          return callback.call(self, result);
        });
      });
    };
    Asset.prototype.render = function(options, callback) {
      var result, self, terminator;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (options == null) {
        options = {};
      }
      result = "";
      terminator = "\n";
      self = this;
      return this.parse(options, function(parts) {
        var part, _i, _len;
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          result += part.content;
        }
        result += terminator;
        return callback.call(self, result);
      });
    };
    Asset.prototype.compile = function(data, options, callback) {
      var iterate, self;
      if (options == null) {
        options = {};
      }
      self = this;
      iterate = function(compiler, next) {
        return compiler.compile(data, _.extend({}, options), function(error, result) {
          data = result;
          return next();
        });
      };
      return async.forEachSeries(this.compilers(), iterate, function() {
        return callback.call(self, data);
      });
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
    return Asset;
  })();
  module.exports = Asset;
}).call(this);
