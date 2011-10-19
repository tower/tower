(function() {
  var Sass, exports;
  Sass = (function() {
    function Sass() {}
    Sass.prototype.engine = function() {
      return require('sass');
    };
    Sass.prototype.compile = function(content, options) {
      return this.engine().render(content);
    };
    return Sass;
  })();
  exports = module.exports = Sass;
}).call(this);
