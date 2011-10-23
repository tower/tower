class Stylus
  engine: -> require('stylus')
  
  compile: (content, options, callback) ->
    result        = ""
    self = @
    if typeof(options) == "function"
      callback    = options
      options     = {}
    options ?= {}
    
    engine = @engine()
    engine = engine.set('paths', options.paths) if options.paths?
    
    engine.render content, options, (error, data) -> 
      result = data
      callback.call(self, error, result) if callback
      
    result
    
module.exports = Stylus
