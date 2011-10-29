class Attributes
  @key: (key, options = {}) ->
    @keys()[key] = new Metro.Model.Attribute(key, options)
    
    Object.defineProperty @prototype, key, 
      enumerable: true
      configurable: true
      get: -> @getAttribute(key)
      set: (value) -> @setAttribute(key, value)
      
    @
    
  @keys: ->
    @_keys ?= {}
    
  @attributeDefinition: (name) ->
    definition = @keys()[name]
    throw new Error("Attribute '#{name}' does not exist on '#{@name}'") unless definition
    definition
    
  typeCast: (name, value) ->
    @constructor.attributeDefinition(name).typecast(value)
  
  typeCastAttributes: (attributes) ->
    for key, value of attributes
      attributes[key] = @typeCast(key, value)
    attributes
  
  getAttribute: (name) ->
    @attributes[name] ?= @constructor.keys()[name].defaultValue(@)
    
  @alias "get", "getAttribute" unless @hasOwnProperty("get")
  
  setAttribute: (name, value) ->
    beforeValue = @_trackChangedAttribute(name, value)
    @attributes[name] = value
    #@emit("fieldChanged", beforeValue: beforeValue, value: value)
    
  @alias "set", "setAttribute" unless @hasOwnProperty("set")
  
module.exports = Attributes
