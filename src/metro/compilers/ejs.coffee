class Ejs
  engine: -> require('ejs')
  
  compile: (content, options, callback) ->
    self          = @
    result        = ""
    if typeof(options) == "function"
      callback    = options
      options     = {}
    options ?= {}
    
    result = @engine().render(content, options)
    
    callback.call(self, null, result) if callback
    
    result
    
exports = module.exports = Ejs
