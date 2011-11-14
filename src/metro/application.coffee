connect = require('connect')

class Metro.Application
  constructor: ->
    @server ||= require('connect')()

  @instance: -> 
    @_instance ||= new Metro.Application
  
  @initialize: ->  
    Metro.Asset.initialize() if Metro.Asset
    Metro.Route.initialize()
    #Metro.Model.initialize()
    Metro.View.initialize()
    Metro.Controller.initialize()
    require "#{Metro.root}/config/application"
    @instance()
    
  @teardown: ->
    Metro.Route.teardown()
    #Metro.Model.teardown()
    Metro.View.teardown()
    Metro.Controller.teardown()
    #Metro.Asset.teardown() if Metro.Asset
    
    delete @_instance
  
  stack: ->
    @server.use connect.favicon(Metro.publicPath + "/favicon.ico")
    @server.use Metro.Middleware.Static.middleware
    @server.use Metro.Middleware.Query.middleware 
    @server.use Metro.Middleware.Assets.middleware
    @server.use connect.bodyParser()
    @server.use Metro.Middleware.Dependencies.middleware
    @server.use Metro.Middleware.Router.middleware
    @server
    
  listen: ->
    unless Metro.env == "test"
      @server.listen(Metro.port)
      console.log("Metro server listening on port #{Metro.port}")
  
  @run: ->
    Metro.Application.instance().stack()
    Metro.Application.instance().listen()

module.exports = Metro.Application
