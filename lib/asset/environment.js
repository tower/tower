var Environment, exports;
Environment = function() {};
Environment.prototype.compress = function(files) {
  var result;
  result = '';
  file.walkSync(path, function(dirPath, dirs, files) {
    var _i, _len, _ref, _result, data, file;
    _result = []; _ref = files;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      file = _ref[_i];
      _result.push((function() {
        data = fs.readFileSync([dirPath, file].join("/"), 'utf8');
        return (result = result + data + '\n');
      })());
    }
    return _result;
  });
  return result;
};
Environment.prototype.compressFiles = function(files) {
  var _i, _len, _ref, data, file, result;
  result = '';
  _ref = files;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    file = _ref[_i];
    data = fs.readFileSync(file, 'utf8');
    result = result + data + '\n';
  }
  return result;
};
exports = (module.exports = Environment);