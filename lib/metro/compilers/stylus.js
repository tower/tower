(function() {
  var Stylus;
  Stylus = (function() {
    function Stylus() {}
    Stylus.prototype.engine = function() {
      return require('stylus');
    };
    Stylus.prototype.compile = function(content, options) {
      var engine, result;
      if (options == null) {
        options = {};
      }
      result = null;
      engine = this.engine();
      if (options.paths != null) {
        engine = engine.set('paths', options.paths);
      }
      engine.render(content, options, function(error, data) {
        return result = data;
      });
      return result;
    };
    return Stylus;
  })();
  module.exports = Stylus;
}).call(this);
