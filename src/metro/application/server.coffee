connect = require('connect')
File    = require('pathfinder').File

class Metro.Application
  @instance: ->
    @_instance ||= new Metro.Application
  
  constructor: ->
    @server ||= require('connect')()
    
  use: ->
    server.use(arguments...)
    
  initialize: ->
    #Metro.Route.initialize()
    require "#{Metro.root}/config/locales/en"
    require "#{Metro.root}/config/routes"
    #Metro.Model.initialize()
    #Metro.View.initialize()
    Metro.Support.Dependencies.load("#{Metro.root}/app/helpers")
    #Metro.Controller.initialize()
    Metro.Support.Dependencies.load("#{Metro.root}/app/controllers")
    
    @loadInitializers()
    
  teardown: ->
    #Metro.Route.teardown()
    Metro.Route._store = []
    delete require.cache[require.resolve("#{Metro.root}/config/locales/en")]
    delete require.cache[require.resolve("#{Metro.root}/config/routes")]
    delete Metro.Route._store
    #Metro.Model.teardown()
    # Metro.Support.Dependencies.load("#{Metro.root}/app/models")
    # delete @_store
    Metro.View.teardown()
    #Metro.Controller.teardown()
    delete Metro.Controller._helpers
    delete Metro.Controller._layout
    delete Metro.Controller._theme
  
  loadInitializers: ->
    require "#{Metro.root}/config/application"
    require "#{Metro.root}/config/environments/#{Metro.env}"
    paths = File.files("#{Metro.root}/config/initializers")
    require(path) for path in paths
  
  stack: ->
    server = @server
    server.use connect.favicon(Metro.publicPath + "/favicon.ico")
    server.use Metro.Middleware.Static.middleware
    server.use Metro.Middleware.Query.middleware
    server.use connect.bodyParser()
    server.use Metro.Middleware.Dependencies
    server.use Metro.Middleware.Router
    server
    
  listen: ->
    unless Metro.env == "test"
      @server.listen(Metro.port)
      console.log("Metro #{Metro.env} server listening on port #{Metro.port}")
  
  run: ->
    @stack()
    @listen()

module.exports = Metro.Application
