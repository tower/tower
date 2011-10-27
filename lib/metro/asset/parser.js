(function() {
  var Parser, async, file, fs, _;
  file = require("file");
  fs = require('fs');
  _ = require("underscore");
  async = require('async');
  Parser = (function() {
    Parser.HEADER_PATTERN = /^(\/\*\s*(?:(?!\*\/).|\n)*\*\/)|(?:\#\#\#\s*(?:(?!\#\#\#).|\n)*\#\#\#)|(?:\/\/\s*.*\s*?)+|(?:#\s*.*\s*?)/g;
    Parser.DIRECTIVE_PATTERN = /(?:\/\/|#| *)\s*=\s*(require)\s*['"]?([^'"]+)['"]?[\s]*?\n?/;
    function Parser(compressor, options) {
      if (options == null) {
        options = {};
      }
      this._compressor = compressor;
      this.extension = options.extension;
      this.terminator = options.terminator || "";
    }
    Parser.prototype.compressor = function() {
      return this._compressor;
    };
    Parser.prototype.process = function(options) {
      var files, key, path, result, self, string, value, _i, _len, _ref, _ref2, _ref3;
      self = this;
      result = {};
      if (_.isArray(options.files)) {
        options.map = _.inject(options.files, function(hash, file) {
          hash[file.replace(/\.(js|css)$/, "")] = Array(file);
          return hash;
        }, {});
      } else {
        options.map = {};
        _ref = options.files;
        for (key in _ref) {
          value = _ref[key];
          options.map[key.replace(/\.(js|css)$/, "")] = typeof value === "string" ? Array(value) : value;
        }
      }
      _ref2 = options.map;
      for (key in _ref2) {
        files = _ref2[key];
        string = '';
        _ref3 = options.paths;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          path = _ref3[_i];
          file.walkSync(path, function(_path, _directories, _files) {
            var data, item, items, _j, _len2, _results;
            items = _.intersection(files, _files);
            _results = [];
            for (_j = 0, _len2 = items.length; _j < _len2; _j++) {
              item = items[_j];
              data = fs.readFileSync([_path, item].join("/"), 'utf8');
              _results.push(string = string + self.process_directives(data));
            }
            return _results;
          });
        }
        result[key] = self.compressor().compress(string);
      }
      return result;
    };
    Parser.prototype.render = function(string) {
      return this.process_directives(string);
    };
    Parser.prototype.process_directives = function(string, callback) {
      var directive, directive_pattern, directives_string, last, line, lines, self, _i, _len;
      self = this;
      directive_pattern = this.constructor.DIRECTIVE_PATTERN;
      lines = string.match(this.constructor.HEADER_PATTERN);
      directives_string = '';
      if (callback == null) {
        callback = function(path) {
          return fs.readFileSync(path, 'utf8');
        };
      }
      if (lines && lines.length > 0) {
        last = lines[lines.length - 1];
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          directive = line.match(directive_pattern);
          if (directive) {
            directives_string = directives_string + self.process_directives(callback(directive[2])) + self.terminator;
          }
        }
      }
      return directives_string + string + self.terminator;
    };
    Parser.prototype.parse = function(string, path) {
      var directive, directive_pattern, directives_string, last, line, lines, parts, self, _i, _len;
      self = this;
      directive_pattern = this.constructor.DIRECTIVE_PATTERN;
      lines = string.match(this.constructor.HEADER_PATTERN);
      directives_string = '';
      parts = [];
      if (lines && lines.length > 0) {
        last = lines[lines.length - 1];
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          directive = line.match(directive_pattern);
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
    return Parser;
  })();
  module.exports = Parser;
}).call(this);
