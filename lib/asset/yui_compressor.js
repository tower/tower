(function() {
  var YuiCompressor, exports;
  YuiCompressor = (function() {
    function YuiCompressor() {}
    YuiCompressor.prototype.compress = function(string) {
      return this.compressor()(string);
    };
    YuiCompressor.prototype.compressor = function() {
      var _ref;
      return (_ref = this._compressor) != null ? _ref : this._compressor = require("../../vendor/cssmin").cssmin;
    };
    return YuiCompressor;
  })();
  exports = module.exports = YuiCompressor;
}).call(this);
