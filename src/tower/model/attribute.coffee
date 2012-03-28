class Tower.Model.Attribute
  @string:
    from: (serialized) ->
      if Tower.none(serialized) then null else String(serialized)
      
    to: (deserialized) ->
      if Tower.none(deserialized) then null else String(deserialized)
      
  @number:
    from: (serialized) ->
      if Tower.none(serialized) then null else Number(serialized)

    to: (deserialized) ->
      if Tower.none(deserialized) then null else Number(deserialized)
      
  @integer:
    from: (serialized) ->
      if Tower.none(serialized) then null else parseInt(serialized)
      
    to: (deserialized) ->
      if Tower.none(deserialized) then null else parseInt(deserialized)
      
  @float:
    from: (serialized) ->
      parseFloat(serialized)
      
    to: (deserialized) ->
      deserialized
      
  @decimal: @float
    
  @boolean:
    from: (serialized) ->
      if typeof serialized == "string"
        !!(serialized != "false")
      else
        Boolean(serialized)
      
    to: (deserialized) ->
      Tower.Model.Attribute.boolean.from(deserialized)
      
  @date:
    # from ember.js, tmp
    from: (date) ->
      date
        
    to: (date) ->
      date
      
  @time: @date
  @datetime: @date
        
  @array:
    from: (serialized) ->
      if Tower.none(serialized) then null else Tower.Support.Object.toArray(serialized)
      
    to: (deserialized) ->
      Tower.Model.Attribute.array.from(deserialized)
  
  constructor: (owner, name, options = {}) ->
    @owner        = owner
    @name         = key = name
    @type         = options.type || "String"
    
    if typeof @type != "string"
      @itemType = @type[0]
      @type     = "Array"
    
    @encodingType = switch @type
      when "Id", "Date", "Array", "String", "Integer", "Float", "BigDecimal", "Time", "DateTime", "Boolean", "Object", "Number"
        @type
      else
        "Model"
    
    serializer = Tower.Model.Attribute[Tower.Support.String.camelize(@type, true)]
    
    @_default = options.default
    @get      = options.get || (serializer.from if serializer)
    @set      = options.set || (serializer.to if serializer)
    
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
    @code @set, value, binding

  decode: (value, binding) ->
    @code @get, value, binding

  code: (type, value, binding) ->
    switch typeof type
      when "string"
        binding[type].call binding[type], value
      when "function"
        type.call binding, value
      else
        value

module.exports = Tower.Model.Attribute
