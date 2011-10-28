class Attributes
  @key: (key, options) ->
    @keys()[key] = options
    
    Object.defineProperty @prototype, key, 
      enumerable: true
      configurable: true
      get: -> @getAttribute(key)
      set: (value) -> @setAttribute(key, value)
    
    @
    
  @keys: ->
    @_keys ?= {}
    
  @typeCast: (name, value) ->
  
  getAttribute: (name) ->
    @attributes[name]
    
  @alias "get", "getField" unless @hasOwnProperty("get")
  
  setAttribute: (name, value) ->
    beforeValue = @_trackChangedAttribute(name, value)
    @attributes[name] = value
    #@emit("fieldChanged", beforeValue: beforeValue, value: value)
    
  @alias "set", "setField" unless @hasOwnProperty("set")
  
  constructor: (attrs = {}) ->
    @attributes = attrs
    @changes    = {}
  
module.exports = Attributes
