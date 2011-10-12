var YUICompressor, exports;
YUICompressor = function() {};
YUICompressor.prototype.compress = function(string) {
  return this.compressor()(string);
};
YUICompressor.prototype.compressor = function() {
  return this._compressor = (typeof this._compressor !== "undefined" && this._compressor !== null) ? this._compressor : require("../../vendor/cssmin").cssmin;
};
exports = (module.exports = YUICompressor);