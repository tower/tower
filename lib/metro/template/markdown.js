(function() {
  var Markdown, exports, fs, markdown;
  markdown = require('markdown');
  fs = require('fs');
  Markdown = (function() {
    function Markdown() {}
    Markdown.prototype.compile = function(path, options) {
      return markdown.parse(fs.readFileSync(path, 'utf8'));
    };
    return Markdown;
  })();
  exports = module.exports = Markdown;
}).call(this);
