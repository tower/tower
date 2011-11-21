class Metro.View extends Metro.Object
  @extend
    loadPaths:       ["./app/views"]
    paths:           []
    pathsByName:     {}
    engine:          "jade"
    prettyPrint:     false
    store: (store) ->
      @_store = store if store
      @_store ||= new Metro.Store.FileSystem
    
  constructor: (controller) ->
    @controller = controller || (new Metro.Controller)
  
  store: ->
    @constructor.store()

require './view/helpers'

module.exports = Metro.View
