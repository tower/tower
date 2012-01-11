class Tower.View extends Tower.Class
  @extend
    engine:         "coffee"
    prettyPrint:    false
    loadPaths:      ["app/views"]
    store: (store) ->
      @_store = store if store
      @_store ||= new Tower.Store.Memory(name: "view")
  
  # so you copy the controller over  
  constructor: (context = {}) ->
    @_context = context

require './view/components'
require './view/helpers'
require './view/rendering'

Tower.View.include Tower.View.Rendering
Tower.View.include Tower.View.Helpers
Tower.View.include Tower.View.Components

module.exports = Tower.View
