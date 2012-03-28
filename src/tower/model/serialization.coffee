Tower.Model.Serialization =
  ClassMethods:
    fromJSON: (data) ->
      records = JSON.parse(data)
      records = [records] unless records instanceof Array

      for record, i in records
        records[i] = new @(record)

      records

    toJSON: (records, options = {}) ->
      result = []
      result.push(record.toJSON()) for record in records
      result

  toJSON: (options) ->
    @_serializableHash(options)
  
  clone: ->
    attributes = Tower.clone(@attributes)
    delete attributes.id
    new @constructor(attributes)

  # @private
  _serializableHash: (options = {}) ->
    result = {}

    attributeNames = Tower.Support.Object.keys(@attributes)

    if only = options.only
      attributeNames = _.union(Tower.Support.Object.toArray(only), attributeNames)
    else if except = options.except
      attributeNames = _.difference(Tower.Support.Object.toArray(except), attributeNames)

    for name in attributeNames
      result[name] = @_readAttributeForSerialization(name)

    if methods = options.methods
      methodNames = Tower.Support.Object.toArray(methods)
      for name in methods
        result[name] = @[name]()

    # TODO: async!
    if includes = options.include
      includes  = Tower.Support.Object.toArray(includes)
      for include in includes
        unless Tower.Support.Object.isHash(include)
          tmp           = {}
          tmp[include]  = {}
          include       = tmp
          tmp           = undefined

        for name, opts of include
          records = @[name]().all()
          for record, i in records
            records[i] = record._serializableHash(opts)
          result[name] = records

    result

  # @private
  _readAttributeForSerialization: (name, type = "json") ->
    @attributes[name]

module.exports = Tower.Model.Serialization
