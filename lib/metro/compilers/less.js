(function() {
  var Less, exports;
  Less = (function() {
    function Less() {}
    Less.prototype.engine = function() {
      return require('less');
    };
    Less.prototype.compile = function(content) {
      var result;
      result = null;
      this.engine().render(content, function(error, data) {
        return result = data;
      });
      return result;
    };
    return Less;
  })();
  exports = module.exports = Less;
}).call(this);
