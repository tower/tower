Tower.Model.Fields =
  ClassMethods:
    field: (name, options) ->
      @fields()[name] = new Tower.Model.Field(@, name, options)
    
    fields: ->
      @_fields ||= {}
      
  get: (name) ->
    unless @has(name)
      field = @constructor.fields()[name]
      @attributes[name] = field.defaultValue(@) if field
      
    @attributes[name]
  
  set: (name, value) ->
    beforeValue       = @_attributeChange(name, value)
    @attributes[name] = value
    value
    
  has: (name) ->
    @attributes.hasOwnProperty(name)
    
  assignAttributes: (attributes) ->
    @set(name, value) for key, value of attributes
    @
  
module.exports = Tower.Model.Fields
