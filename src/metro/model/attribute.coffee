class Metro.Model.Attribute
  # @field "title", type: "String", short: "t", default: "Hello"
  # @id "title", "name"
  constructor: (name, type, options = {}) ->
    @name     = name
    @type     = options.type || "string"
    @_default = options.default
    @_encode  = options.encode
    @_decode  = options.decode
    
  defaultValue: (record) ->
    _default = @_default
    
    switch typeof(_default)
      when 'function'
        _default.call(record)
      else
        _default
        
  encode: (value, binding) ->
    @code @_encode, value, binding
    
  decode: (value, binding) ->
    @code @_decode, value, binding
    
  code: (type, value, binding) ->
    switch type
      when "string"
        binding[type].call binding[type], value
      when "function"
        type.call _encode, value
      else
        value
    
module.exports = Metro.Model.Attribute
