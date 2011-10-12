var Processor, _, exports, file, fs;
var __hasProp = Object.prototype.hasOwnProperty;
file = require("file");
fs = require('fs');
_ = require("underscore");
Processor = function(compressor) {
  this._compressor = compressor;
  return this;
};
Processor.prototype.compressor = function() {
  return this._compressor;
};
Processor.prototype.process = function(options) {
  var _i, _ref, files, key, result, self;
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
      if (!__hasProp.call(_ref, key)) continue;
      _i = _ref[key];
      options.map[key.replace(/\.(js|css)$/, "")] = options.files[key];
    }
    options.files = files;
  }
  _ref = options.map;
  for (_i in _ref) {
    if (!__hasProp.call(_ref, _i)) continue;
    (function() {
      var _j, _len, _ref2, string;
      var key = _i;
      var files = _ref[_i];
      string = '';
      _ref2 = options.paths;
      for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
        (function() {
          var path = _ref2[_j];
          return file.walkSync(path, function(_path, _directories, _files) {
            var _k, _len2, _ref3, _result, item, items;
            items = _.intersection(options.files, _files);
            _result = []; _ref3 = items;
            for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
              item = _ref3[_k];
              _result.push(string = string + self.compressor().compress(fs.readFileSync([_path, item].join("/"), 'utf8')));
            }
            return _result;
          });
        })();
      }
      return (result[key] = string);
    })();
  }
  return result;
};
Processor.prototype.compile = function(options) {
  var _ref, _result, data, dir, ext, key, name, string;
  dir = options.path;
  if (!(typeof dir !== "undefined" && dir !== null)) {
    throw new Error("You must pass in a directory as 'path'");
  }
  data = this.process(options);
  ext = "." + this.extension;
  _result = []; _ref = data;
  for (key in _ref) {
    if (!__hasProp.call(_ref, key)) continue;
    string = _ref[key];
    _result.push((function() {
      name = [dir, key].join("/") + ext;
      return fs.writeFileSync(name, string);
    })());
  }
  return _result;
};
exports = (module.exports = Processor);