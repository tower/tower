var Compiler, async, _;
async = require('async');
_ = require('underscore');
Compiler = (function() {
  function Compiler() {}
  Compiler.HEADER_PATTERN = /^(\/\*\s*(?:(?!\*\/).|\n)*\*\/)|(?:\#\#\#\s*(?:(?!\#\#\#).|\n)*\#\#\#)|(?:\/\/\s*.*\s*?)+|(?:#\s*.*\s*?)/g;
  Compiler.DIRECTIVE_PATTERN = /(?:\/\/|#| *)\s*=\s*(require)\s*['"]?([^'"]+)['"]?[\s]*?\n?/;
  Compiler.prototype.render = function(options, callback) {
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
  Compiler.prototype.parse = function(options, callback) {
    var extension, result, self, terminator;
    if (!(callback && typeof callback === "function")) {
      Metro.raise("errors.missingCallback", "Asset#parse");
    }
    self = this;
    extension = this.extension;
    result = [];
    terminator = "\n";
    return this.parts(options, function(parts) {
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
          child = Metro.Asset.find(part.path, {
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
  Compiler.prototype.parts = function(options, callback) {
    var data, extension, requireDirectives, self;
    if (!this.path) {
      Metro.raise("errors.missingOption", "path", "Asset#parse");
    }
    self = this;
    extension = this.extension;
    requireDirectives = options.hasOwnProperty("require") ? options.require : true;
    data = this.read();
    if (requireDirectives) {
      return callback.call(self, self.parseDirectives(data, self.path));
    } else {
      return callback.call(self, [
        {
          content: data,
          path: self.path
        }
      ]);
    }
  };
  Compiler.prototype.parseDirectives = function(string, path) {
    var directive, directivePattern, directivesString, last, line, lines, parts, self, _i, _len;
    self = this;
    directivePattern = this.constructor.DIRECTIVE_PATTERN;
    lines = string.match(this.constructor.HEADER_PATTERN);
    directivesString = '';
    parts = [];
    if (lines && lines.length > 0) {
      last = lines[lines.length - 1];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        directive = line.match(directivePattern);
        if (directive) {
          parts.push({
            path: directive[2]
          });
        }
      }
    }
    parts.push({
      path: path,
      content: string
    });
    return parts;
  };
  Compiler.prototype.compile = function(data, options, callback) {
    var iterate, self;
    if (options == null) {
      options = {};
    }
    self = this;
    iterate = function(engine, next) {
      return engine.render(data, _.extend({}, options), function(error, result) {
        data = result;
        return next();
      });
    };
    return async.forEachSeries(this.engines(), iterate, function() {
      return callback.call(self, data);
    });
  };
  Compiler.prototype.paths = function(options, callback) {
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
  Compiler.prototype.engines = function() {
    var engine, extension, extensions, result, _i, _len;
    if (!this._engines) {
      extensions = this.extensions();
      result = [];
      for (_i = 0, _len = extensions.length; _i < _len; _i++) {
        extension = extensions[_i];
        engine = Metro.engine(extension.slice(1));
        if (engine) {
          result.push(engine);
        }
      }
      this._engines = result;
    }
    return this._engines;
  };
  return Compiler;
})();
module.exports = Compiler;