class Ejs
  engine: -> require('ejs')
  
  # compile "./application.haml", (error, result) -> console.log(result)
  compile: (content, options, callback) ->
    options   ?= {}
    callback  = options if typeof(options) == "function"
    data      = @engine().render(content, options)
    callback.call(@, null, data)
    data
    
exports = module.exports = Ejs
