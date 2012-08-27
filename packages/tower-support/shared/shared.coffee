Ember.Map::toArray = ->
  Tower._.values(@values)

#global.T = Tower
_ = global._

_.extend Tower,
  nativeExtensions: true
  env:              "development"
  port:             3000
  client:           typeof(window) != "undefined"
  isClient:         typeof(window) != "undefined"
  isServer:         typeof(window) == "undefined"
  root:             "/"
  publicPath:       "/"
  case:             "camelcase"
  accessors:        typeof(window) == "undefined"
  logger:           if typeof(_console) != 'undefined' then _console else console
  structure:        "standard"
  config:           {}
  namespaces:       {}
  metadata:         {}
  tryRequire: (paths) ->
    paths = _.flatten(paths)
    for path in paths
      try
        return require(path)
      catch error
        @
  # @todo
  # isTest: false
  # isDevelopment: false
  # isProduction: false
  _:                _
  subscribe: ->
    Tower.Application.instance().subscribe arguments...

  cb: ->


  notifyConnections: (action, records, callback) ->
    for sessionId, connection of Tower.connections
      connection.notify(action, records, callback)

  connections: {}

  createConnection: (socket) ->
    connection = Tower.NetConnection.create().setProperties(socket: socket)
    @connections[connection.toString()] = connection

  # @todo This should be a wrapper for benchmark.js.
  # 
  # @example
  #   Tower.bench 'create', (done) =>
  #     App.Post.create(done)
  #   Tower.bench 'require("tower")', =>
  #     require('tower')
  bench: (name, block) ->
    if typeof name == 'function'
      block = name
      name  = null
    if block.length
      startDate = new Date()
      block (result) =>
        endDate = new Date()
        console.log name, String(endDate - startDate) + 'ms'
        result
    else
      startDate = new Date()
      result    = block()
      endDate   = new Date()
      console.log name, String(endDate - startDate) + 'ms'
      result

  toMixin: ->
    #mixin: ->
    #  Tower.mixin @, arguments...

    #extend: ->
    #  Tower.extend @, arguments...

    include: ->
      Tower.include @, arguments...

    className: ->
      Tower._.functionName(@)

    build: (attributes) ->
      object = @create()
      object.setProperties(attributes) if attributes
      object
      
    computed: (key, block) ->
      object = {}
      object[key] = Ember.computed(block)
      @reopen(object)

    get: (key) ->
      Ember.get(@, key)

    set: (key, value) ->
      Ember.set(@, key, value)

  # @todo find ideal place for this
  cursors: {} # Ember.Map.create()

  # Want to figure out how to do this with ember observers sometime.
  addCursor: (cursor) ->
    types     = Ember.get(cursor, 'observableTypes')

    Tower.cursors[Ember.guidFor(cursor)] = cursor

    for type in types
      cursors   = Tower.cursors[type]

      unless cursors
        cursors = Tower.cursors[type] = {}
      
      # @todo getPath -> get when it's changed in cursor
      fieldNames = Ember.get(cursor, 'observableFields')

      for fieldName in fieldNames
        cursors[fieldName] = cursor

    cursor

  removeCursor: (cursor) ->
    types     = Ember.get(cursor, 'observableTypes')

    delete Tower.cursors[Ember.guidFor(cursor)]

    for type in types
      cursors   = Tower.cursors[type]

      if cursors
        # @todo getPath -> get when it's changed in cursor
        fieldNames = Ember.get(cursor, 'observableFields')
        
        for fieldName in fieldNames
          delete cursors[fieldName]

    cursor

  getCursor: (path) ->
    # @todo tmp, ember 1.0 changed api, server is using older version of ember.
    if Tower.isClient
      Ember.get(Tower.cursors, path)
    else
      Ember.getPath(Tower.cursors, path)

  notifyCursorFromPath: (path) ->
    cursor = Tower.getCursor(path)

    cursor.refresh() if cursor

    delete Tower.cursorsToUpdate[path]

    cursor

  # If this is false, you must manually call
  # `Tower.notifyCursors()` or `Tower.notifyCursor('SomeModel.fieldName')`
  autoNotifyCursors: true

  cursorsToUpdate: {}

  # Should do some Ember.runLoop stuff here.
  cursorNotification: (path) ->
    Tower.cursorsToUpdate[path] = true

    if Tower.autoNotifyCursors
      Ember.run.schedule('sync', @, @notifyCursors)

  notifyCursors: ->
    cursors = {}

    for path of Tower.cursorsToUpdate
      cursor = Tower.getCursor(path)
      # this just makes it so we don't run the same one twice
      cursors[Ember.guidFor(cursor)] = cursor if cursor

    Tower.cursorsToUpdate = {}

    for guid, cursor of cursors
      cursor.refresh()

  #extend: (self, object) ->
  #  extended = object.extended
  #  delete object.extended
  #
  #  self.reopenClass object
  #
  #  extended.apply(object) if extended
  #
  #  object

  include: (self, object) ->
    included        = object.included
    ClassMethods    = object.ClassMethods
    InstanceMethods = object.InstanceMethods

    delete object.included
    delete object.ClassMethods
    delete object.InstanceMethods

    self.reopenClass(ClassMethods) if ClassMethods
    self.include(InstanceMethods) if InstanceMethods

    self.reopen object

    object.InstanceMethods  = InstanceMethods
    object.ClassMethods     = ClassMethods

    included.apply(self) if included

    object

  metadataFor: (name) ->
    @metadata[name] ||= {}

  # @example
  #     Tower.hook "Tower.StoreMongodb.load", after: "config.locales"
  #     Tower.callback "initialize", name: "addRoutingPaths", after: "config.locales"
  # Uses Tower.SupportCallback internally
  callback: ->
    Tower.Application.callback arguments...

  runCallbacks: ->
    Tower.Application.instance().runCallbacks arguments...

  #sync: (method, records, callback) ->
  #  callback null, records if callback
  #
  #get: ->
  #  Tower.request "get", arguments...
  #
  #post: ->
  #  Tower.request "post", arguments...
  #
  #put: ->
  #  Tower.request "put", arguments...
  #
  #destroy: ->
  #  Tower.request "delete", arguments...
  #
  #request: (method, path, options, callback) ->
  #  if typeof options == "function"
  #    callback      = options
  #    options       = {}
  #  options       ||= {}
  #  url             = path
  #  location        = new Tower.NetUrl(url)
  #  request         = new Tower.NetRequest(url: url, location: location, method: method)
  #  response        = new Tower.NetResponse(url: url, location: location, method: method)
  #  request.query   = location.params
  #  Tower.Application.instance().handle request, response, ->
  #    callback.call @, @response

  raise: ->
    throw new Error(Tower.t(arguments...))

  t: ->
    Tower.SupportI18n.translate(arguments...)

  l: ->
    Tower.SupportI18n.localize(arguments...)

  stringify: ->
    string = Tower._.args(arguments).join("_")
    switch Tower.case
      when "snakecase"
        _.underscore(string)
      else
        _.camelize(string)

  namespace:  ->
    Tower.Application.instance().toString()#.constructor.className()

  modules: {}

  # The client and server both define a Tower._modules, 
  # which is a function lazily returning the module.
  module: (name) ->
    Tower.modules[name] ||= Tower._modules[name]()

  constant: (string) ->
    node  = global
    parts = string.split(".")

    try
      for part in parts
        node = node[part]
    catch error
      # try doing namespace version as last resort
      node = null
    unless node
      namespace = Tower.namespace()
      if namespace && parts[0] != namespace
        node = Tower.constant("#{namespace}.#{string}")
      else
        throw new Error("Constant '#{string}' wasn't found")
    node

  namespaced: (string) ->
    namespace = Tower.namespace()
    if namespace
      "#{namespace}.#{string}"
    else
      string

  async: (array, iterator, callback) ->
    @series array, iterator, callback

  each: (array, iterator) ->
    if array.forEach
      array.forEach iterator
    else
      for item, index in array
        iterator(item, index, array)

  series: (array, iterator, callback = ->) ->
    return callback() unless array.length
    completed = 0
    iterate = ->
      iterator array[completed], (error) ->
        if error
          callback error
          callback = ->
        else
          completed += 1
          if completed == array.length
            callback()
          else
            iterate()

    iterate()

  parallel: (array, iterator, callback = ->) ->
    return callback() unless array.length
    completed = 0
    iterate = ->
    Tower.each array, (x) ->
      iterator x, (error) ->
        if error
          callback error
          callback = ->
        else
          completed += 1
          if completed == array.length
            callback()

  callbackChain: (callbacks...) ->
    (error) =>
      for callback in callbacks
        callback.call(@, error) if callback

  get: ->
    Tower.request 'get', arguments...

  post: ->
    Tower.request 'post', arguments...

  put: ->
    Tower.request 'put', arguments...

  destroy: ->
    Tower.request 'destroy', arguments...

  request: ->
    Tower.agent.request arguments...
