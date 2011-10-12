(function() {
  var Metro;
  Metro = {
    Asset: {
      YUICompressor: require('../lib/asset/yui_compressor').YUICompressor,
      UglifyJSCompressor: require('../lib/asset/uglifyjs_compressor').UglifyJSCompressor
    }
  };
  exports.Metro = Metro;
}).call(this);
