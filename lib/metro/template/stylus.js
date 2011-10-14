(function() {
  var Stylus, exports, fs, stylus;
  stylus = require('stylus');
  fs = require('fs');
  Stylus = (function() {
    function Stylus() {}
    Stylus.prototype.compile = function(path, callback) {
      return stylus(fs.readFileSync(path, 'utf8')).set('filename', path).render(callback);
    };
    return Stylus;
  })();
  exports = module.exports = Stylus;
}).call(this);
