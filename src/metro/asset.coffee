class Asset
  @Compiler:      require './asset/compiler'
  @Digest:        require './asset/digest'
  @Lookup:        require './asset/lookup'
  
  @include Metro.Support.Path
  @include @Digest
  @include @Lookup
  @include @Compiler
  
  @initialize: ->
    @config =
      public_path:             "#{Metro.root}/public"
      load_paths:              [
        "#{Metro.root}/app/assets",
        "#{Metro.root}/lib/assets",
        "#{Metro.root}/vendor/assets"
      ]
      
      stylesheet_directory:   "stylesheets"
      stylesheet_extensions:  ["css", "styl", "scss", "less"]
      stylesheet_aliases:
        css:                  ["styl", "less", "scss", "sass"]
      
      javascript_directory:   "javascripts"
      javascript_extensions:  ["js", "coffee", "ejs"]
      javascript_aliases:
        js:                   ["coffee", "coffeescript"]
        coffee:               ["coffeescript"]
      
      image_directory:        "images"
      image_extensions:       ["png", "jpg", "gif"]
      image_aliases:
        jpg:                  ["jpeg"]
      
      font_directory:         "fonts"
      font_extensions:        ["eot", "svg", "tff", "woff"]
      font_aliases:           {}
      
      host:                   null
      relative_root_url:      null
    
      precompile:             []
      
      js_compressor:          null
      css_compressor:         null
      
      enabled:                true
      
      manifest:               "/public/assets"
      # live compilation
      compile:                true
      prefix:                 "assets"
  
  @teardown: ->
    delete @_javascript_lookup
    delete @_stylesheet_lookup
    delete @_image_lookup
    delete @_font_lookup
    delete @_path_pattern
    delete @_css_compressor
    delete @_js_compressor
    delete @_parser
    delete @_compiler
    delete @_digests
    
  @configure: (options) ->
    @config[key] = value for key, value in options
  
  @css_compressor: ->
    @_css_compressor ?= new (require('shift').YuiCompressor)
  
  @js_compressor: ->
    @_js_compressor ?= new (require('shift').UglifyJS)
  
  constructor: (path, extension) ->
    @path        = @constructor.expand_path(path)
    @extension   = extension || @extensions()[0]
  
  compiler: ->
    @constructor.compiler()
  
module.exports = Asset
