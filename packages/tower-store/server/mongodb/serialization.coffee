# All things that deal with data types and serialization.
# 
# - http://bsonspec.org/
# - http://www.mongodb.org/display/DOCS/Timestamp+data+type
# - http://www.mongodb.org/display/DOCS/Dates
# - http://stackoverflow.com/questions/7682714/does-mongodb-support-floating-point-types
# 
# @example Node.js MongoDB Data Types
#   new mongo.Long(numberString)
#   new mongo.ObjectID(hexString)
#   new mongo.Timestamp()  // the actual unique number is generated on insert.
#   new mongo.DBRef(collectionName, id, dbName)
#   new mongo.Binary(buffer)  // takes a string or Buffer
#   new mongo.Code(code, [context])
#   new mongo.Symbol(string)
#   new mongo.MinKey()
#   new mongo.MaxKey()
#   new mongo.Double(number) 
#   var motherOfAllDocuments = {
#     'string': 'hello',
#     'array': [1,2,3],
#     'hash': {'a':1, 'b':2},
#     'date': date,
#     'oid': oid,
#     'binary': bin,
#     'int': 42,
#     'float': 33.3333,
#     'boolean': true,
#     'long': date.getTime(),
#     'where': new Code('this.a > i', {i:1}),
#     'dbref': new DBRef('namespace', oid, 'integration_tests_')
#   }
# 
# @module
Tower.StoreMongodbSerialization =
  DATA_TYPES:
    id:         'id'
    reference:  'reference'
    binary:     'binary'
    array:      'array'
    hash:       'hash'
    boolean:    'boolean'
    integer:    'integer'
    decimal:    'float'
    float:      'float'
    long:       'long'
    bigint:     'long'
    date:       'datetime'
    time:       'datetime'
    datetime:   'datetime'
    timestamp:  'datetime'
    string:     'string'
    text:       'string'

  serializeModel: (attributes, saved = false) ->
    return attributes if attributes instanceof Tower.Model
    klass = Tower.constant(@className)
    attributes.id ||= attributes._id
    delete attributes._id
    model = klass.new()
    model.initialize(attributes, isNew: !saved)
    model

  generateId: ->
    new @constructor.database.bson_serializer.ObjectID()

  # tags: [1, 2] == $set: tags: [1, 2]
  # createdAt: Date == $set: createdAt: mongodate
  serializeAttributesForUpdate: (attributes) ->
    result  = {}
    schema  = @schema()

    for key, value of attributes
      continue if key == 'id' # && value == undefined || value == null
      operator              = @constructor.atomicModifiers[key]

      if operator
        key                 = operator
        result[key]       ||= {}
        for _key, _value of value
          result[key][_key] = @encode schema[_key], _value, operator
      else
        result['$set']    ||= {}
        result['$set'][key] = @encode schema[key], value

    for operator, value of result
      @_flattenObject(value)

    result

  # I think there might be an Ember helper for this already.
  _flattenObject: (object) ->
    for key, value of object
      @_flattenValue(object, key, value)

    object

  _flattenValue: (host, key, value) ->
    if _.isHash(value)
      delete host[key]
      for _key, _value of value
        @_flattenValue(host, "#{key}.#{_key}", _value)
    else
      host[key] = value

  serializeAttributesForInsert: (record) ->
    result      = {}
    schema      = @schema()
    attributes  = @deserializeModel(record)

    for key, value of attributes
      continue if key == 'id' && value == undefined || value == null
      realKey = if key == 'id' then '_id' else key
      operator              = @constructor.atomicModifiers[key]
      unless operator
        result[realKey]     = @encode schema[key], value

    result

  deserializeAttributes: (attributes) ->
    schema  = @schema()

    for key, value of attributes
      field = schema[key]
      attributes[key] = @decode field, value if field

    attributes

  # title: 'santa'
  # createdAt: '<': new Date()
  serializeConditions: (cursor) ->
    schema  = @schema()
    result  = {}

    query   = @deserializeModel(cursor.conditions())
    operators = @constructor.queryOperators#Tower.StoreOperators.MAP

    for key, value of query
      field = schema[key]

      key   = '_id' if key == 'id'
      if _.isRegExp(value)
        result[key] = value
      else if _.isHash(value)
        result[key] = {}
        for _key, _value of value
          operator  = operators[_key]
          if operator == '$eq'
            result[key] = @encode field, _value, _key
          else
            _key      = operator if operator
            if _key == '$in'
              _value = _.castArray(_value)
            if _key == '$match'
              _key = '$regex' # @todo tmp

            result[key][_key] = @encode field, _value, _key
      else
        result[key] = @encode field, value

    # @todo log here
    # console.log _.stringify(result)

    result

  # batchSize
  # hint
  # explain
  serializeOptions: (cursor) ->
    limit         = cursor.get('limit')
    sort          = cursor.get('order')
    offset        = cursor.get('offset')
    options       = {}
    options.limit = limit if limit

    if sort.length
      options.sort  = _.map sort, (set) ->
        [
          if set[0] == 'id' then '_id' else set[0],
          if set[1] == 'asc' then 1 else -1
        ]
    options.skip  = offset if offset

    options

  encode: (field, value, operation) ->
    return value unless field

    method = @["encode#{field.encodingType}"]
    value = method.call(@, value, operation) if method
    value = [value] if operation == '$in' && !_.isArray(value)
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
    _.toDate(value)

  encodeGeo: (value) ->
    # [lng, lat]
    [value.lng, value.lat].reverse()

  decodeGeo: (value) ->
    return value unless value
    lat: value[1], lng: value[0]

  decodeDate: (value) ->
    value

  encodeBoolean: (value) ->
    if @constructor.booleans.hasOwnProperty(value)
      @constructor.booleans[value]
    else
      throw new Error("#{value.toString()} is not a boolean")

  encodeArray: (value, operation) ->
    unless operation || value == null || _.isArray(value)
      throw new Error("Value is not Array")
    value

  encodeFloat: (value) ->
    return null if _.isBlank(value)
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

  # @todo need to figure out a better way to do this.
  _encodeId: (value) ->
    return value if typeof value == 'number'
    try
      @constructor.database.bson_serializer.ObjectID(value)
    catch error
      value

  # from mongo
  decodeId: (value) ->
    value.toString()

module.exports = Tower.StoreMongodbSerialization
