(function() {
  var Jade, exports;
  Jade = (function() {
    function Jade() {}
    Jade.prototype.engine = function() {
      return require('jade');
    };
    Jade.prototype.compile = function(content, options) {
      var callback, result;
      if (typeof options === "function") {
        callback = options;
      }
      result = null;
      if (options == null) {
        options = {};
      }
      this.engine().render(content, options, function(error, data) {
        if (error) {
          return result = error.toString();
        } else {
          return result = data;
        }
      });
      return result;
    };
    return Jade;
  })();
  exports = module.exports = Jade;
}).call(this);
