(function() {
  var Less, exports;
  Less = (function() {
    function Less() {}
    Less.prototype.engine = function() {
      return require('less');
    };
    Less.prototype.compile = function(content, options) {
      var engine, parser, result;
      if (options == null) {
        options = {};
      }
      result = null;
      engine = this.engine();
      parser = new engine.Parser(options);
      parser.parse(content, function(error, tree) {
        return result = tree.toCSS();
      });
      return result;
    };
    return Less;
  })();
  exports = module.exports = Less;
}).call(this);
