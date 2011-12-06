Metro.Model.Attributes =
  #included: ->
  #  @key "id"
    
  ClassMethods:
    key: (key, options = {}) ->
      @keys()[key] = new Metro.Model.Attribute(key, options)
      
      if Metro.accessors
        Object.defineProperty @prototype, key, 
          enumerable: true
          configurable: true
          get: -> @get(key)
          set: (value) -> @set(key, value)
      
      @
      
    keys: ->
      @_keys ||= {}
      
    attribute: (name) ->
      attribute = @keys()[name]
      throw new Error("Attribute '#{name}' does not exist on '#{@name}'") unless attribute
      attribute
      
  InstanceMethods:
    typecast: (name, value) ->
      @constructor.attribute(name).typecast(value)
    
    get: (name) ->
      @attributes[name] ||= @constructor.attribute(name).defaultValue(@)
    
    set: (name, value) ->
      @_attributeChange(name, value)
      @attributes[name] = value
      value
      #@emit("fieldChanged", beforeValue: beforeValue, value: value)
      
    toUpdates: ->
      result      = {}
      attributes  = @attributes
      
      for key, array of @changes
        result[key] = attributes[key]
      
      result
  
module.exports = Metro.Model.Attributes
