(function() {
  var CoffeeScript, coffee, exports, fs;
  coffee = require('coffee-script');
  fs = require('fs');
  CoffeeScript = (function() {
    function CoffeeScript() {}
    CoffeeScript.prototype.compile = function(path, options) {
      if (options == null) {
        options = {};
      }
      if (options.bare === void 0) {
        options.bare = true;
      }
      return coffee.compile(fs.readFileSync(path, 'utf8'), options);
    };
    return CoffeeScript;
  })();
  exports = module.exports = CoffeeScript;
}).call(this);
