specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods']

Tower.Support.Object =
  modules: (object) ->
    args = _.args(arguments, 1)

    for node in args
      for key, value of node when key not in specialProperties
        object[key] = value

    object

  cloneHash: (options) ->
    result = {}

    for key, value of options
      if _.isArray(value)
        result[key] = @cloneArray(value)
      else if @isHash(value)
        result[key] = @cloneHash(value)
      else
        result[key] = value

    result

  cloneArray: (value) ->
    result = value.concat()

    for item, i in result
      if _.isArray(item)
        result[i] = @cloneArray(item)
      else if @isHash(item)
        result[i] = @cloneHash(item)

    result

  deepMerge: (object) ->
    args = _.args(arguments, 1)
    for node in args
      for key, value of node when key not in specialProperties
        if object[key] && typeof value == 'object'
          object[key] = Tower.Support.Object.deepMerge(object[key], value)
        else
          object[key] = value
    object

  deepMergeWithArrays: (object) ->
    args = _.args(arguments, 1)

    for node in args
      for key, value of node when key not in specialProperties
        oldValue = object[key]
        if oldValue
          if _.isArray(oldValue)
            object[key] = oldValue.concat value
          else if typeof oldValue == "object" && typeof value == "object"
            object[key] = Tower.Support.Object.deepMergeWithArrays(object[key], value)
          else
            object[key] = value
        else
          object[key] = value

    object

  defineProperty: (object, key, options = {}) ->
    Object.defineProperty object, key, options

  functionName: (fn) ->
    return fn.__name__ if fn.__name__
    return fn.name if fn.name
    fn.toString().match(/\W*function\s+([\w\$]+)\(/)?[1]

  castArray: (object) ->
    if _.isArray(object) then object else [object]

  # @todo
  isA: (object, isa) ->

  isHash: (object) ->
    @isObject(object) && !(@isFunction(object) || @isArray(object) || _.isDate(object) || _.isRegExp(object))

  # If the class is a direct instance of Object,
  # and not an instance of a subclass of Object, then this is true.
  #
  # @return [Boolean]
  isBaseObject: (object) ->
    object && object.constructor && object.constructor.name == "Object"

  # A more robust implementation of `typeof`.
  #
  # Returns a string of the object type. This makes it so you don't have to
  # manually check `if _.isFunction || _.isArray`, etc.
  #
  # @return [String]
  kind: (object) ->
    type = typeof(object)
    switch type
      when "object"
        return "array"      if _.isArray(object)
        return "arguments"  if _.isArguments(object)
        return "boolean"    if _.isBoolean(object)
        return "date"       if _.isDate(object)
        return "regex"      if _.isRegExp(object)
        return "NaN"        if _.isNaN(object)
        return "null"       if _.isNull(object)
        return "undefined"  if _.isUndefined(object)
        return "object"
      when "number"
        return "integer"    if object == +object && object == (object|0)
        return "float"      if object == +object && object != (object|0)
        return "number"
      when "function"
        return "regex"      if _.isRegExp(object)
        return "function"
      else
        return type

  isObject: (object) ->
    return object == Object(object)

  # Checks if the object is "present", defined below.
  #
  # If the object is a String, make sure it's not `""`.
  # If the object is an Object, make sure it has at least one property.
  # If the object is an Array, make sure length > 0.
  # If it's null or undefined, it's blank.
  # Otherwise, it's present.
  #
  # @return [Boolean]
  isPresent: (object) ->
    !@isBlank(object)

  # Checks if the object is "blank", defined below.
  #
  # If the object is a String, make sure it is `""`.
  # If the object is an Object, make sure it doesn't have any properties.
  # If the object is an Array, make sure length == 0.
  # If it's null or undefined, it's blank.
  # Otherwise, it's not blank.
  #
  # @return [Boolean]
  isBlank: (object) ->
    switch _.kind(object)
      when "object"
        return false for key, value of object
        return true
      when "string"
        object == ""
      when "array"
        object.length == 0
      when "null", "undefined"
        true
      else
        false

  # @return [Boolean]
  none: (value) ->
    return value == null || value == undefined

  has: (object, key) ->
    object.hasOwnProperty(key)

  # If you pass in (key, value) or (key: value), it will handle them.
  oneOrMany: (binding, method, key, value, args...) ->
    if typeof key == "object"
      method.call(binding, _key, value, args...) for _key, value of key
    else
      method.call binding, key, value, args...

  error: (error, callback) ->
    if error
      if callback
        return callback(error)
      else
        throw error

  teardown: (object, variables...) ->
    variables = _.flatten variables
    for variable in variables
      object[variable] = null
      delete object[variable]

    object

  copyProperties: (to, from) ->
    properties = _.args(arguments, 2)
    for property in properties
      to[property] = from[property] unless from[property] == undefined
    to

  moveProperties: (to, from) ->
    properties = _.args(arguments, 2)
    for property in properties
      to[property] = from[property] unless from[property] == undefined
      delete from[property]
    to

module.exports = Tower.Support.Object
