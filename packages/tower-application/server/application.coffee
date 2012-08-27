connect = require('express')
File    = require('pathfinder').File
fs      = require('fs')
server  = null
io      = null
_       = Tower._

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
    @use Tower.MiddlewareAgent
    @use Tower.MiddlewareLocation
    if Tower.httpCredentials
      @use connect.basicAuth(Tower.httpCredentials.username, Tower.httpCredentials.password)
    #@use Tower.MiddlewareRouter
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
        app = require "#{Tower.root}/config/application"
        @_instance ||= app.create()
    @_instance

  @initializers: ->
    @_initializers ||= []

  init: ->
    throw new Error('Already initialized application') if Tower.Application._instance
    @server ||= require('express').createServer()
    Tower.Application._instance = @
    @_super arguments...

  initialize: (config, complete) ->
    #Tower.bench 'application.init', =>
    @_loadBase()

    type = typeof config
    if type != 'object'
      if type == 'function'
        complete  = config
        config    = {}
      else
        config    = {}
    type = null

    initializer = (done) =>
      @_loadPreinitializers()
      @_loadConfig(config)
      @_loadAssets()
      @_loadLocales()
      @_loadEnvironment()
      @_loadInitializers()
      @configureStores Tower.config.databases, =>
        @stack() unless Tower.isConsole
        unless Tower.lazyLoadApp
          @_loadApp(done)
        else
          done()

    @runCallbacks 'initialize', initializer, complete

  teardown: ->
    @server.stack.length = 0 # remove middleware
    Tower.Route.clear()
    delete require.cache[require.resolve("#{Tower.root}/config/routes")]

  handle: ->
    @server.handle arguments...

  use: ->
    args        = _.args(arguments)

    if typeof args[0] == 'string'
      middleware  = args.shift()
      @server.use connect[middleware] args...
    else
      @server.use args...

  configureStores: (configuration = {}, callback) ->
    defaultStoreSet = false
    databaseNames   = _.keys(configuration)
    defaultDatabase = configuration.default

    iterator = (databaseName, next) ->
      databaseConfig = configuration[databaseName]

      storeClassName = "Tower.Store#{_.camelize(databaseName)}"

      try
        store = Tower.constant(storeClassName) # This will find Tower.StoreMemory instead of trying to load it from ./store/ (which it won't find since it's in core/store directory)…
      catch error
        store = require "#{__dirname}/../../tower-store/server/#{databaseName}"

      if defaultDatabase?
        if databaseName == defaultDatabase
          Tower.Model.default('store', store)
          defaultStoreSet = true
      else
        if !defaultStoreSet || databaseConfig.default
          Tower.Model.default('store', store) unless Tower.Model.default('store')
          defaultStoreSet = true

      try store.configure Tower.config.databases[databaseName][Tower.env]
      store.initialize(next)

    Tower.parallel databaseNames, iterator, =>
      console.warn 'Default database not set, using Memory store' unless defaultStoreSet
      callback.call(@) if callback

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
      
      @initializeSockets()

      @server.listen Tower.port, =>
        _console.info("Tower #{Tower.env} server listening on port #{Tower.port}")
        value.applySocketEventHandlers() for key, value of @ when key.match /(Controller)$/
        @watch() if Tower.watch
        @initializeServerHooks() if Tower.env == 'development'

  initializeSockets: ->
    unless @io
      Tower.NetConnection.initialize()
      @io   = Tower.NetConnection.listen(@server)

  # This just sends notifications to the server if it's running, so the browser can update.
  # 
  # @todo only send events if the server is running
  initializeConsoleHooks: ->
    hookio  = require('hook.io')
    @hook   = hook = hookio.createHook(name: 'tower-console', silent: true)
    hook.start()

    # Override this method to make it route to hook.io.
    Tower.notifyConnections = (action, records, callback) ->
      records = [records] unless records instanceof Array
      hook.emit 'notifyConnections',
        action:   action
        records:  JSON.stringify(records)
        type:     try records[0].constructor.className()

  # This listens for events from the console so the browser can update
  initializeServerHooks: ->
    hookio  = require('hook.io')
    @hook   = hook = hookio.createHook(name: 'tower-server', silent: true)

    hook.on 'tower-console::notifyConnections', (data) ->
      if data.type
        # Need a better way of building records (that allows setting `id`)
        klass   = Tower.constant(data.type)
        store   = klass.store()
        records = _.map JSON.parse(data.records), (attributes) ->
          store.serializeModel(attributes, true)

        Tower.notifyConnections(data.action, records)

      data    = null
      klass   = null
      store   = null
      records = null

    hook.start()

  run: ->
    if Tower.isSinglePage
      @defaultStack()
    else
      @initialize()
    @listen()

  watch: ->
    Tower.ApplicationWatcher.watch()

  _loadBase: ->
    require "#{Tower.root}/config/application"
    require "#{Tower.root}/config/bootstrap"

  _loadPreinitializers: ->
    @_requirePaths File.files("#{Tower.root}/config/preinitializers")

  _loadConfig: (options) ->
    for key in @constructor.configNames
      config = null

      try
        config  = require("#{Tower.root}/config/#{key}")
      catch error
        config  = {}

      # need a way to get _ to work in the console, which uses _ for last returned value
      Tower.config[key] = config if _.isPresent(config)

    Tower.config.databases ||= {}

    databases       = options.databases || options.database
    defaultDatabase = options.defaultDatabase

    if databases
      databases = [databases] unless databases instanceof Array
      databases.push('default')

      Tower.config.databases = _.pick(Tower.config.databases, databases)
      Tower.config.databases.default = defaultDatabase if defaultDatabase?

  _loadAssets: ->
    Tower.ApplicationAssets.loadManifest()

  _loadLocales: ->
    paths = File.files("#{Tower.root}/config/locales")
    for path in paths
      Tower.SupportI18n.load(path) if path.match(/\.(coffee|js|iced)$/)

  _loadEnvironment: ->
    # load initializers
    try require "#{Tower.root}/config/environments/#{Tower.env}"

  _loadInitializers: ->
    @_requirePaths File.files("#{Tower.root}/config/initializers")

  _loadMVC: ->
    for path in @constructor.autoloadPaths
      # @todo do something more robust, so you can autoload files or directories
      # continue if path.match(/app\/(?:helpers)/) # just did this above
      if path.match('app/controllers')
        require "#{Tower.root}/app/controllers/applicationController"

      @_requirePaths File.files("#{Tower.root}/#{path}")

  # In development mode, this is called on the first render.
  # 
  # This lazily loads all the models/views/controllers, which can be slow.
  _loadApp: (done) ->
    @_loadMVC()

    Tower.isInitialized = true

    done() if done

  _requirePaths: (paths) ->
    for path in paths
      require(path) if path.match(/\.(coffee|js|iced)$/)

module.exports = Tower.Application
