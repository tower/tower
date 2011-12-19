Coach.Model.Fields =
  #included: ->
  #  @key "id"
    
  ClassMethods:
    # key "tags", encode: "encodeTags", decode: (value) -> value.split(/\s+,/)
    # encodeTags: (value) ->
    field: (name, options) ->
      @fields()[name] = new Coach.Model.Field(@, name, options)
    
    fields: ->
      @_fields ||= {}
      
    schema: -> @fields()
      
  InstanceMethods:
    get: (name) ->
      @attributes[name] = @constructor.fields()[name].defaultValue(@) unless @has(name)
      @attributes[name]
    
    set: (name, value) ->
      beforeValue       = @_attributeChange(name, value)
      @attributes[name] = value
      #@fire("change", beforeValue: beforeValue, value: value)# if @hasEventListener("change")
      value
      
    has: (name) ->
      @attributes.hasOwnProperty(name)
  
module.exports = Coach.Model.Fields
