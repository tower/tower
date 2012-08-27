File    = require('pathfinder').File
_path   = require('path')
fs      = require('fs')
_       = Tower._

# @module
Tower.ApplicationWatcher =
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

  # @todo
  checkIfGruntIsWatching: ->
    return
    # this should use hook.io so we don't have to parse the log file...
    forever = require('forever')

    child = new (forever.Monitor)('grunt.coffee',
      max:    1
      silent: false
      options: [] # todo for design.io: `['-d', "#{Tower.root}", "-w", "#{Tower.root}/Watchfile"]`
    )

    child.start()

    child.on 'stdout', (data) =>

    child.on 'error', (error) =>
      console.log error

    forever.startServer(child)

  watch: ->
    chokidar    = require('chokidar')
    directories = ['app', 'config', 'public']
    clientPath  = new RegExp(_.regexpEscape(_path.join('app', 'client')))

    watcher     = chokidar.watch directories,
      # ignore anything NOT matching js|coffee|iced
      ignored: (path) ->
        if path.match(/\./) # if it's a file
          !path.match(/\.(js|coffee|iced|styl)$/)
        else
          !path.match(/(app|config|public)/) # !path.match(/(app|config|public)/)
      
      persistent: true
    
    watcher.on('add', (path) =>
      @fileCreated(_path.resolve(Tower.root, path))
    ).on('change', (path) =>
      path = _path.resolve(Tower.root, path)
      if fs.existsSync(path)
        if !Tower.Application.instance().isConsole && path.match(Tower.publicPath) || path.match(/\.styl$/)
          @clientFileUpdated(path)
        else
          @fileUpdated(path)
      else
        @fileDeleted(path)
    ).on('unlink', (path) =>
      @fileDeleted(_path.resolve(Tower.root, path))
    ).on 'error', (error) ->
      #console.error "Error happened", error
      @

  clientFileCreated: (path) ->
    @_clientFileChanged('fileCreated', path, fs.readFileSync(path, 'utf-8'))

  clientFileUpdated: (path) ->
    @_clientFileChanged('fileUpdated', path, fs.readFileSync(path, 'utf-8'))

  _clientFileChanged: (action, path, content) ->
    data    = path: _path.relative(Tower.root, path)
    if content?
      # @todo make css, but grunt is pretty slow so this speeds things up
      if path.match(/\.styl$/)
        content = require('mint').stylus content, {}
        data.path = 'stylesheets/' + data.path.replace(/\.styl$/, '.css')
      data.content = content
    data.url = '/' + data.path.replace(new RegExp(_.regexpEscape(_path.sep), 'g'), '/').replace(/^public\//, '')
    Tower.Application.instance().io.sockets.emit(action, JSON.stringify(data, @_jsonReplacer))

  _jsonReplacer: (key, value) ->
    if value instanceof RegExp
      "(function() { return new RegExp('#{value}') })"
    else if typeof value == "function"
      "(#{value})"
    else
      value

  fileCreated: (path) ->
    return if path.match('app/views')
    try
      require.resolve(path) # it will throw an error if it doesn't exist]
    catch error
      require(path)

  fileDeleted: (path) ->
    delete require.cache[require.resolve(path)]

  fileUpdated: (path) ->
    pattern = (string) ->
      new RegExp(_.regexpEscape(string))

    # this is a tmp solution, more robust coming later.
    if path.match(pattern(_path.join('app', 'views')))
      Tower.View.cache = {}
    else if path.match(pattern(_path.join('app', 'helpers')))
      @reloadPath path, =>
        @reloadPaths _path.join(Tower.root, 'app', 'controllers')
    else if path.match(pattern(_path.join('config', 'assets.coffee')))
      @reloadPath path, (error, config) =>
        Tower.config.assets = config || {}
        Tower.ApplicationAssets.loadManifest()
    # @todo somehow need to use _path.sep for windows support
    else if path.match(/app\/(models|controllers)\/.+\.(?:coffee|js|iced)/)
      isController = RegExp.$1 == 'controllers'
      directory = "app/#{RegExp.$1}"
      # todo, clean up
      # reload all subclasses of changed class
      klassName = path.split('/')
      klassName = klassName[klassName.length - 1]
      klassName = klassName.split('.')
      klassName.pop()
      klassName = klassName.join('.')
      klassName = Tower._.camelize(klassName)
      klass = try Tower.constant(klassName)
      # the klass may not exist if you just created a blank file
      # and then defined a model (which means the file was "updated")
      unless klass
        require(path)
      else
        subclasses = klass.subclasses.getEach('__name__')

        for name, index in subclasses
          subclasses[index] = _path.join(directory, Tower._.camelize(name, true))

        @reloadPath path, =>
          @reloadPaths subclasses, =>
            if isController
              @reloadPath('config/routes.coffee')
    else if path.match(/config\/routes\.(?:coffee|js|iced)/)
      @reloadPath(path)
    else if path.match(/config\/locales\/(\w+)\.(?:coffee|js|iced)/)
      language = RegExp.$1
      @reloadPath path, (error, locale) =>
        Tower.SupportI18n.load(locale, language)

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