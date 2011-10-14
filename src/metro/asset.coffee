fs     = require('fs')
_      = require("underscore")
_.mixin(require("underscore.string"))

Metro =
  Asset:
    YuiCompressor:      require('./asset/yui_compressor')
    UglifierCompressor: require('./asset/uglifier_compressor')
    Processor:          require('./asset/processor')
    CssProcessor:       require('./asset/css_processor')
    JsProcessor:        require('./asset/js_processor')
    Environment:        require('./asset/environment')
    File:               require('./asset/file')
    BundledFile:        require('./asset/bundled_file')
    Server:             require('./asset/server')
    
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
    
exports = module.exports = Metro
