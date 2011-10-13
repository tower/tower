class Application
  @Configuration: require('../lib/application/configuration')
  
  @routes: -> @instance().routes()
  
  @instance: -> @_instance ?= new Metro.Application
  
  app: ->
  
  call: (env) ->
  
  env_config: -> @_env_config ?= {}
    
  routes: -> @_routes ?= new Metro.Route.Collection
  
  initializers: ->
    
  config: -> @_config ?= new Metro.Application.Configuration
    
  default_middleware_stack: ->    
  
exports = module.exports = Application
