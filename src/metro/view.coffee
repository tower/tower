class Metro.View extends Metro.Object
  @extend
    engine:         "jade"
    prettyPrint:    false
    loadPaths:      ["./app/views"]
    store: (store) ->
      @_store = store if store
      @_store ||= new Metro.Store.Memory
    
  constructor: (context = {}) ->
    @context = context

require './view/helpers'
require './view/rendering'

Metro.View.include Metro.View.Rendering

module.exports = Metro.View
