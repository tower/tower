class Tower.Factory
  @definitions: {}

  @clear: ->
    @definitions = {}

  @define: (name, options, callback) ->
    @definitions[name] = new Tower.Factory(name, options, callback)

  @create: (name, options, callback) ->
    @get(name).create(options, callback)

  @build: (name, options, callback) ->
    @get(name).build(options, callback)

  @get: (name) ->
    factory = Tower.Factory.definitions[name]
    throw new Error("Factory '#{name}' doesn't exist.") unless factory
    factory

  constructor: (name, options = {}, callback) ->
    return Tower.Factory.create(name, options) unless @constructor == Tower.Factory

    if typeof(options) == 'function'
      callback  = options
      options   = {}

    throw new Error("Expected function callback for Factory '#{name}'") unless typeof(callback) == 'function'

    @name             = name
    @className        = Tower.namespaced(Tower.SupportString.camelize(options.className || name))
    @parentClassName  = options.parent
    @callback         = callback

  toClass: ->
    parts = @className.split(".")
    fn    = global
    fn    = fn[node] for node in parts

    throw new Error("Class #{string} not found") if typeof(fn) != 'function'

    fn

  create: (overrides, callback) ->
    if typeof overrides == 'function'
      callback      = overrides
      overrides     = {}

    overrides     ||= {}

    @buildAttributes overrides, (error, attributes) =>
      klass         = @toClass()
      result        = klass.build()
      result.setProperties(attributes)
      if result.save
        result.save =>
          callback.call @, error, result if callback
      else
        callback.call @, error, result if callback

      result

  buildAttributes: (overrides, callback) ->
    if @callback.length
      # async
      @callback.call @, (error, attributes) =>
        callback.call @, error, _.extend(attributes, overrides)
    else
      callback.call @, null, _.extend(@callback.call(@), overrides)

  build: (overrides, callback) ->
    if typeof overrides == 'function'
      callback      = overrides
      overrides     = {}

    overrides     ||= {}

    @buildAttributes overrides, (error, attributes) =>
      klass         = @toClass()
      result        = klass.build()
      result.setProperties(attributes)
      callback.call(@, error, result) if callback
      result

module.exports = Tower.Factory
