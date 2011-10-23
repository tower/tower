(function() {
  var Stylus;
  Stylus = (function() {
    function Stylus() {}
    Stylus.prototype.engine = function() {
      return require('stylus');
    };
    Stylus.prototype.compile = function(content, options, callback) {
      var engine, result, self;
      result = "";
      self = this;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (options == null) {
        options = {};
      }
      engine = this.engine();
      if (options.paths != null) {
        engine = engine.set('paths', options.paths);
      }
      engine.render(content, options, function(error, data) {
        result = data;
        if (callback) {
          return callback.call(self, error, result);
        }
      });
      return result;
    };
    return Stylus;
  })();
  module.exports = Stylus;
}).call(this);
