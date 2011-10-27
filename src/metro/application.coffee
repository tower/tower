class Application
  @Server:        require './application/server'
  
  @include @Server
  
  @instance: -> 
    @_instance ?= new Metro.Application
  
  @initialize: ->
    require "#{Metro.root}/config/application"
    Metro.Route.initialize()
    Metro.Model.initialize()
    Metro.View.initialize()
    Metro.Controller.initialize()
    Metro.Asset.initialize() if Metro.Asset
    @instance()
    
  @teardown: ->
    Metro.Route.teardown()
    Metro.Model.teardown()
    Metro.View.teardown()
    Metro.Controller.teardown()
    Metro.Asset.teardown() if Metro.Asset
    
    delete @_instance
  
module.exports = Application
