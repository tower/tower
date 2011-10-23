class Less
  engine: -> require('less')
  
  # need to specify lookup paths for imports!
  # compile "background: red", paths: ["./app/assets/stylesheets"]
  compile: (content, options, callback) ->
    result        = ""
    self          = @
    if typeof(options) == "function"
      callback    = options
      options     = {}
    options ?= {}
    
    engine = @engine()
    parser = new engine.Parser(options)
    
    parser.parse content, (error, tree) -> 
      result = tree.toCSS()
      callback.call(self, error, result) if callback
    
    result
    
exports = module.exports = Less
