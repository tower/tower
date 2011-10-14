(function() {
  var Haml, exports, fs, haml;
  haml = require('hamljs');
  fs = require('fs');
  Haml = (function() {
    function Haml() {}
    Haml.prototype.compile = function(path, options, callback) {
      var data;
      if (typeof options === "function") {
        callback = options;
      }
      data = haml.render(fs.readFileSync(path, 'utf8'), options || {});
      callback.call(this, null, data);
      return data;
    };
    return Haml;
  })();
  exports = module.exports = Haml;
}).call(this);
