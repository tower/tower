App.watchers =
  stylesheets:
    nodes: {}

    create: (data) ->
      @update(data)

    update: (data) ->
      nodes = @nodes

      if nodes[data.path]?
        node = nodes[data.path]
      else
        node = $("link[href='#{data.url}']")

      data.url = null # tmp, until grunt watcher gets better/faster
      
      if node
        if data.url
          node.attr("href", "#{data.url}?#{(new Date()).getTime().toString()}")
        else
          newNode = $("<style id='#{data.path}' type='text/css'>#{data.content}</style>")
          node.replaceWith(newNode)
          node = newNode
      else
        node = $("<style id='#{data.path}' type='text/css'>#{data.content}</style>")
        $("body").append(node)
      
      nodes[data.path] = node

    destroy: (data) ->
      @nodes[data.path].remove() if @nodes[data.path]?

  # @todo
  javascripts:
    create: (data) ->

    update: (data) ->
      eval("(function() { #{data.content} })")()

  # Call this once the web socket connection is established.
  # Temporarily this is hacked in with a timer.
  watch: ->
    # This is called if you have your browser open and restart the server.
    Tower.connection.on 'fileCreated', (data) =>
      @_handle('create', data)

    # This is called if you modify a file.
    Tower.connection.on 'fileUpdated', (data) =>
      @_handle('update', data)

  _handle: (action, data) ->
    data = JSON.parse(data, @_jsonReviver)

    if data.path.match(/\.js$/)
      @javascripts[action](data)
    else if data.path.match(/\.css$/)
      @stylesheets[action](data)

  # Allows you to pass regexps and functions to json
  _jsonReviver: (key, value) ->
    if typeof value == "string" && 
    !!value.match(/^(?:\(function\s*\([^\)]*\)\s*\{|\(\/)/) && 
    !!value.match(/(?:\}\s*\)|\/\w*\))$/)
      eval(value)
    else
      value
