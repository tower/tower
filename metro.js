(function() {

}).call(this);
(function() {
  var Metro, exports;
  Metro = {
    Asset: {
      YUICompressor: require('../lib/asset/yui_compressor'),
      UglifyJSCompressor: require('../lib/asset/uglifyjs_compressor'),
      CSSProcessor: require('../lib/asset/css_processor'),
      JSProcessor: require('../lib/asset/js_processor'),
      Environment: require('../lib/asset/environment'),
      File: require('../lib/asset/file'),
      BundledFile: require('../lib/asset/bundled_file'),
      Server: require('../lib/asset/server')
    }
  };
  exports = (module.exports = Metro);
}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {
  var Metro, exports;
  Metro = {
    Asset: require('../lib/asset').Asset
  };
  exports = (module.exports = Metro);
}).call(this);
(function() {

}).call(this);
(function() {
  Metro.Presenter = (typeof Metro.Presenter !== "undefined" && Metro.Presenter !== null) ? Metro.Presenter : {};
}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {
  var BundledFile, exports;
  BundledFile = function() {};
  exports = (module.exports = BundledFile);
}).call(this);
(function() {
  var CSSProcessor, exports;
  CSSProcessor = function() {};
  exports = (module.exports = CSSProcessor);
}).call(this);
(function() {
  var Environment, exports;
  Environment = function() {};
  exports = (module.exports = Environment);
}).call(this);
(function() {
  var File, exports;
  File = function() {};
  exports = (module.exports = File);
}).call(this);
(function() {
  Metro.Assets.Helpers = (typeof Metro.Assets.Helpers !== "undefined" && Metro.Assets.Helpers !== null) ? Metro.Assets.Helpers : {};
}).call(this);
(function() {
  var JSProcessor, exports;
  JSProcessor = function() {};
  exports = (module.exports = JSProcessor);
}).call(this);
(function() {
  var Server, exports;
  Server = function() {};
  Server.prototype.call = function(req, res, next) {
    var asset, start_time;
    start_time = new Date();
    return (asset = this.findAsset(req.path));
  };
  Server.prototype.forbiddenRequest = function(req) {
    return false;
  };
  Server.prototype.findAsset = function(path) {};
  exports = (module.exports = function() {
    return function(req, res, next) {
      return new Server.call(req, res, next);
    };
  });
}).call(this);
(function() {
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
}).call(this);
(function() {
  var YUICompressor, exports;
  YUICompressor = function() {};
  YUICompressor.prototype.compress = function(string) {
    return this.compressor()(string);
  };
  YUICompressor.prototype.compressor = function() {
    return this._compressor = (typeof this._compressor !== "undefined" && this._compressor !== null) ? this._compressor : require("../../vendor/cssmin").cssmin;
  };
  exports = (module.exports = YUICompressor);
}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
(function() {

}).call(this);
