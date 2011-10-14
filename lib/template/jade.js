(function() {
  var Jade, exports, fs, jade;
  jade = require('jade');
  fs = require('fs');
  Jade = (function() {
    function Jade() {}
    Jade.prototype.compile = function(path, options, callback) {
      if (typeof options === "function") {
        callback = options;
      }
      return jade.render(fs.readFileSync(path, 'utf8'), options || {}, callback);
    };
    return Jade;
  })();
  exports = module.exports = Jade;
}).call(this);
