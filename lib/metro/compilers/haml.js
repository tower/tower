(function() {
  var Haml, exports;
  Haml = (function() {
    function Haml() {}
    Haml.prototype.engine = function() {
      return require('hamljs');
    };
    Haml.prototype.compile = function(content, options, callback) {
      var data;
      if (typeof options === "function") {
        callback = options;
      }
      data = this.engine().render(content, options || {});
      callback.call(this, null, data);
      return data;
    };
    return Haml;
  })();
  exports = module.exports = Haml;
}).call(this);
