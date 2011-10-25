# https://github.com/Wolfy87/EventEmitter/blob/master/src/EventEmitter.js
# https://github.com/jeromeetienne/microevent.js/blob/master/microevent.js#L12-31

class Attributes
  @key: (key, options) ->
    @keys()[key] = options
    
    Object.defineProperty @prototype, key, enumerable: true, configurable: true, 
      get: -> @getField(key)
      set: (value) -> @setField(key, value)
    
    @
    
  @keys: ->
    @_keys ?= {}
  
  constructor: ->
    @attributes = {}
    @changes    = {}
  
  getField: (name) ->
    @fields[name]
    
  @alias "get", "getField" unless @hasOwnProperty("get")
  
  setField: (name, value) ->
    beforeValue = @_trackChangedAttribute(attribute, value)
    @attributes[name] = value
    @emit("fieldChanged", beforeValue: beforeValue, value: value)
    
  @alias "set", "setField" unless @hasOwnProperty("set")
  
  _trackChangedAttribute: (attribute, value) ->
    array = @changes[attribute] ?= []
    beforeValue = array[0] ?= @attributes[attribute]
    array[1] = value
    array = null if array[0] == array[1]
    if array
      @changes[attribute] = array
    else
      delete @changes[attribute]
      
    beforeValue
  
module.exports = Metro.Model.Attributes = Attributes
