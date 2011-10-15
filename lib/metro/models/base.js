(function() {
  var Base, exports;
  Base = (function() {
    function Base() {}
    Base.key = function(name, options) {
      return this.keys[name] = options;
    };
    Base.keys = {};
    return Base;
  })();
  exports = module.exports = Base;
}).call(this);
