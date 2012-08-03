# @module
Tower.StoreMongodbFinders =
  # Find and return an array of documents.
  #
  # @param [Tower.ModelScope] cursor A cursor object with all of the query information.
  #
  # @return undefined Requires a callback to get the value.
  find: (cursor, callback) ->
    conditions  = @serializeConditions(cursor)
    options     = @serializeOptions(cursor)

    @collection().find(conditions, options).toArray (error, docs) =>
      unless error
        unless cursor.raw
          for doc in docs
            doc.id = doc['_id']
            delete doc['_id']

          docs = @serialize(docs, true)

          for model in docs
            model.set('isNew', false)

      callback.call(@, error, docs) if callback

    undefined

  # @return undefined Requires a callback to get the value.
  findOne: (cursor, callback) ->
    cursor.limit(1)
    conditions = @serializeConditions(cursor)

    @collection().findOne conditions, (error, doc) =>
      unless cursor.raw || error || !doc
        doc = @serializeModel(doc)
        doc.persistent = true

      callback.call(@, error, doc) if callback

    undefined

  # @return undefined Requires a callback to get the value.
  count: (cursor, callback) ->
    conditions = @serializeConditions(cursor)

    @collection().count conditions, (error, count) =>
      callback.call @, error, count || 0 if callback

    undefined

  # @return undefined Requires a callback to get the value.
  exists: (cursor, callback) ->
    conditions = @serializeConditions(cursor)

    @collection().count conditions, (error, count) =>
      callback.call(@, error, count > 0) if callback

    undefined

module.exports = Tower.StoreMongodbFinders
