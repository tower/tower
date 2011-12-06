connect = require('connect')
File    = require('pathfinder').File

class Metro.Application
  @instance: ->
    @_instance ||= require "#{Metro.root}/config/application"
  
  constructor: ->
    @server ||= require('connect')()
    
  use: ->
    server.use(arguments...)
    
  initialize: ->
    #Metro.Route.initialize()
    require "#{Metro.root}/config/application"
    Metro.Support.I18n.load "../application/locale/en"
    Metro.Support.I18n.load "../model/locale/en"
    Metro.Support.I18n.load "#{Metro.root}/config/locales/en"
    require "#{Metro.root}/config/routes"
    
    #Metro.Support.Dependencies.load "#{Metro.root}/app/models"
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
    #Metro.View.teardown()
    #Metro.Controller.teardown()
    delete Metro.Controller._helpers
    delete Metro.Controller._layout
    delete Metro.Controller._theme
  
  loadInitializers: ->
    require "#{Metro.root}/config/environments/#{Metro.env}"
    paths = File.files("#{Metro.root}/config/initializers")
    require(path) for path in paths
  
  stack: ->
    server = @server
    server.use connect.favicon(Metro.publicPath + "/favicon.ico")
    server.use connect.static(Metro.publicPath, maxAge: Metro.publicCacheDuration)
    server.use connect.profiler() if Metro.env != "production"
    server.use connect.logger()
    server.use connect.query()
    server.use connect.cookieParser(Metro.cookieSecret)
    server.use connect.session secret: Metro.sessionSecret
    server.use connect.bodyParser()
    server.use connect.csrf()
    server.use Metro.Middleware.Router
    server
    
  listen: ->
    unless Metro.env == "test"
      @server.listen(Metro.port)
      _console.info("Metro #{Metro.env} server listening on port #{Metro.port}")
  
  run: ->
    @initialize()
    @stack()
    @listen()

module.exports = Metro.Application
