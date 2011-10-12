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
