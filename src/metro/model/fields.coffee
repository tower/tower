Metro.Model.Fields =
  #included: ->
  #  @key "id"
    
  ClassMethods:
    # key "tags", encode: "encodeTags", decode: (value) -> value.split(/\s+,/)
    # encodeTags: (value) ->
    
    field: (key, options = {}) ->
      @fields()[key] = new Metro.Model.Field(key, options)
      
      if Metro.accessors
        Object.defineProperty @prototype, key, 
          enumerable: true
          configurable: true
          get: -> @get(key)
          set: (value) -> @set(key, value)
      
      @
      
    fields: ->
      @_fields ||= {}
    
    field: (name) ->
      field = @fields()[name]
      throw new Error("Field '#{name}' does not exist on '#{@name}'") unless field
      field
      
  InstanceMethods:
    get: (name) ->
      @attributes[name] = @constructor.field(name).defaultValue(@) unless @fields.hasOwnProperty(name)
      @attributes[name]
    
    set: (name, value) ->
      beforeValue       = @_fieldChange(name, value)
      @attributes[name] = value
      value
      @fire("change", beforeValue: beforeValue, value: value)# if @hasEventListener("change")
      
    toUpdates: ->
      result      = {}
      attributes  = @attributes
      
      for key, array of @changes
        result[key] = attributes[key]
      
      result
      
    hasAttribute: (name) ->
      @attributes.hasOwnProperty(name)
  
module.exports = Metro.Model.Fields
