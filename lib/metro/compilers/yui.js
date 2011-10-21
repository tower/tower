(function() {
  var Yui;
  Yui = (function() {
    function Yui() {}
    Yui.prototype.compress = function(string) {
      return this.compressor()(string);
    };
    Yui.prototype.compressor = function() {
      var _ref;
      return (_ref = this._compressor) != null ? _ref : this._compressor = require("../../../vendor/cssmin").cssmin;
    };
    return Yui;
  })();
  module.exports = Yui;
}).call(this);
