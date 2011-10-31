class Metro.Asset
  @Compiler:      require './asset/compiler'
  @Digest:        require './asset/digest'
  @Lookup:        require './asset/lookup'
  
  @include Metro.Support.Path
  @include @Digest
  @include @Lookup
  @include @Compiler
  
  @initialize: ->
    @config =
      publicPath:             "#{Metro.root}/public"
      loadPaths:              [
        "#{Metro.root}/app/assets",
        "#{Metro.root}/lib/assets",
        "#{Metro.root}/vendor/assets"
      ]
      
      stylesheetDirectory:   "stylesheets"
      stylesheetExtensions:  ["css", "styl", "scss", "less"]
      stylesheetAliases:
        css:                  ["styl", "less", "scss", "sass"]
      
      javascriptDirectory:   "javascripts"
      javascriptExtensions:  ["js", "coffee", "ejs"]
      javascriptAliases:
        js:                   ["coffee", "coffeescript"]
        coffee:               ["coffeescript"]
      
      imageDirectory:        "images"
      imageExtensions:       ["png", "jpg", "gif"]
      imageAliases:
        jpg:                  ["jpeg"]
      
      fontDirectory:         "fonts"
      fontExtensions:        ["eot", "svg", "tff", "woff"]
      fontAliases:           {}
      
      host:                   null
      relativeRootUrl:      null
    
      precompile:             []
      
      jsCompressor:          null
      cssCompressor:         null
      
      enabled:                true
      
      manifest:               "/public/assets"
      # live compilation
      compile:                true
      prefix:                 "assets"
  
  @teardown: ->
    delete @_javascriptLookup
    delete @_stylesheetLookup
    delete @_imageLookup
    delete @_fontLookup
    delete @_pathPattern
    delete @_cssCompressor
    delete @_jsCompressor
    delete @_parser
    delete @_compiler
    delete @_digests
    
  @configure: (options) ->
    @config[key] = value for key, value of options
  
  @cssCompressor: ->
    @_cssCompressor ?= new (require('shift').YuiCompressor)
  
  @jsCompressor: ->
    @_jsCompressor ?= new (require('shift').UglifyJS)
  
  constructor: (path, extension) ->
    @path        = @constructor.expandPath(path)
    @extension   = extension || @extensions()[0]
  
  compiler: ->
    @constructor.compiler()
  
module.exports = Metro.Asset
