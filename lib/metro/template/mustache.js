(function() {
  var Mustache, exports, fs, mustache;
  mustache = require('mustache');
  fs = require('fs');
  Mustache = (function() {
    function Mustache() {}
    Mustache.prototype.compile = function(path, options) {
      return mustache.to_html(fs.readFileSync(path, 'utf8'), options.locals);
    };
    return Mustache;
  })();
  exports = module.exports = Mustache;
}).call(this);
