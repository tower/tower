(function() {
  var Environment, exports;
  Environment = (function() {
    function Environment() {}
    Environment.prototype.compress = function(files) {
      var result;
      result = '';
      file.walkSync(path, function(dirPath, dirs, files) {
        var data, file, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          data = fs.readFileSync([dirPath, file].join("/"), 'utf8');
          _results.push(result = result + data + '\n');
        }
        return _results;
      });
      return result;
    };
    Environment.prototype.compressFiles = function(files) {
      var data, file, result, _i, _len;
      result = '';
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        data = fs.readFileSync(file, 'utf8');
        result = result + data + '\n';
      }
      return result;
    };
    return Environment;
  })();
  exports = module.exports = Environment;
}).call(this);
