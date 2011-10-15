connect = require('connect')
#http    = require('http')

class Application
  @Configuration: require('./application/configuration')
  
  @routes: -> @instance().routes()
  
  @instance: -> @_instance ?= new Metro.Application
  
  @configure: (callback) ->
    callback.apply(@)
  
  app: null
  server: null
  
  env: -> process.env()
    
  constructor: ->
    @app ?= connect()#.createServer()
  
  call: (env) ->
    
  routes: -> @_routes ?= new Metro.Routes.Collection
  
  config: -> @_config ?= new Metro.Application.Configuration
    
  stack: ->
    #@app.use Metro.Controller.Dispatcher.middleware
    #@app.use @routes()
    @app
    
  listen: ->
    unless Metro.env == "test"
      @app.listen(Metro.port)
      console.log("Metro server listening on port #{Metro.port}")
    
  @bootstrap: ->
    require("#{Metro.root}/config/application")
    Metro.Routes.bootstrap()
    Metro.Models.bootstrap()
    Metro.Views.bootstrap()
    Metro.Controllers.bootstrap()
    Metro.Application.instance()
  
  @run: ->
    Metro.Application.instance().stack()
    Metro.Application.instance().listen()
  
exports = module.exports = Application
