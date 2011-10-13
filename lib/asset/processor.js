(function() {
  var Processor, exports, file, fs, _;
  file = require("file");
  fs = require('fs');
  _ = require("underscore");
  Processor = (function() {
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
          hash[file.replace(/\.(js|css)$/, "")] = file;
          return hash;
        }, {});
      } else {
        options.map = {};
        files = [];
        _ref = options.files;
        for (key in _ref) {
          value = _ref[key];
          options.map[key.replace(/\.(js|css)$/, "")] = value;
          files = files.concat(value);
        }
        options.files = files;
      }
      console.log(options);
      _ref2 = options.map;
      for (key in _ref2) {
        files = _ref2[key];
        string = '';
        _ref3 = options.paths;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          path = _ref3[_i];
          file.walkSync(path, function(_path, _directories, _files) {
            var item, items, _j, _len2, _results;
            items = _.intersection(options.files, _files);
            _results = [];
            for (_j = 0, _len2 = items.length; _j < _len2; _j++) {
              item = items[_j];
              _results.push(string = string + self.compressor().compress(fs.readFileSync([_path, item].join("/"), 'utf8')) + ";");
            }
            return _results;
          });
        }
        result[key] = string;
      }
      return result;
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
  exports = module.exports = Processor;
}).call(this);
