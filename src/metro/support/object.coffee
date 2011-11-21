Metro.Support.Object =
  defineProperty: (object, key, options = {}) ->
    Object.defineProperty object, key, options
  
  functionName: (fn) ->
    return fn.__name__ if fn.__name__
    return fn.name if fn.name
    fn.toString().match(/\W*function\s+([\w\$]+)\(/)?[1]
  
  alias: (object, to, from) ->
    object[to] = object[from]
  
  accessor: (object, key, callback) ->
    object._accessors ||= []
    object._accessors.push(key)
    @getter(key, object, callback)
    @setter(key, object)
    
    @

  setter: (object, key) ->
    unless object.hasOwnProperty("_setAttribute")
      @defineProperty object, "_setAttribute", 
        enumerable: false, 
        configurable: true, 
        value: (key, value) -> 
          @["_#{key}"] = value
    
    object._setters ||= []
    object._setters.push(key)
    
    @defineProperty object, key, 
      enumerable: true, 
      configurable: true, 
      set: (value) -> 
        @["_setAttribute"](key, value)
        
    @
        
  getter: (object, key, callback) ->
    unless object.hasOwnProperty("_getAttribute")
      @defineProperty object, "_getAttribute", 
        enumerable: false, 
        configurable: true, 
        value: (key) -> 
          @["_#{key}"]
      
    object._getters ||= []
    object._getters.push(key)
    
    @defineProperty object, key, 
      enumerable: true, 
      configurable: true,
      get: ->
        @["_getAttribute"](key) || (@["_#{key}"] = callback.apply(@) if callback)
        
    @
    
  variables: (object) ->
  
  accessors: (object) ->
  
  methods: (object) ->
    result = []
    for key, value of object
      result.push(key) if @isFunction(value)
    result
  
  delegate: (object, keys..., options = {}) ->
    to          = options.to
    isFunction  = @isFunction(object)
    
    for key in keys
      if isFunction
        object[key] = ->
          @[to]()[key](arguments...)
      else
        @defineProperty object, key, 
          enumerable: true, 
          configurable: true, 
          get: -> @[to]()[key]
    
    from
    
  isFunction: (object) ->
    !!(object && object.constructor && object.call && object.apply)
  
  isA: (object, isa) ->
    
  isHash: ->
    object = arguments[0] || @
    _.isObject(object) && !(_.isFunction(object) || _.isArray(object))
  
  isPresent: (object) ->
    !@isBlank(object)
  
  isBlank: (object) ->
    return false for key, value of object
    return true
    
  has: (object, key) ->
    object.hasOwnProperty(key)