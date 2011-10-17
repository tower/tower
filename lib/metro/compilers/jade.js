(function() {
  var Jade, exports, fs, jade;
  jade = require('jade');
  fs = require('fs');
  Jade = (function() {
    function Jade() {}
    Jade.prototype.compile = function(path, options) {
      var callback, result;
      if (typeof options === "function") {
        callback = options;
      }
      result = null;
      if (options == null) {
        options = {};
      }
      jade.render(fs.readFileSync(path, 'utf8'), options, function(error, data) {
        if (error) {
          return result = error.toString();
        } else {
          return result = data;
        }
      });
      return result;
    };
    return Jade;
  })();
  exports = module.exports = Jade;
}).call(this);
