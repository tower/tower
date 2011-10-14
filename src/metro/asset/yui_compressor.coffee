class YuiCompressor
  compress: (string) ->
    @compressor()(string)
    
  compressor: ->
    @_compressor ?= require("../../../vendor/cssmin").cssmin
    
exports = module.exports = YuiCompressor
