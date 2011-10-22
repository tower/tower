connect = require('connect')

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
    @server ?= connect()#.createServer()
  
  call: (env) ->
    
  routes: -> @_routes ?= new Metro.Routes.Collection
  assets: -> @_assets ?= new Metro.Assets.Environment
  
  config: -> @_config ?= new Metro.Application.Configuration
    
  stack: ->
    @server.use connect.favicon(Metro.public_path + "/favicon.ico")
    @server.use Metro.Middleware.Static.middleware
    @server.use Metro.Middleware.Query.middleware 
    @server.use Metro.Middleware.Assets.middleware
    @server.use connect.bodyParser()
    @server.use Metro.Middleware.Dependencies.middleware
    @server.use Metro.Middleware.Cookies.middleware
    @server.use Metro.Middleware.Router.middleware
    @server
    
  listen: ->
    unless Metro.env == "test"
      @server.listen(Metro.port)
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
  
module.exports = Application
