class Tower.Factory
  @definitions: {}
  
  @clear: ->
    @definitions = {}
  
  @define: (name, options, callback) ->
    @definitions[name] = new Tower.Factory(name, options, callback)
  
  @create: (name, options) ->
    factory = Tower.Factory.definitions[name]
    throw new Error("Factory '#{name}' doesn't exist.") unless factory
    factory.create(options)
    
  constructor: (name, options = {}, callback) ->
    return Tower.Factory.create(name, options) unless @constructor == Tower.Factory
    
    if typeof(options) == "function"
      callback  = options
      options   = {}
    
    throw new Error("Expected function callback for Factory '#{name}'") unless typeof(callback) == "function"
    
    @name             = name
    @className        = Tower.namespaced(Tower.Support.String.camelize(options.className || name))
    @parentClassName  = options.parent
    @callback         = callback
    
  toClass: ->
    parts = @className.split(".")
    fn    = global
    fn    = fn[node] for node in parts
    
    throw new Error("Class #{string} not found") if typeof(fn) != "function"
    
    fn
    
  create: (overrides, callback) ->
    if typeof overrides == "function"
      callback      = overrides
      overrides     = {}

    overrides     ||= {}
    
    @createAttributes overrides, (error, attributes) =>
      klass         = @toClass()
      result        = new klass(attributes)
      callback.call @, error, result if callback
      result
      
  createAttributes: (overrides, callback) ->
    if @callback.length
      # async
      @callback.call @, (error, attributes) =>
        callback.call @, error, _.extend(attributes, overrides)
    else
      callback.call @, null, _.extend(@callback.call(@), overrides)

module.exports = Tower.Factory
