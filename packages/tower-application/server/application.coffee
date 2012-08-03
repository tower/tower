connect = require('express')
File    = require('pathfinder').File
fs      = require('fs')
server  = null
io      = null

# Entry point to your application.
class Tower.Application extends Tower.Engine
  @_callbacks: {}

  @before 'initialize', 'setDefaults'

  # This is a hack
  setDefaults: ->
    true

  errorHandlers: []

  @autoloadPaths: [
    'app/helpers'
    'app/concerns'
    'app/models'
    'app/controllers'
    'app/presenters'
    'app/mailers'
    'app/middleware'
  ]

  @configNames: [
    'session'
    'assets'
    'credentials'
    'databases'
    'routes'
  ]

  defaultStack: ->
    #@use connect.favicon(Tower.publicPath + '/favicon.ico')
    @use connect.static(Tower.publicPath, maxAge: Tower.publicCacheDuration)
    @use connect.profiler() if Tower.env != 'production'
    @use connect.logger()
    #@use connect.query()
    #@use connect.cookieParser(Tower.cookieSecret)
    #@use connect.session secret: Tower.sessionSecret
    #@use connect.bodyParser()
    #@use connect.csrf()
    #@use connect.methodOverride('_method')
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

  @initializers: ->
    @_initializers ||= []

  init: ->
    throw new Error('Already initialized application') if Tower.Application._instance
    @server ||= require('express').createServer()
    Tower.Application._instance = @
    @_super arguments...

  initialize: (complete) ->
    require "#{Tower.root}/config/application"
    require "#{Tower.root}/config/bootstrap"
    #@runCallbacks "initialize", null, complete
    configNames = @constructor.configNames
    reloadMap   = @constructor.reloadMap

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

        # need a way to get _ to work in the console, which uses _ for last returned value
        Tower.config[key] = config if Tower.modules._.isPresent(config)

      Tower.Application.Assets.loadManifest()

      paths = File.files("#{Tower.root}/config/locales")
      for path in paths
        Tower.Support.I18n.load(path) if path.match(/\.(coffee|js|iced)$/)

      # load initializers
      require "#{Tower.root}/config/environments/#{Tower.env}"

      requirePaths File.files("#{Tower.root}/config/initializers")

      @configureStores Tower.config.databases, =>
        @stack()

        for path in @constructor.autoloadPaths
          # @todo do something more robust, so you can autoload files or directories
          # continue if path.match(/app\/(?:helpers)/) # just did this above
          if path.match('app/controllers')
            require "#{Tower.root}/app/controllers/applicationController"
          requirePaths File.files("#{Tower.root}/#{path}")

        done() if done

    @runCallbacks 'initialize', initializer, complete

  teardown: ->
    @server.stack.length = 0 # remove middleware
    Tower.Route.clear()
    delete require.cache[require.resolve("#{Tower.root}/config/routes")]

  handle: ->
    @server.handle arguments...

  use: ->
    args        = Tower.modules._.args(arguments)

    if typeof args[0] == 'string'
      middleware  = args.shift()
      @server.use connect[middleware] args...
    else
      @server.use args...

  configureStores: (configuration = {}, callback) ->
    defaultStoreSet = false

    databaseNames = Tower.modules._.keys(configuration)

    iterator = (databaseName, next) ->
      databaseConfig = configuration[databaseName]

      storeClassName = "Tower.Store.#{Tower.modules._.camelize(databaseName)}"

      try
        store = Tower.constant(storeClassName) # This will find Tower.Store.Memory instead of trying to load it from ./store/ (which it won't find since it's in core/store directory)…
      catch error
        store = require "./store/#{databaseName}"

      if !defaultStoreSet || databaseConfig.default
        Tower.Model.default('store', store) unless Tower.Model.default('store')
        defaultStoreSet = true

      #Tower.callback 'initialize', name: "#{store.className()}.initialize", (done) ->
      #  try store.configure Tower.config.databases[databaseName][Tower.env]
      #  store.initialize done
      try store.configure Tower.config.databases[databaseName][Tower.env]
      store.initialize(next)

    Tower.parallel databaseNames, iterator, callback

  stack: ->
    configs     = @constructor.initializers()

    #@server.configure ->
    for config in configs
      config.call(@)

    @

  get: ->
    @server.get arguments...

  post: ->
    @server.post arguments...

  put: ->
    @server.put arguments...

  listen: ->
    unless Tower.env == 'test'
      @server.on 'error', (error) ->
        if error.errno == 'EADDRINUSE'
          console.log('   Try using a different port: `node server -p 3001`')
        #console.log(error.stack)
      
      unless @io
        Tower.Net.Connection.initialize()
        @io   = Tower.Net.Connection.listen(@server)

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

module.exports = Tower.Application
