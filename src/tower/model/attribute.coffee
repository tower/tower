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
      _.toDate(date)

  @time: @date
  @datetime: @date

  @geo:
    from: (serialized) ->
      serialized

    to: (deserialized) ->
      switch _.kind(deserialized)
        when "array"
          lat: deserialized[0], lng: deserialized[1]
        when "object"
          lat: deserialized.lat || deserialized.latitude
          lng: deserialized.lng || deserialized.longitude
        else
          deserialized = deserialized.split(/,\ */)
          lat: parseFloat(deserialized[0]), lng: parseFloat(deserialized[1])

  @array:
    from: (serialized) ->
      if Tower.none(serialized) then null else _.castArray(serialized)

    to: (deserialized) ->
      Tower.Model.Attribute.array.from(deserialized)

  # @option options [Boolean|String|Function] set If `set` is a boolean, it will look for a method
  #   named `"set#{field.name}"` on the prototype.  If it's a string, it will call that method on the prototype.
  #   If it's a function, it will call that function as if it were on the prototype.
  constructor: (owner, name, options = {}, block) ->
    @owner        = owner
    @name         = key = name

    if typeof options == 'string'
      options       = type: options
    else if typeof options == 'function'
      block         = options
      options       = {}

    @type         = options.type || "String"

    if typeof @type != "string"
      @itemType = @type[0]
      @type     = "Array"

    @encodingType = switch @type
      when "Id", "Date", "Array", "String", "Integer", "Float", "BigDecimal", "Time", "DateTime", "Boolean", "Object", "Number", "Geo"
        @type
      else
        "Model"

    serializer = Tower.Model.Attribute[Tower.Support.String.camelize(@type, true)]

    @_default = options.default

    unless @_default
      if @type == "Geo"
        @_default = lat: null, lng: null
      else if @type == 'Array'
        @_default = []

    if @type == 'Geo' && !options.index
      index       = {}
      index[name] = "2d"
      options.index = index

    @get      = options.get || (serializer.from if serializer)
    @set      = options.set || (serializer.to if serializer)

    @get = "get#{Tower.Support.String.camelize(name)}" if @get == true
    @set = "set#{Tower.Support.String.camelize(name)}" if @set == true

    if Tower.accessors
      Object.defineProperty @owner.prototype, name,
        enumerable: true
        configurable: true
        get: -> @get(key)
        set: (value) -> @set(key, value)


    validations           = {}

    for key, normalizedKey of Tower.Model.Validator.keys
      validations[normalizedKey] = options[key] if options.hasOwnProperty(key)

    @owner.validates name, validations if _.isPresent(validations)

    if options.index
      if options.index == true
        @owner.index(name)
      else
        @owner.index(options.index)

  validators: ->
    result = []
    for validator in @owner.validators()
      result.push(validator) if validator.attributes.indexOf(@name) != -1
    result

  defaultValue: (record) ->
    _default = @_default

    if _.isArray(_default)
      _default.concat()
    else if _.isHash(_default)
      _.extend({}, _default)
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
