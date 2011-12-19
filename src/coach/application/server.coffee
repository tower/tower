connect = require('express')
File    = require('pathfinder').File

class Coach.Application extends Coach.Class
  @instance: ->
    unless @_instance
      require "#{Coach.root}/config/application"
    @_instance
  
  constructor: ->
    Coach.Application._instance = @
    @server ||= require('express').createServer()
    @io     ||= require('socket.io').listen(@server)
  
  # @use 'bodyParser', 'methodOverride', @app.router, 'static'  
  use: ->
    server.use(arguments...)
    
  initialize: ->
    #Coach.Route.initialize()
    require "#{Coach.root}/config/application"
    Coach.Support.I18n.load "../application/locale/en"
    Coach.Support.I18n.load "../model/locale/en"
    Coach.Support.I18n.load "#{Coach.root}/config/locales/en"
    require "#{Coach.root}/config/routes"
    
    #Coach.Support.Dependencies.load "#{Coach.root}/app/models"
    #Coach.Model.initialize()
    #Coach.View.initialize()
    Coach.Support.Dependencies.load("#{Coach.root}/app/helpers")
    #Coach.Controller.initialize()
    Coach.Support.Dependencies.load("#{Coach.root}/app/controllers")
    
    @loadInitializers()
    
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
  
  loadInitializers: ->
    require "#{Coach.root}/config/environments/#{Coach.env}"
    paths = File.files("#{Coach.root}/config/initializers")
    require(path) for path in paths
  
  stack: ->
    server = @server
    server.use connect.favicon(Coach.publicPath + "/favicon.ico")
    server.use connect.static(Coach.publicPath, maxAge: Coach.publicCacheDuration)
    server.use connect.profiler() if Coach.env != "production"
    server.use connect.logger()
    server.use connect.query()
    server.use connect.cookieParser(Coach.cookieSecret)
    server.use connect.session secret: Coach.sessionSecret
    server.use connect.bodyParser()
    server.use connect.csrf()
    server.use connect.methodOverride("_method")
    server.use Coach.Middleware.Location
    if Coach.httpCredentials
      server.use connect.basicAuth(Coach.httpCredentials.username, Coach.httpCredentials.password)
    server.use Coach.Middleware.Router
    server
    
  listen: ->
    unless Coach.env == "test"
      @server.listen(Coach.port)
      _console.info("Coach #{Coach.env} server listening on port #{Coach.port}")
  
  run: ->
    @initialize()
    @stack()
    @listen()

module.exports = Coach.Application
