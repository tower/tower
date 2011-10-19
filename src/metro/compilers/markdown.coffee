class Markdown
  engine: -> require('markdown')
  
  compile: (content, options) ->
    @engine().parse content
    
exports = module.exports = Markdown
