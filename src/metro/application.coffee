class Application
  @Server:        require './application/server'
  
  @include @Server
  
  constructor: ->
    @server ?= require('connect')()

  @instance: -> 
    @_instance ?= new Metro.Application
  
  @initialize: ->  
    Metro.Asset.initialize() if Metro.Asset
    Metro.Route.initialize()
    Metro.Model.initialize()
    Metro.View.initialize()
    Metro.Controller.initialize()
    require "#{Metro.root}/config/application"
    @instance()
    
  @teardown: ->
    Metro.Route.teardown()
    Metro.Model.teardown()
    Metro.View.teardown()
    Metro.Controller.teardown()
    #Metro.Asset.teardown() if Metro.Asset
    
    delete @_instance
  
module.exports = Application
