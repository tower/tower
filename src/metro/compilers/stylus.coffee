class Stylus
  engine: -> require('stylus')
  
  compile: (content, options = {}) ->
    result = null
    @engine().render content, options, (error, data) -> result = data
    result
    
module.exports = Stylus
