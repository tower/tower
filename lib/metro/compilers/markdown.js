(function() {
  var Markdown, exports;
  Markdown = (function() {
    function Markdown() {}
    Markdown.prototype.engine = function() {
      return require('markdown');
    };
    Markdown.prototype.compile = function(content, options) {
      return this.engine().parse(content);
    };
    return Markdown;
  })();
  exports = module.exports = Markdown;
}).call(this);
