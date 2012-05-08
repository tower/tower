
connect = require('express')
File    = require('pathfinder').File
fs      = require('fs')
server  = null
io      = null

###
process.on 'uncaughtException', (error) ->
  handlers = Tower.Application.instance().currentErrorHandlers
  for handler in handlers
    handler(error)
###
# Entry point to your application.
class Tower.Application extends Tower.Engine
  @_callbacks: {}
  
  @extended: ->
    global[@className()] = @create()
  
  @before "initialize", "setDefaults"

  setDefaults: ->
    Tower.Model.default "store", Tower.Store.MongoDB
    Tower.Model.field "id", type: "Id"
    true

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

  defaultStack: ->
    #@use connect.favicon(Tower.publicPath + "/favicon.ico")
    @use connect.static(Tower.publicPath, maxAge: Tower.publicCacheDuration)
    @use connect.profiler() if Tower.env != "production"
    @use connect.logger()
    #@use connect.query()
    #@use connect.cookieParser(Tower.cookieSecret)
    #@use connect.session secret: Tower.sessionSecret
    #@use connect.bodyParser()
    #@use connect.csrf()
    #@use connect.methodOverride("_method")
    @use Tower.Middleware.Agent
    @use Tower.Middleware.Location
    if Tower.httpCredentials
      @use connect.basicAuth(Tower.httpCredentials.username, Tower.httpCredentials.password)
    #@use Tower.Middleware.Router
    @server.get '/', (request, response) =>
      view = new Tower.View({})
      fs.readFile "#{Tower.root}/index.coffee", 'utf-8', (error, result) =>
        view.render template: result, inline: true, type: 'coffee', (error, result) =>
          if error
            response.writeHead(404, {})
            response.write(error.stack || error.toString())
          else
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.write(result)
          response.end()
    @middleware

  @instance: ->
    unless @_instance
      if Tower.isSinglePage
        @_instance = @create()
      else
        ref = require "#{Tower.root}/config/application"
        @_instance ||= new ref
    @_instance

  @configure: (block) ->
    @initializers().push block

  @initializers: ->
    @_initializers ||= []

  init: ->
    throw new Error("Already initialized application") if Tower.Application._instance
    @server ||= require('express').createServer()
    Tower.Application.middleware ||= []
    Tower.Application._instance = @
    #global[@constructor.className()] = null#@
    @_super arguments...
    
  subscribe: (key, block) ->
    Tower.Model.Cursor.subscriptions.push(key)
    @[key] = if typeof block == 'function' then block() else block

  # @todo
  unsubscribe: (key) ->
    Tower.Model.Cursor.subscriptions.push(key).splice(_.indexOf(key), 1)
    delete @[key]

  initialize: (complete) ->
    require "#{Tower.root}/config/application"
    #@runCallbacks "initialize", null, complete
    configNames = @constructor.configNames
    reloadMap   = @constructor.reloadMap
    self        = @

    initializer = (done) =>
      requirePaths = (paths) ->
        for path in paths
          require(path) if path.match(/\.(coffee|js|iced)$/)

      requirePaths File.files("#{Tower.root}/config/preinitializers")

      for key in configNames
        config = null

        try
          config  = require("#{Tower.root}/config/#{key}")
        catch error
          config  = {}

        Tower.config[key] = config if _.isPresent(config)

      Tower.Application.Assets.loadManifest()

      paths = File.files("#{Tower.root}/config/locales")
      for path in paths
        Tower.Support.I18n.load(path) if path.match(/\.(coffee|js|iced)$/)

      # load initializers
      require "#{Tower.root}/config/environments/#{Tower.env}"

      requirePaths File.files("#{Tower.root}/config/initializers")

      self.stack()
      
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

  use: ->
    args        = _.args(arguments)

    if typeof args[0] == "string"
      middleware  = args.shift()
      @server.use connect[middleware] args...
    else
      @server.use args...

  stack: ->
    configs     = @constructor.initializers()
    self        = @
    
    #@server.configure ->
    for config in configs
      config.call(self)

    @

  get: ->
    @server.get arguments...

  post: ->
    @server.post arguments...

  put: ->
    @server.put arguments...

  listen: ->
    unless Tower.env == "test"
      @server.on "error", (error) ->
        if error.errno == "EADDRINUSE"
          console.log("   Try using a different port: `node server -p 3001`")
        #console.log(error.stack)
      @io     ||= require('socket.io').listen(@server)
      @server.listen Tower.port, =>
        _console.info("Tower #{Tower.env} server listening on port #{Tower.port}")
        value.applySocketEventHandlers() for key, value of @ when key.match /(Controller)$/
        @watch() if Tower.watch

  run: ->
    if Tower.isSinglePage
      @defaultStack()
    else
      @initialize()
    @listen()

  watch: ->
    Tower.Application.Watcher.watch()

require './application/assets'
require './application/watcher'

module.exports = Tower.Application
