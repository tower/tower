(function() {
  var Less, exports;
  Less = (function() {
    function Less() {}
    Less.prototype.engine = function() {
      return require('less');
    };
    Less.prototype.compile = function(content, options, callback) {
      var engine, parser, result, self;
      result = "";
      self = this;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (options == null) {
        options = {};
      }
      engine = this.engine();
      parser = new engine.Parser(options);
      parser.parse(content, function(error, tree) {
        result = tree.toCSS();
        if (callback) {
          return callback.call(self, error, result);
        }
      });
      return result;
    };
    return Less;
  })();
  exports = module.exports = Less;
}).call(this);
