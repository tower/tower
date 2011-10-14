(function() {
  var Ejs, ejs, exports, fs;
  ejs = require('ejs');
  fs = require('fs');
  Ejs = (function() {
    function Ejs() {}
    Ejs.prototype.compile = function(path, options, callback) {
      var data;
      if (typeof options === "function") {
        callback = options;
      }
      data = ejs.render(fs.readFileSync(path, 'utf8'), options || {});
      callback.call(this, null, data);
      return data;
    };
    return Ejs;
  })();
  exports = module.exports = Ejs;
}).call(this);
