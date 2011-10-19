class Jade
  engine: -> require('jade')
  
  # compile "./application.jade", (error, result) -> console.log(result)
  compile: (content, options) ->
    callback = options if typeof(options) == "function"
    result = null
    options ?= {}
    @engine().render content, options, (error, data) ->
      if error
        result = error.toString()
      else
        result = data
    result
    
exports = module.exports = Jade
