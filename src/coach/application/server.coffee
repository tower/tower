connect = require('express')
File    = require('pathfinder').File

server  = require('express').createServer()
io      = require('socket.io').listen(server)

class Coach.Application extends Coach.Class
  @use: ->
    @middleware ||= []
    @middleware.push arguments
  
  @defaultStack: ->
    @use connect.favicon(Coach.publicPath + "/favicon.ico")
    @use connect.static(Coach.publicPath, maxAge: Coach.publicCacheDuration)
    @use connect.profiler() if Coach.env != "production"
    @use connect.logger()
    @use connect.query()
    @use connect.cookieParser(Coach.cookieSecret)
    @use connect.session secret: Coach.sessionSecret
    @use connect.bodyParser()
    @use connect.csrf()
    @use connect.methodOverride("_method")
    @use Coach.Middleware.Agent
    @use Coach.Middleware.Location
    if Coach.httpCredentials
      @use connect.basicAuth(Coach.httpCredentials.username, Coach.httpCredentials.password)
    @use Coach.Middleware.Router
    @middleware

  @instance: ->
    unless @_instance
      require "#{Coach.root}/config/application"
    @_instance
  
  constructor: ->  
    throw new Error("Already initialized application") if Coach.Application._instance
    Coach.Application.middleware ||= []
    Coach.Application._instance = @
    @server ||= server
    @io     ||= io
    
  use: ->
    @constructor.use arguments...
  
  initialize: ->
    #Coach.Route.initialize()
    require "#{Coach.root}/config/application"
    
    Coach.Support.Dependencies.load "#{Coach.root}/config/locales/en", (path) ->
      Coach.Support.I18n.load path
      
    require "#{Coach.root}/config/routes"
    
    #Coach.Support.Dependencies.load "#{Coach.root}/app/models"
    #Coach.Model.initialize()
    #Coach.View.initialize()
    Coach.Support.Dependencies.load("#{Coach.root}/app/helpers")
    #Coach.Controller.initialize()
    Coach.Support.Dependencies.load("#{Coach.root}/app/controllers")
    
    # load initializers
    require "#{Coach.root}/config/environments/#{Coach.env}"
    paths = File.files("#{Coach.root}/config/initializers")
    require(path) for path in paths
    
  teardown: ->
    #Coach.Route.teardown()
    Coach.Route.clear()
    delete require.cache[require.resolve("#{Coach.root}/config/locales/en")]
    delete require.cache[require.resolve("#{Coach.root}/config/routes")]
    delete Coach.Route._store
    #Coach.Model.teardown()
    # Coach.Support.Dependencies.load("#{Coach.root}/app/models")
    # delete @_store
    #Coach.View.teardown()
    #Coach.Controller.teardown()
    delete Coach.Controller._helpers
    delete Coach.Controller._layout
    delete Coach.Controller._theme
  
  stack: ->
    middlewares = @constructor.middleware
    
    unless middlewares && middlewares.length > 0
      middlewares = @constructor.defaultStack()
      
    for middleware in middlewares
      args        = Coach.Support.Array.args(middleware)
      if typeof args[0] == "string"
        middleware  = args.shift()
        @server.use connect[middleware].apply(connect, args) 
      else
        @server.use args...
    
    @
    
  listen: ->
    unless Coach.env == "test"
      @server.listen(Coach.port)
      _console.info("Coach #{Coach.env} server listening on port #{Coach.port}")
  
  run: ->
    @initialize()
    @stack()
    @listen()

module.exports = Coach.Application
