(function() {
  var UglifierCompressor;
  UglifierCompressor = (function() {
    function UglifierCompressor() {}
    UglifierCompressor.prototype.compress = function(string) {
      var ast;
      ast = this.parser().parse(string);
      ast = this.compressor().ast_mangle(ast);
      ast = this.compressor().ast_squeeze(ast);
      return this.compressor().gen_code(ast);
    };
    UglifierCompressor.prototype.compressor = function() {
      var _ref;
      return (_ref = this._compressor) != null ? _ref : this._compressor = require("uglify-js").uglify;
    };
    UglifierCompressor.prototype.parser = function() {
      var _ref;
      if ((_ref = this._parser) == null) {
        this._parser = require("uglify-js").parser;
      }
      return this._parser;
    };
    return UglifierCompressor;
  })();
  module.exports = UglifierCompressor;
}).call(this);
