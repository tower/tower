class Sass
  engine: -> require('sass')
  
  compile: (content, options) ->
    @engine().render(content)
    
exports = module.exports = Sass
