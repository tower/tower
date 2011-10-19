(function() {
  var Stylus, exports;
  Stylus = (function() {
    function Stylus() {}
    Stylus.prototype.engine = function() {
      return require('stylus');
    };
    Stylus.prototype.compile = function(content, options) {
      var result;
      if (options == null) {
        options = {};
      }
      result = null;
      this.engine().render(content, options, function(error, data) {
        return result = data;
      });
      return result;
    };
    return Stylus;
  })();
  exports = module.exports = Stylus;
}).call(this);
