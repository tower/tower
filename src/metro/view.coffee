class View
  @Configuration: require './view/configuration'
  @Helpers:       require './view/helpers'
  @Lookup:        require './view/lookup'
  @Rendering:     require './view/rendering'
  
  constructor: (controller) ->
    @controller = controller || (new Metro.Controller)
  
module.exports = Metro.View = View
