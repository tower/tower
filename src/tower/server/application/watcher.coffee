File    = require('pathfinder').File
_path   = require('path')

# @module
Tower.Application.Watcher =
  reloadMap:
    models:
      pattern:  /app\/models/
      paths:    []
    controllers:
      pattern:  /app\/controllers/
      paths:    []
    helpers:
      pattern:  /app\/helpers/
      paths:    []

  watch: ->
    # this should use hook.io so we don't have to parse the log file...
    forever = require('forever')

    child = new (forever.Monitor)('node_modules/design.io/bin/design.io',
      max:    1
      silent: false
      options: [] # todo for design.io: `['-d', "#{Tower.root}", "-w", "#{Tower.root}/Watchfile"]`
    )

    child.start()

    child.on 'stdout', (data) =>
      data = data.toString()
      try
        # [Sat, 18 Feb 2012 22:49:33 GMT] INFO updated public/stylesheets/vendor/stylesheets/bootstrap/reset.css
        data.replace /\[([^\]]+)\] (\w+) (\w+) (.+)/, (_, date, type, action, path) =>
          path  = path.split('\u001b[0m')[0]
          ext   = path.match(/\.(\w+)$/g)
          ext   = ext[0] if ext
          if ext && ext.match(/(js|coffee|iced)/) && !path.match(/^public/) && action.match(/(updated|deleted)/)
            @fileChanged(path)
          _
      catch error
        console.log error.stack
        @

    child.on 'error', (error) =>
      console.log error

    forever.startServer(child)

  fileChanged: (path) ->
    # this is a tmp solution, more robust coming later.
    if path.match(/app\/views/)
      Tower.View.cache = {}
    else if path.match(/app\/helpers/)
      @reloadPath path, =>
        @reloadPaths "#{Tower.root}/app/controllers"
    else if path.match(/config\/assets.coffee/)
      @reloadPath path, (error, config) =>
        Tower.config.assets = config || {}
        Tower.Application.Assets.loadManifest()
    else if path.match(/app\/(models|controllers)\/.+\.(?:coffee|js|iced)/)
      directory = "app/#{RegExp.$1}"
      # todo, clean up
      # reload all subclasses of changed class
      klass = path.split('/')
      klass = klass[klass.length - 1]
      klass = klass.split('.')
      klass.pop()
      klass = klass.join('.')
      subclasses = Tower.constant(Tower.modules._.camelize(klass)).subclasses.getEach('__name__')

      for name, index in subclasses
        subclasses[index] = "#{directory}/#{Tower.modules._.camelize(name, true)}"

      @reloadPath path, =>
        @reloadPaths subclasses
    else if path.match(/config\/routes\.(?:coffee|js|iced)/)
      @reloadPath(path)
    else if path.match(/config\/locales\/(\w+)\.(?:coffee|js|iced)/)
      language = RegExp.$1
      @reloadPath path, (error, locale) =>
        Tower.Support.I18n.load(locale, language)

  reloadPath: (path, callback) ->
    path = require.resolve(_path.resolve(Tower.root, _path.relative(Tower.root, path)))
    delete require.cache[path]

    process.nextTick ->
      result = require(path)
      callback(null, result) if callback

  reloadPaths: (directory, callback) ->
    for path in File.files(directory)
      if path.match(/\.(?:coffee|js|iced)$/)
        @reloadPath(path)

    if callback
      process.nextTick ->
        callback()