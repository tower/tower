(function() {
  var Ejs, exports;
  Ejs = (function() {
    function Ejs() {}
    Ejs.prototype.engine = function() {
      return require('ejs');
    };
    Ejs.prototype.compile = function(content, options, callback) {
      var data;
      if (options == null) {
        options = {};
      }
      if (typeof options === "function") {
        callback = options;
      }
      data = this.engine().render(content, options);
      callback.call(this, null, data);
      return data;
    };
    return Ejs;
  })();
  exports = module.exports = Ejs;
}).call(this);
