Metro.Model.Attributes =
  included: ->
    @keys = {}
    
    @key "id"
    
  ClassMethods:
    key: (key, options = {}) ->
      @keys[key] = new Metro.Model.Attribute(key, options)
      
      Object.defineProperty @prototype, key, 
        enumerable: true
        configurable: true
        get: -> @get(key)
        set: (value) -> @set(key, value)
      
      @
    
    attributeDefinition: (name) ->
      definition = @keys[name]
      throw new Error("Attribute '#{name}' does not exist on '#{@name}'") unless definition
      definition
      
  InstanceMethods:
    typeCast: (name, value) ->
      @constructor.attributeDefinition(name).typecast(value)
    
    get: (name) ->
      @attributes[name] ||= @constructor.keys[name].defaultValue(@)
    
    set: (name, value) ->
      beforeValue       = @attributes[name]
      @attributes[name] = value
      @_attributeChange(beforeValue, value)
      value
      #@emit("fieldChanged", beforeValue: beforeValue, value: value)
  
module.exports = Metro.Model.Attributes
