Assets =
  Asset:              require('./assets/asset')
  Processor:          require('./assets/processor')
  Environment:        require('./assets/environment')
  
  load_paths:         ["./app/assets", "./lib/assets", "./vendor/assets"]
  
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
    public_path:        "./public"
    
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
    @_css_processor ?= new Metro.Assets.Processor(@css_compressor(), extension: ".css")
    
  js_processor: ->
    @_js_processor ?= new Metro.Assets.Processor(@js_compressor(), extension: ".js", terminator: ";")
    
  css_compressor: ->
    @_css_compressor ?= new Metro.Compilers[Metro.Support.String.titleize(@config.css_compressor)]
    
  js_compressor: ->
    @_js_compressor ?= new Metro.Compilers[Metro.Support.String.titleize(@config.js_compressor)]
    
  processor_for: (extension) ->
    if extension.match(/(js|coffee)/)
      @js_processor()
    else if extension.match(/(css|styl|scss|sass|less)/)
      @css_processor()
      
  upload: ->
    
    
module.exports = Assets
