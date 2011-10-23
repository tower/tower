(function() {
  var CoffeeScript, exports;
  CoffeeScript = (function() {
    function CoffeeScript() {}
    CoffeeScript.prototype.engine = function() {
      return require('coffee-script');
    };
    CoffeeScript.prototype.compile = function(content, options, callback) {
      var error, result;
      result = "";
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (options == null) {
        options = {};
      }
      if (!options.hasOwnProperty("bare")) {
        options.bare = true;
      }
      try {
        result = this.engine().compile(content, options);
      } catch (e) {
        error = e;
      }
      if (callback) {
        callback.call(this, error, result);
      }
      return result;
    };
    return CoffeeScript;
  })();
  exports = module.exports = CoffeeScript;
}).call(this);
