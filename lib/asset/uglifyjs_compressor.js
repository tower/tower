var UglifyJSCompressor, exports;
UglifyJSCompressor = function() {};
UglifyJSCompressor.prototype.compress = function(string) {
  var ast;
  ast = this.parser().parse(string);
  ast = this.compressor().ast_mangle(ast);
  ast = this.compressor().ast_squeeze(ast);
  return this.compressor().gen_code(ast);
};
UglifyJSCompressor.prototype.compressor = function() {
  return this._compressor = (typeof this._compressor !== "undefined" && this._compressor !== null) ? this._compressor : require("uglify-js").uglify;
};
UglifyJSCompressor.prototype.parser = function() {
  this._parser = (typeof this._parser !== "undefined" && this._parser !== null) ? this._parser : require("uglify-js").parser;
  return this._parser;
};
exports = (module.exports = UglifyJSCompressor);