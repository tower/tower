(function() {
  var Less, exports, fs, less;
  less = require('less');
  fs = require('fs');
  Less = (function() {
    function Less() {}
    Less.prototype.compile = function(path) {
      var result;
      result = null;
      less.render(fs.readFileSync(path, 'utf8'), function(error, data) {
        return result = data;
      });
      return result;
    };
    return Less;
  })();
  exports = module.exports = Less;
}).call(this);
