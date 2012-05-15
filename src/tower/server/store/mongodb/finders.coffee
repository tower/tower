# @module
Tower.Store.Mongodb.Finders =
  # Find and return an array of documents.
  #
  # @param [Tower.Model.Scope] criteria A criteria object with all of the query information.
  #
  # @return undefined Requires a callback to get the value.
  find: (criteria, callback) ->
    conditions  = @serializeConditions(criteria)
    options     = @serializeOptions(criteria)
    
    @collection().find(conditions, options).toArray (error, docs) =>
      unless error
        unless criteria.raw
          for doc in docs
            doc.id = doc["_id"]
            delete doc["_id"]

          docs = @serialize(docs, true)
          
          for model in docs
            model.set('isNew', false)

      callback.call(@, error, docs) if callback

    undefined

  # @return undefined Requires a callback to get the value.
  findOne: (criteria, callback) ->
    criteria.limit(1)
    conditions = @serializeConditions(criteria)

    @collection().findOne conditions, (error, doc) =>
      unless criteria.raw || error || !doc
        doc = @serializeModel(doc)
        doc.persistent = true

      callback.call(@, error, doc) if callback

    undefined

  # @return undefined Requires a callback to get the value.
  count: (criteria, callback) ->
    conditions = @serializeConditions(criteria)

    @collection().count conditions, (error, count) =>
      callback.call @, error, count || 0 if callback

    undefined

  # @return undefined Requires a callback to get the value.
  exists: (criteria, callback) ->
    conditions = @serializeConditions(criteria)

    @collection().count conditions, (error, count) =>
      callback.call(@, error, count > 0) if callback

    undefined

module.exports = Tower.Store.Mongodb.Finders
