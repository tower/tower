(function() {
  var CoffeeScript, exports;
  CoffeeScript = (function() {
    function CoffeeScript() {}
    CoffeeScript.prototype.engine = function() {
      return require('coffee-script');
    };
    CoffeeScript.prototype.compile = function(content, options) {
      if (options == null) {
        options = {};
      }
      if (options.bare === void 0) {
        options.bare = true;
      }
      return this.engine().compile(content, options);
    };
    return CoffeeScript;
  })();
  exports = module.exports = CoffeeScript;
}).call(this);
