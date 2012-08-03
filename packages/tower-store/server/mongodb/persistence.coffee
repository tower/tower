# @module
Tower.StoreMongodbPersistence =
  # @see Tower.Store#insert
  insert: (cursor, callback) ->
    record      = @serializeModel(cursor.data[0], false)
    attributes  = @serializeAttributesForInsert(record)
    options     = @serializeOptions(cursor)

    @collection().insert attributes, options, (error, docs) =>
      doc       = docs[0]

      record.set('isNew', !!error)
      record.set('id', doc['_id'])

      callback.call(@, error, record) if callback

    undefined

  # @see Tower.Store#update
  update: (updates, cursor, callback) ->
    updates         = @serializeAttributesForUpdate(updates.get('dirtyAttributes'))
    
    if _.isBlank(updates)
      callback.call(@) if callback
      return
    
    conditions      = @serializeConditions(cursor)
    options         = @serializeOptions(cursor)

    options.safe    = true unless options.hasOwnProperty('safe')
    options.upsert  = false unless options.hasOwnProperty('upsert')
    # update multiple docs, b/c it defaults to false
    options.multi   = true unless options.hasOwnProperty('multi')

    @collection().update conditions, updates, options, (error) =>
      callback.call(@, error) if callback

    undefined

  # @see Tower.Store#destroy
  destroy: (cursor, callback) ->
    conditions      = @serializeConditions(cursor)
    options         = @serializeOptions(cursor)

    @collection().remove conditions, options, (error) =>
      callback.call(@, error) if callback

    undefined

module.exports = Tower.StoreMongodbPersistence
