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

