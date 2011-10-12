Metro =
  Asset:
    YUICompressor:      require('../lib/asset/yui_compressor').YUICompressor
    UglifyJSCompressor: require('../lib/asset/uglifyjs_compressor').UglifyJSCompressor
    CSSProcessor:       require('../lib/asset/css_processor').CSSProcessor
    JSProcessor:        require('../lib/asset/js_processor').JSProcessor
    Environment:        require('../lib/asset/environment').Environment
    File:               require('../lib/asset/file').File
    BundledFile:        require('../lib/asset/bundled_file').BundledFile
    Server:             require('../lib/asset/server').Server
  
exports.Metro = Metro
