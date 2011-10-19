class Haml
  engine: -> require('hamljs')
  
  # compile "./application.haml", (error, result) -> console.log(result)
  compile: (content, options, callback) ->
    callback = options if typeof(options) == "function"
    data = @engine().render(content, options || {})
    callback.call(@, null, data)
    data
    
exports = module.exports = Haml
