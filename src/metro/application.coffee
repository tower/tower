connect = require('connect')
File    = require('pathfinder').File

class Metro.Application
  constructor: ->
    @server ||= require('connect')()

  @instance: -> 
    @_instance ||= new Metro.Application
  
  @initialize: ->
    Metro.Route.initialize()
    #Metro.Model.initialize()
    Metro.View.initialize()
    Metro.Controller.initialize()
    @loadInitializers()
    @instance()
    
  @loadInitializers: ->
    require "#{Metro.root}/config/application"
    require "#{Metro.root}/config/environments/#{Metro.env}"
    paths = File.files("#{Metro.root}/config/initializers")
    require(path) for path in paths
    
  @teardown: ->
    Metro.Route.teardown()
    #Metro.Model.teardown()
    Metro.View.teardown()
    Metro.Controller.teardown()
    
    delete @_instance
  
  stack: ->
    @server.use connect.favicon(Metro.publicPath + "/favicon.ico")
    @server.use Metro.Middleware.Static.middleware
    @server.use Metro.Middleware.Query.middleware
    @server.use connect.bodyParser()
    @server.use Metro.Middleware.Dependencies.middleware
    @server.use Metro.Middleware.Router.middleware
    @server
    
  listen: ->
    unless Metro.env == "test"
      @server.listen(Metro.port)
      console.log("Metro #{Metro.env} server listening on port #{Metro.port}")
  
  @run: ->
    Metro.Application.instance().stack()
    Metro.Application.instance().listen()

module.exports = Metro.Application
