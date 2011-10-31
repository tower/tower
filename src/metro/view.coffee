class Metro.View  
  constructor: (controller) ->
    @controller = controller || (new Metro.Controller)

require './view/helpers'
require './view/lookup'
require './view/rendering'

Metro.View.include Metro.View.Lookup
Metro.View.include Metro.View.Rendering

module.exports = Metro.View
