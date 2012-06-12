Ember.Map::toArray = ->
  _.values(@values)

global.T = Tower

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
  _:                _
  subscribe: ->
    Tower.Application.instance().subscribe arguments...

  cb: ->


  notifyConnections: (action, records) ->
    for sessionId, connection of Tower.connections
      connection.notify(action, records)

  connections: {}

  createConnection: (socket) ->
    connection = Tower.Net.Connection.create().setProperties(socket: socket)
    @connections[connection.toString()] = connection

  toMixin: ->
    #mixin: ->
    #  Tower.mixin @, arguments...

    #extend: ->
    #  Tower.extend @, arguments...

    include: ->
      Tower.include @, arguments...

    className: ->
      _.functionName(@)
      
    computed: (key, block) ->
      object = {}
      object[key] = Ember.computed(block)
      @reopen(object)

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
  #     Tower.hook "Tower.Store.Mongodb.load", after: "config.locales"
  #     Tower.callback "initialize", name: "addRoutingPaths", after: "config.locales"
  # Uses Tower.Support.Callback internally
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
  #  location        = new Tower.Net.Url(url)
  #  request         = new Tower.Net.Request(url: url, location: location, method: method)
  #  response        = new Tower.Net.Response(url: url, location: location, method: method)
  #  request.query   = location.params
  #  Tower.Application.instance().handle request, response, ->
  #    callback.call @, @response

  raise: ->
    throw new Error(Tower.t(arguments...))

  t: ->
    Tower.Support.I18n.translate(arguments...)

  l: ->
    Tower.Support.I18n.localize(arguments...)

  stringify: ->
    string = _.args(arguments).join("_")
    switch Tower.case
      when "snakecase"
        Tower.Support.String.underscore(string)
      else
        Tower.Support.String.camelize(string)

  namespace:  ->
    Tower.Application.instance().constructor.className()

  module: (namespace) ->
    node    = Tower.namespaces[namespace]
    return node if node
    parts   = namespace.split(".")
    node    = Tower

    for part in parts
      node  = node[part] ||= {}

    Tower.namespaces[namespace] = node

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
