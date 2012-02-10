class Tower.Model.Field
  constructor: (owner, name, options = {}) ->
    @owner    = owner
    @name     = key = name
    @type     = options.type || "String"
    if typeof @type != "string"
      @type   = "Array"
    @_default = options.default
    @_encode  = options.encode
    @_decode  = options.decode
    
    if Tower.accessors
      Object.defineProperty @owner.prototype, name,
        enumerable: true
        configurable: true
        get: -> @get(key)
        set: (value) -> @set(key, value)
    
  defaultValue: (record) ->
    _default = @_default
    
    if Tower.Support.Object.isArray(_default)
      _default.concat()
    else if Tower.Support.Object.isHash(_default)
      Tower.Support.Object.extend({}, _default)
    else if typeof(_default) == "function"
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
    
module.exports = Tower.Model.Field
