(function() {
  var Helpers;
  Helpers = (function() {
    function Helpers() {}
    ["form", "table"].each(function() {
      var klass;
      klass = "Metro.Components." + (this.toUpperCase());
      return this.prototype["" + this + "_for"] = function() {
        var _ref;
        return (_ref = global[klass])["new"].apply(_ref, arguments).render();
      };
    });
    return Helpers;
  })();
}).call(this);
