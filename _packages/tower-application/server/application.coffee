fs      = require('fs')
_path   = require('path')
server  = null
io      = null
_       = Tower._

Tower.tcpPort = 6969

# Entry point to your application.
class Tower.Application extends Tower.Engine
  @reopenClass
    _callbacks: {}

    autoloadPaths: [
      'app/helpers'
      'app/concerns'
      'app/models'
      'app/controllers'
      'app/presenters'
      'app/services'
      'app/mailers'
      'app/abilities'
      'app/middleware'
      'app/jobs'
    ]

    configNames: [
      'session'
      'assets'
      'credentials'
      'databases'
      'routes'
    ]

    instance: ->
      unless @_instance
        app = require "#{Tower.root}/app/config/shared/application"
        @_instance ||= app.create()
      @_instance

    initializers: ->
      @_initializers ||= []

  @before 'initialize', 'setDefaults'

  @reopen
    # Global list of files we've required for the app.
    # 
    # This is a cache to prevent fs access, which is slow at reasonable scale.
    paths: []

    # This is a path with some known key (preinitializers, locales, etc.),
    # with the value as the array of nested files found for it.
    pathsByType: {}

    # This is a hack
    setDefaults: ->
      true

    errorHandlers: []

    init: ->
      throw new Error('Already initialized application') if Tower.Application._instance
      @app ||= require('express')()
      @server = require('http').createServer(@app)
      # http://stackoverflow.com/questions/7185074/heroku-nodejs-http-to-https-ssl-forced-redirect
      # http://stackoverflow.com/questions/7450940/automatic-https-connection-redirect-with-node-js-express
      # http://stackoverflow.com/questions/11485880/heroku-error-h13-on-expressjs-node-https-server
      # https://github.com/visionmedia/express/issues/1166
      # @httpsServer = require('https').createServer(server_options,app).listen(413)
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
            process.nextTick =>
              @_loadApp()

      @runCallbacks 'initialize', initializer, complete

    # @todo
    teardown: ->
      @server.stack.length = 0 # remove middleware
      Tower.Route.clear()
      # delete require.cache[require.resolve("#{Tower.root}/app/config/server/routes")]

    handle: ->
      @app.handle arguments...

    use: ->
      args        = _.args(arguments)
      express     = require('express')
      app = @app

      if typeof args[0] == 'string'
        middleware  = args.shift()
        app.use express[middleware] args...
      else
        app.use args...

    configureStores: (configuration = {}, callback) ->
      defaultStoreSet = false
      databaseNames   = _.keys(configuration)
      defaultDatabase = configuration.default

      iterator = (databaseName, next) ->
        return next() if databaseName == 'default'
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
        # @todo azure seems to fail if console.warn is called?
        console.log 'Default database not set, using Memory store' unless defaultStoreSet
        callback.call(@) if callback

    stack: ->
      return @ if @isStacked # @todo tmp
      @isStacked = true
      configs     = @constructor.initializers()

      #@server.configure ->
      for config in configs
        config.call(@)

      @

    get: ->
      @app.get arguments...

    post: ->
      @app.post arguments...

    put: ->
      @app.put arguments...

    listen: ->
      unless Tower.env == 'test'
        @app.on 'error', (error) ->
          if error.errno == 'EADDRINUSE'
            console.log('   Try using a different port: `node server -p 3001`')
            process.exit()
          #console.log(error.stack)
        
        @initializeSockets()

        @server.listen Tower.port, =>
          console.info("Tower #{Tower.env} server listening on port #{Tower.port}")
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

    # This listens for events from the console so the browser can update
    initializeServerHooks: ->

    run: ->
      @initialize()
      @listen()

    watch: ->
      Tower.ApplicationWatcher.watch()

    _loadBase: ->
      @_requireAny 'app/config', 'application'
      @_requireAny 'app/config', 'bootstrap'

    _loadPreinitializers: ->
      @_requirePaths @selectPaths('app/config', 'preinitializers')

    _loadConfig: (options) ->
      for key in @constructor.configNames
        config = @_requireFirst('app/config', key) || {}

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
      Tower.SupportI18n.load(path) for path in @selectPaths('app/config', 'locales')

    _loadEnvironment: ->
      # load initializers
      @_requireAny 'app/config', "environments/#{Tower.env}"

    _loadInitializers: ->
      @_requirePaths @selectPaths('app/config', 'initializers')

    _loadMVC: ->
      for path in @constructor.autoloadPaths
        # @todo do something more robust, so you can autoload files or directories
        # continue if path.match(/app\/(?:helpers)/) # just did this above
        if path.match('app/controllers')
          @_requireAny 'app/controllers', 'applicationController'

        @_requirePaths @selectPaths(path)

    # In development mode, this is called on the first render.
    # 
    # This lazily loads all the models/views/controllers, which can be slow.
    _loadApp: (done) ->
      @_loadMVC()

      Tower.isInitialized = true

      # Ember.identifyNamespaces()

      done() if done

    requireDirectory: (path, type = 'script') ->
      wrench  = Tower.module('wrench')
      pattern = @_typeToPattern[type]
      for file in files = wrench.readdirSyncRecursive(path)
        require(_path.join(Tower.root, path, file)) if file.match(pattern)
      files

    _requirePaths: (paths) ->
      require(path) for path in paths

    _requireAny: (pathStart, pathEnd) ->
      for path in @_buildRequirePaths(pathStart, pathEnd)
        @_tryToRequire(path)

    _requireFirst: (pathStart, pathEnd) ->
      for path in @_buildRequirePaths(pathStart, pathEnd)
        result = @_tryToRequire(path)
        return result if result?
      null

    # @todo this should be cached (along with selectPaths)
    #   so when running tests and resetting the app state doesn't have to
    #   do it over and over again. It will have to be updated though
    #   by the watcher when a file is changed.
    _buildRequirePaths: (pathStart, pathEnd) ->
      [
        _path.join(Tower.root, pathStart, pathEnd)
        _path.join(Tower.root, pathStart, 'shared', pathEnd)
        _path.join(Tower.root, pathStart, 'server', pathEnd)
      ]

    # @todo try to optimize this
    _tryToRequire: (path) ->
      try
        return require(path) # if fs.existsSync(path)
      catch error
        console.error(error) if Tower.debug
        null

    # @param [String] type 'script', 'stylesheet', 'template'
    selectPaths: (pathStart, pathEnd, type = 'script') ->
      key     = @_pathCacheKey(pathStart, pathEnd)
      paths   = @pathsByType[key]

      return paths if paths?

      paths   = []

      wrench  = Tower.module('wrench')
      pattern = @_typeToPattern[type]

      for requirePath, index in @_buildRequirePaths(pathStart, pathEnd)
        # The first path we only want the non ./client files
        continue unless fs.existsSync(requirePath)
        if index == 0
          clientDir = new RegExp(_.regexpEscape(_path.join(requirePath, 'client')), 'g')
          paths = paths.concat _.select @_selectNestedPaths(requirePath, wrench.readdirSyncRecursive(requirePath)), (path) ->
            !path.match(clientDir)
        else
          paths = paths.concat @_selectNestedPaths(requirePath, wrench.readdirSyncRecursive(requirePath))

      @pathsByType[key] = _.select paths, (path) -> path.match(pattern)

    _selectNestedPaths: (dir, paths) ->
      _.select _.map(paths, (path) ->
        _path.join(dir, path)
      ), (path) ->
        !fs.statSync(path).isDirectory()

    # Paths to match against
    _typeToPattern:
      script:     /\.(coffee|js|iced)$/
      stylesheet: /\.(css|less|styl|sass)$/
      template:   /\.(jade|ejs|handlebars|html|eco|coffee)/

    _pathCacheKey: (pathStart, pathEnd) ->
      key     = pathStart
      key += ",#{pathEnd}" if pathEnd?
      key

module.exports = Tower.Application
