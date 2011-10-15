fs     = require('fs')
_      = require("underscore")
_.mixin(require("underscore.string"))

Asset =
  YuiCompressor:      require('./assets/yui_compressor')
  UglifierCompressor: require('./assets/uglifier_compressor')
  Processor:          require('./assets/processor')
  CssProcessor:       require('./assets/css_processor')
  JsProcessor:        require('./assets/js_processor')
  Environment:        require('./assets/environment')
  File:               require('./assets/file')
  BundledFile:        require('./assets/bundled_file')
  Server:             require('./assets/server')
  
  config:
    css:                []
    js:                 []
    version:            1.0
    enabled:            true
    js_compressor:      "uglifier"
    css_compressor:     "yui"
    css_paths:          []
    js_paths:           []
    path:               "./assets"
    
    compress:           true
    compile:            true
    digest:             true
    debug:              false
  
  process_css: ->
    @css_processor().process
      paths: @config.css_paths
      files: @config.css
  
  process_js: ->
    @js_processor().process
      paths: @config.js_paths
      files: @config.js
      
  process: ->
    css:  @process_css()
    js:   @process_js()
    
  compile_js: ->
    @js_processor().compile
      paths: @config.js_paths
      files: @config.js
      path:  @config.path
      
  compile_css: ->
    @css_processor().compile
      paths: @config.css_paths
      files: @config.css
      path:  @config.path
  
  compile: ->
    @compile_js()
    @compile_css()
  
  css_processor: ->
    @_css_processor ?= new @CssProcessor(@css_compressor())
    
  js_processor: ->
    @_js_processor ?= new @JsProcessor(@js_compressor())
    
  css_compressor: ->
    @_css_compressor ?= new @[_.titleize(@config.css_compressor) + "Compressor"]
    
  js_compressor: ->
    @_js_compressor ?= new @[_.titleize(@config.js_compressor) + "Compressor"]
    
exports = module.exports = Asset
