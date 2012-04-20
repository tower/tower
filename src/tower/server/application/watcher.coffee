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
    forever = require("forever")
    
    child = new (forever.Monitor)("node_modules/design.io/bin/design.io",
      max:    1
      silent: false
      options: [] # todo for design.io: `["-d", "#{Tower.root}", "-w", "#{Tower.root}/Watchfile"]`
    )

    child.start()

    child.on "stdout", (data) =>
      data = data.toString()
      try
        # [Sat, 18 Feb 2012 22:49:33 GMT] INFO updated public/stylesheets/vendor/stylesheets/bootstrap/reset.css
        data.replace /\[([^\]]+)\] (\w+) (\w+) (.+)/, (_, date, type, action, path) =>
          #path  = path.split('\033')[0]
          ext   = path.match(/\.(\w+)$/g)
          ext   = ext[0] if ext
          if ext && ext.match(/(js|coffee|iced)/) && !path.match(/^public/) && action.match(/(updated|deleted)/)
            @fileChanged(path)
          _
      catch error
        @

    child.on "error", (error) =>
      console.log error

    forever.startServer(child)

  fileChanged: (path) ->
    # this is a tmp solution, more robust coming later.
    if path.match(/app\/views/)
      Tower.View.cache = {}
    return unless path.match(/app\/(models|controllers)/)
    path = require.resolve("#{Tower.root}/#{path}")
    delete require.cache[path]
    process.nextTick -> require(path)