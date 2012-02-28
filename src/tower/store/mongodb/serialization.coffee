Tower.Store.MongoDB.Serialization =
  # tags: [1, 2] == $set: tags: [1, 2]
  # createdAt: Date == $set: createdAt: mongodate
  serializeAttributesForUpdate: (attributes) ->
    result  = {}
    schema  = @schema()
    
    for key, value of attributes
      continue if key == "id" && value == undefined || value == null
      operator              = @constructor.atomicModifiers[key]
      
      if operator
        key                 = operator
        result[key]       ||= {}
        for _key, _value of value
          result[key][_key] = @encode schema[_key], _value
      else
        result["$set"]    ||= {}
        result["$set"][key] = @encode schema[key], value
    
    result
    
  serializeAttributesForCreate: (record) ->
    result      = {}
    schema      = @schema()
    attributes  = @deserializeModel(record)
    
    for key, value of attributes
      continue if key == "id" && value == undefined || value == null
      key   = "_id" if key == "id"
      operator              = @constructor.atomicModifiers[key]
      unless operator
        result[key]         = @encode schema[key], value
    
    result
    
  deserializeAttributes: (attributes) ->
    schema  = @schema()
    
    for key, value of attributes
      field = schema[key]
      attributes[key] = @decode field, value if field
      
    attributes
  
  # title: "santa"  
  # createdAt: "<": new Date()
  serializeQuery: (record) ->
    schema  = @schema()
    result  = {}
    query   = @deserializeModel(record)
    
    for key, value of query
      field = schema[key]
      key   = "_id" if key == "id"
      if _.isRegExp(value)
        result[key] = value
      else if Tower.Support.Object.isHash(value)
        result[key] = {}
        for _key, _value of value
          operator  = @constructor.queryOperators[_key]
          if operator == "$eq"
            result[key] = @encode field, _value, _key
          else
            _key      = operator if operator
            result[key][_key] = @encode field, _value, _key
      else
        result[key] = @encode field, value
    
    result
    
  serializeOptions: (options = {}) ->
    options
  
  encode: (field, value, operation) ->
    return value unless field
    method = @["encode#{field.type}"]
    value = method.call(@, value) if method
    value = [value] if operation == "$in" && !Tower.Support.Object.isArray(value)
    value
    
  decode: (field, value, operation) ->
    return value unless field
    method = @["decode#{field.type}"]
    value = method.call(@, value) if method
    value
  
  encodeString: (value) ->
    if value then value.toString() else value
   
  encodeOrder: (value) ->
    
  encodeDate: (value) ->
    # if Tower.Support.config.useTimeZone
    time = require('moment')
    switch typeof(value)
      when "string"
        time.parse(value)
      when Date
        time.local(value.year, value.month, value.day, value.hour, value.min, value.sec)
      when Array
        time.local(value)
      else
        value
        
  decodeDate: (value) ->
    value
  
  encodeBoolean: (value) ->
    if @constructor.booleans.hasOwnProperty(value)
      @constructor.booleans[value]
    else
      throw new Error("#{value.toString()} is not a boolean")
      
  encodeArray: (value) ->
    unless value == null || Tower.Support.Object.isArray(value)
      throw new Error("Value is not Array")
    value
    
  encodeFloat: (value) ->
    return null if Tower.Support.Object.isBlank(value)
    try
      parseFloat(value)
    catch error
      value
    
  encodeInteger: (value) ->
    return null if !value && value != 0
    if value.toString().match(/(^[-+]?[0-9]+$)|(\.0+)$/) then parseInt(value) else parseFloat(value)
  
  encodeLocalized: (value) ->
    object = {}
    object[I18n.locale] = value.toString()
  
  decodeLocalized: (value) ->  
    value[I18n.locale]
    
  encodeNilClass: (value) ->
    null
    
  decodeNilClass: (value) ->
    null
    
  # to mongo
  encodeId: (value) ->
    return value unless value
    if _.isArray(value)
      result = []
      for item, i in value
        try
          id        = @_encodeId(item)
          result[i] = id
        catch error
          id
      return result
    else
      @_encodeId(value)
      
  _encodeId: (value) ->
    try
      @constructor.database.bson_serializer.ObjectID(value.toString())
    catch error
      value
  
  # from mongo
  decodeId: (value) ->
    value.toString()
    
module.exports = Tower.Store.MongoDB.Serialization
