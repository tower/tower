var YuiCompressor, exports;
YuiCompressor = function() {};
YuiCompressor.prototype.compress = function(string) {
  return this.compressor()(string);
};
YuiCompressor.prototype.compressor = function() {
  return this._compressor = (typeof this._compressor !== "undefined" && this._compressor !== null) ? this._compressor : require("../../vendor/cssmin").cssmin;
};
exports = (module.exports = YuiCompressor);