connect = require('express')
File    = require('pathfinder').File
server  = null
io      = null

class Tower.Application extends Tower.Engine
  @autoloadPaths: [
    "app/helpers",
    "app/models",
    "app/controllers",
    "app/presenters",
    "app/mailers",
    "app/middleware"
  ]

  @configNames: [
    "session"
    "assets"
    "credentials"
    "databases"
    "routes"
  ]

  @use: ->
    @middleware ||= []
    @middleware.push arguments

  @defaultStack: ->
    @use connect.favicon(Tower.publicPath + "/favicon.ico")
    @use connect.static(Tower.publicPath, maxAge: Tower.publicCacheDuration)
    @use connect.profiler() if Tower.env != "production"
    @use connect.logger()
    @use connect.query()
    @use connect.cookieParser(Tower.cookieSecret)
    @use connect.session secret: Tower.sessionSecret
    @use connect.bodyParser()
    @use connect.csrf()
    @use connect.methodOverride("_method")
    @use Tower.Middleware.Agent
    @use Tower.Middleware.Location
    if Tower.httpCredentials
      @use connect.basicAuth(Tower.httpCredentials.username, Tower.httpCredentials.password)
    @use Tower.Middleware.Router
    @middleware

  @instance: ->
    unless @_instance
      ref = require "#{Tower.root}/config/application"
      @_instance ||= new ref
    @_instance

  @configure: (block) ->
    @initializers().push block

  @initializers: ->
    @_initializers ||= []

  constructor: ->
    throw new Error("Already initialized application") if Tower.Application._instance
    @server ||= require('express').createServer()
    Tower.Application.middleware ||= []
    Tower.Application._instance = @
    global[@constructor.name] = @

  use: ->
    @constructor.use arguments...

  initialize: (complete) ->
    require "#{Tower.root}/config/application"
    #@runCallbacks "initialize", null, complete
    configNames = @constructor.configNames
    configs     = @constructor.initializers()
    self        = @
    initializer = (done) =>
      requirePaths = (paths) ->
        for path in paths
          require(path) if path.match(/\.(coffee|js)$/)

      for key in configNames
        config = null

        try
          config  = require("#{Tower.root}/config/#{key}")
        catch error
          config  = {}

        Tower.config[key] = config if Tower.Support.Object.isPresent(config)

      Tower.Application.Assets.loadManifest()

      paths = File.files("#{Tower.root}/config/locales")
      for path in paths
        Tower.Support.I18n.load(path) if path.match(/\.(coffee|js)$/)

      # load initializers
      require "#{Tower.root}/config/environments/#{Tower.env}"

      requirePaths File.files("#{Tower.root}/config/initializers")
      
      config.call(self) for config in configs
      requirePaths File.files("#{Tower.root}/app/helpers")
      requirePaths File.files("#{Tower.root}/app/models")
      require "#{Tower.root}/app/controllers/applicationController"
      for path in ["controllers", "mailers", "observers", "presenters", "middleware"]
        requirePaths File.files("#{Tower.root}/app/#{path}")

      done()

    @runCallbacks "initialize", initializer, complete

  teardown: ->
    @server.stack.length = 0 # remove middleware
    Tower.Route.clear()
    delete require.cache[require.resolve("#{Tower.root}/config/routes")]

  handle: ->
    @server.handle arguments...

  stack: ->
    middlewares = @constructor.middleware

    unless middlewares && middlewares.length > 0
      middlewares = @constructor.defaultStack()
      
    for middleware in middlewares
      args        = Tower.Support.Array.args(middleware)
      if typeof args[0] == "string"
        middleware  = args.shift()
        @server.use connect[middleware].apply(connect, args)
      else
        @server.use args...

    @

  listen: ->
    unless Tower.env == "test"
      @server.on "error", (error) ->
        if error.errno == "EADDRINUSE"
          console.log("   Try using a different port: `node server -p 3001`")
        #console.log(error.stack)
      @io     ||= require('socket.io').listen(@server)
      @server.listen Tower.port, =>
        _console.info("Tower #{Tower.env} server listening on port #{Tower.port}")
        @watch()

  run: ->
    @initialize()
    @stack()
    @listen()

  watch: ->
    forever = require("forever")

    child = new (forever.Monitor)("node_modules/design.io/bin/design.io",
      max:    1
      silent: false
      options: []
    )

    child.start()

    child.on "stdout", (data) =>
      data = data.toString()
      try
        # [Sat, 18 Feb 2012 22:49:33 GMT] INFO updated public/stylesheets/vendor/stylesheets/bootstrap/reset.css
        data.replace /\[([^\]]+)\] (\w+) (\w+) (.+)/, (_, date, type, action, path) =>
          path  = path.split('\033')[0]
          ext   = path.match(/\.(\w+)$/g)
          ext   = ext[0] if ext
          if ext && ext.match(/(js|coffee)/) && action.match(/(updated|deleted)/)
            @fileChanged(path)
          _
      catch error
        @

    child.on "error", (error) =>
      console.log error

    forever.startServer(child);

  fileChanged: (path) ->
    delete require.cache[require.resolve(path)]

require './application/assets'

module.exports = Tower.Application
