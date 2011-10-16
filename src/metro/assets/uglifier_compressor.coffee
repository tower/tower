class UglifierCompressor
  compress: (string) ->
    ast = @parser().parse(string)
    ast = @compressor().ast_mangle(ast)
    ast = @compressor().ast_squeeze(ast)
    @compressor().gen_code(ast)
  
  compressor: ->
    @_compressor ?= require("uglify-js").uglify
    
  parser: ->
    @_parser ?= require("uglify-js").parser
    @_parser
    
module.exports = UglifierCompressor
