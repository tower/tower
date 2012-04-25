# @module
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

  # Compile the model instance into a hash.
  #
  # @param [Object] options
  # @option options [Array] only the only properties you want in the JSON object.
  # @option options [Array] except the properties you don't want in the JSON object.
  # @option options [Array] methods the methods you want called and added to the JSON object.
  #
  # @return [Object]
  toJSON: (options) ->
    @_serializableHash(options)

  # Return a copy of this model with the same attributes, except for the id.
  #
  # @return [Tower.Model]
  clone: ->
    attributes = Tower.clone(@attributes)
    delete attributes.id
    new @constructor(attributes)

  # Implementation of the {#toJSON} method.
  #
  # @private
  _serializableHash: (options = {}) ->
    result = {}

    attributeNames = _.keys(@attributes)

    if only = options.only
      attributeNames = _.union(_.toArray(only), attributeNames)
    else if except = options.except
      attributeNames = _.difference(_.toArray(except), attributeNames)

    for name in attributeNames
      result[name] = @_readAttributeForSerialization(name)

    if methods = options.methods
      methodNames = _.toArray(methods)
      for name in methods
        result[name] = @[name]()

    # TODO: async!
    if includes = options.include
      includes  = _.toArray(includes)
      for include in includes
        unless _.isHash(include)
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
  _readAttributeForSerialization: (name, type = 'json') ->
    @attributes[name]

module.exports = Tower.Model.Serialization
