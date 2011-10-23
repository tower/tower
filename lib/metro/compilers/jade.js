(function() {
  var Jade, exports;
  Jade = (function() {
    function Jade() {}
    Jade.prototype.engine = function() {
      return require('jade');
    };
    Jade.prototype.compile = function(content, options, callback) {
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
      this.engine().render(content, options, function(error, data) {
        result = data;
        if (callback) {
          return callback.call(self, error, result);
        }
      });
      return result;
    };
    return Jade;
  })();
  exports = module.exports = Jade;
}).call(this);
