(function() {
  var Locale, exports;
  Locale = (function() {
    function Locale() {}
    Locale.namespaces = {};
    Locale.localize = function(key) {
      return this.namespaces[key] || key;
    };
    return Locale;
  })();
  exports = module.exports = Locale;
  Metro.localize = Locale.localize;
}).call(this);
