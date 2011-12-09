Metro.Model.Attributes =
  #included: ->
  #  @key "id"
    
  ClassMethods:
    key: (key, options = {}) ->
      @attributes()[key] = new Metro.Model.Attribute(key, options)
      
      if Metro.accessors
        Object.defineProperty @prototype, key, 
          enumerable: true
          configurable: true
          get: -> @get(key)
          set: (value) -> @set(key, value)
      
      @
      
    attributes: ->
      @_attributes ||= {}
      
    attribute: (name) ->
      attribute = @attributes()[name]
      throw new Error("Attribute '#{name}' does not exist on '#{@name}'") unless attribute
      attribute
      
    typecast: (name, value) ->
      attribute = @attributes()[name]
      if attribute
        attribute.typecast(value)
      else
        value
      
  InstanceMethods:
    typecast: (name, value) ->
      @constructor.typecast(name, value)
    
    get: (name) ->
      @attributes[name] = @constructor.attribute(name).defaultValue(@) unless @attributes.hasOwnProperty(name)
      @attributes[name]
    
    set: (name, value) ->
      beforeValue = @_attributeChange(name, value)
      @attributes[name] = value
      value
      @fire("change", beforeValue: beforeValue, value: value)# if @hasEventListener("change")
      
    toUpdates: ->
      result      = {}
      attributes  = @attributes
      
      for key, array of @changes
        result[key] = attributes[key]
      
      result
  
module.exports = Metro.Model.Attributes
