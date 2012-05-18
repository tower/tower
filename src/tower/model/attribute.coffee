class Tower.Model.Attribute
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

    @type           = type = options.type || 'String'

    if typeof type != 'string'
      @itemType     = type[0]
      @type         = type = 'Array'

    @encodingType = switch type
      when 'Id', 'Date', 'Array', 'String', 'Integer', 'Float', 'BigDecimal', 'Time', 'DateTime', 'Boolean', 'Object', 'Number', 'Geo'
        type
      else
        'Model'

    @_setDefault(options)
    @_defineAccessors(options)
    @_defineAttribute(options)
    @_addValidations(options)
    @_addIndex(options)

  _setDefault: (options) ->
    @_default = options.default

    unless @_default
      if @type == 'Geo'
        @_default = lat: null, lng: null
      else if @type == 'Array'
        @_default = []

  _defineAccessors: (options) ->
    name        = @name
    type        = @type

    serializer  = Tower.Store.Serializer[type]

    @get        = options.get || (serializer.from if serializer)
    @set        = options.set || (serializer.to if serializer)

    @get        = "get#{_.camelize(name)}" if @get == true
    @set        = "set#{_.camelize(name)}" if @set == true

    #if Tower.accessors
    #  Object.defineProperty @owner.prototype, name,
    #    enumerable: true
    #    configurable: true
    #    get: -> @get(name)
    #    set: (value) -> @set(name, value)

  _defineAttribute: (options) ->
    name      = @name
    attribute = {}
    field     = @

    attribute[name] = Ember.computed((key, value) ->
      if arguments.length is 2
        data = Ember.get(@, 'data')
        data.set(key, field.encode(value, @))
      else
        data  = Ember.get(@, 'data')
        value = data.get(key)
        value = field.defaultValue(@) if value == undefined
        field.decode(value, @)

    ).property('data').cacheable()

    #@owner.prototype[name] = attribute[name]
    @owner.reopen(attribute)

  _addValidations: (options) ->
    validations           = {}

    for key, normalizedKey of Tower.Model.Validator.keys
      validations[normalizedKey] = options[key] if options.hasOwnProperty(key)

    @owner.validates @name, validations if _.isPresent(validations)

  _addIndex: (options) ->
    type  = @type
    name  = @name

    if type == 'Geo' && !options.index
      index       = {}
      index[name] = '2d'
      options.index = index

    if options.index
      if options.index == true
        @owner.index(@name)
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
    else if typeof(_default) == 'function'
      _default.call(record)
    else
      _default

  encode: (value, binding) ->
    @code @set, value, binding

  decode: (value, binding) ->
    @code @get, value, binding

  code: (type, value, binding) ->
    switch typeof type
      when 'string'
        binding[type].call binding[type], value
      when 'function'
        type.call binding, value
      else
        value

module.exports = Tower.Model.Attribute
