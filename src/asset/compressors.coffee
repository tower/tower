Metro.Asset =
  css_compressors:        {}
  js_compressors:         {}
  default_css_compressor: null
  default_js_compressor:  null
  
  register_css_compressor: (name, klass, options = {}) ->
  
  register_js_compressor: (name, klass, options = {}) ->
    

class Metro.Asset.NullCompressor
  compress: (content) ->
    content

class Metro.Asset.LazyCompressor
  constructor: (compressor_class)
    @_compressor_class = compressor_class

  compress: (content) ->
    compressor().compress(content)
  
  compressor: ->
    @_compressor ?= new @compressor_class()
    
  compressor_class: ->
    @_compressor_class ?= Metro.Asset.NullCompressor