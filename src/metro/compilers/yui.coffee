class Yui
  compress: (string) ->
    @compressor()(string)
    
  compressor: ->
    @_compressor ?= require("../../../vendor/cssmin").cssmin
    
module.exports = Yui
