#express = require('express')

class Application
  @Configuration: require('./application/configuration')
  
  @routes: -> @instance().routes()
  
  @instance: -> @_instance ?= new Metro.Application
  
  @configure: (callback) ->
    callback.apply(@)
  
  app: ->
    @_app ?= express.createServer()
    
  constructor: ->
    #@app()
    #Metro.Application.bootstrap()
  
  call: (env) ->
  
  env_config: -> @_env_config ?= {}
    
  routes: -> @_routes ?= new Metro.Route.Collection
  
  initializers: ->
    
  config: -> @_config ?= new Metro.Application.Configuration
    
  default_middleware_stack: ->
    
  @bootstrap: ->
    require("#{Metro.root}/config/application.js")
    Metro.Route.bootstrap()
    Metro.Model.bootstrap()
    Metro.View.bootstrap()
    Metro.Controller.bootstrap()
  
exports = module.exports = Application
