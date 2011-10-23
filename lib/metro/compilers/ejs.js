(function() {
  var Ejs, exports;
  Ejs = (function() {
    function Ejs() {}
    Ejs.prototype.engine = function() {
      return require('ejs');
    };
    Ejs.prototype.compile = function(content, options, callback) {
      var result, self;
      self = this;
      result = "";
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (options == null) {
        options = {};
      }
      result = this.engine().render(content, options);
      if (callback) {
        callback.call(self, null, result);
      }
      return result;
    };
    return Ejs;
  })();
  exports = module.exports = Ejs;
}).call(this);
