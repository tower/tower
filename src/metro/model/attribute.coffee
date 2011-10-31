class Metro.Model.Attribute
  constructor: (name, options = {}) ->
    @name = name
    @type = options.type || "string"
    @_default = options.default
    
    @typecastMethod = switch @type
      when Array, "array" then @_typecastArray
      when Date, "date", "time" then @_typecastDate
      when Number, "number", "integer" then @_typecastInteger
      when "float" then @_typecastFloat
      else @_typecastString
    
  typecast: (value) ->
    @typecastMethod.call(@, value)
    
  _typecastArray: (value) ->
    value
    
  _typecastString: (value) ->
    value
    
  _typecastDate: (value) ->
    value
    
  _typecastInteger: (value) ->
    return null if value == null || value == undefined
    parseInt(value)
    
  _typecastFloat: (value) ->
    return null if value == null || value == undefined
    parseFloat(value)
    
  defaultValue: (record) ->
    _default = @_default
    
    switch typeof(_default)
      when 'function'
        _default.call(record)
      else
        _default
    
module.exports = Metro.Model.Attribute
