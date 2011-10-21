class Stylus
  engine: -> require('stylus')
  
  compile: (content, options = {}) ->
    result = null
    engine = @engine()
    engine = engine.set('paths', options.paths) if options.paths?
    engine.render content, options, (error, data) -> result = data
    result
    
module.exports = Stylus
