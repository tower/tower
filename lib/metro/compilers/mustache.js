(function() {
  var Mustache, exports;
  Mustache = (function() {
    function Mustache() {}
    Mustache.prototype.engine = function() {
      return require('mustache');
    };
    Mustache.prototype.compile = function(content, options) {
      return this.engine().to_html(content, options.locals);
    };
    return Mustache;
  })();
  exports = module.exports = Mustache;
}).call(this);
