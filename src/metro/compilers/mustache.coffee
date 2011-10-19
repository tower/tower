class Mustache
  engine: -> require('mustache')
  
  compile: (content, options) ->
    @engine().to_html content, options.locals
    
exports = module.exports = Mustache
