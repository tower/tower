(function() {
  var Sass, exports, fs, sass;
  sass = require('sass');
  fs = require('fs');
  Sass = (function() {
    function Sass() {}
    Sass.prototype.compile = function(path, options) {
      return sass.render(fs.readFileSync(path, 'utf8'));
    };
    return Sass;
  })();
  exports = module.exports = Sass;
}).call(this);
