(function() {
  var Processor, file, fs, _;
  file = require("file");
  fs = require('fs');
  _ = require("underscore");
  Processor = (function() {
    Processor.HEADER_PATTERN = /^(\/\*\s*(?:(?!\*\/).|\n)*\*\/)|(?:\#\#\#\s*(?:(?!\#\#\#).|\n)*\#\#\#)|(?:\/\/\s*.*\s*?)+|(?:#\s*.*\s*?)/g;
    Processor.DIRECTIVE_PATTERN = /(?:\/\/|#| *)\s*=\s*(require)\s*['"]?(.+)['"]?[\s]*?\n?/;
    function Processor(compressor) {
      this._compressor = compressor;
    }
    Processor.prototype.compressor = function() {
      return this._compressor;
    };
    Processor.prototype.process = function(options) {
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
    Processor.prototype.process_directives = function(string) {
      var directive, directive_pattern, directives_string, last, line, lines, self, _i, _len;
      self = this;
      directive_pattern = this.constructor.DIRECTIVE_PATTERN;
      lines = string.match(this.constructor.HEADER_PATTERN);
      directives_string = '';
      if (lines && lines.length > 0) {
        last = lines[lines.length - 1];
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          directive = line.match(directive_pattern);
          if (directive) {
            directives_string = directives_string + self.process_directives(fs.readFileSync(directive[2], 'utf8')) + ';';
          }
        }
      }
      return directives_string + string + ";";
    };
    Processor.prototype.compile = function(options) {
      var data, dir, ext, key, name, string, _results;
      dir = options.path;
      if (dir == null) {
        throw new Error("You must pass in a directory as 'path'");
      }
      data = this.process(options);
      ext = "." + this.extension;
      _results = [];
      for (key in data) {
        string = data[key];
        name = [dir, key].join("/") + ext;
        _results.push(fs.writeFileSync(name, string));
      }
      return _results;
    };
    return Processor;
  })();
  module.exports = Processor;
}).call(this);
