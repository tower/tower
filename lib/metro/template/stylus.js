(function() {
  var Stylus, exports, fs, stylus;
  stylus = require('stylus');
  fs = require('fs');
  Stylus = (function() {
    function Stylus() {}
    Stylus.prototype.compile = function(path) {
      var result;
      result = null;
      stylus.render(fs.readFileSync(path, 'utf8'), {}, function(error, data) {
        return result = data;
      });
      return result;
    };
    return Stylus;
  })();
  exports = module.exports = Stylus;
}).call(this);
