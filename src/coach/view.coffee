class Coach.View extends Coach.Object
  @extend
    engine:         "jade"
    prettyPrint:    false
    loadPaths:      ["app/views"]
    store: (store) ->
      @_store = store if store
      @_store ||= new Coach.Store.Memory
  
  # so you copy the controller over  
  constructor: (context = {}) ->
    @_context = context

require './view/helpers'
require './view/rendering'

Coach.View.include Coach.View.Rendering
Coach.View.include Coach.View.Helpers

module.exports = Coach.View
