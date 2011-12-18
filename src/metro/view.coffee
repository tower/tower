class Metro.View extends Metro.Object
  @extend
    engine:         "jade"
    prettyPrint:    false
    loadPaths:      ["app/views"]
    store: (store) ->
      @_store = store if store
      @_store ||= new Metro.Store.Memory
  
  # so you copy the controller over  
  constructor: (context = {}) ->
    @_context = context

require './view/helpers'
require './view/rendering'

Metro.View.include Metro.View.Rendering
Metro.View.include Metro.View.Helpers

module.exports = Metro.View
