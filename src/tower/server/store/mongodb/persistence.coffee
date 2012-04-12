# @module
Tower.Store.MongoDB.Persistence =
  # @see Tower.Store#create
  create: (criteria, callback) ->
    record      = @serializeModel(criteria.data[0])
    attributes  = @serializeAttributesForCreate(record)
    options     = @serializeOptions(criteria)

    @collection().insert attributes, options, (error, docs) =>
      doc       = docs[0]
      record.set("id", doc["_id"])
      record.persistent = !!!error

      callback.call(@, error, record.attributes) if callback

    record.set("id", attributes["_id"])

    undefined

  # @see Tower.Store#update
  update: (updates, criteria, callback) ->
    updates         = @serializeAttributesForUpdate(updates)
    conditions      = @serializeConditions(criteria)
    options         = @serializeOptions(criteria)

    options.safe    = true unless options.hasOwnProperty("safe")
    options.upsert  = false unless options.hasOwnProperty("upsert")
    # update multiple docs, b/c it defaults to false
    options.multi   = true unless options.hasOwnProperty("multi")

    @collection().update conditions, updates, options, (error) =>
      callback.call(@, error) if callback

    undefined

  # @see Tower.Store#destroy
  destroy: (criteria, callback) ->
    conditions      = @serializeConditions(criteria)
    options         = @serializeOptions(criteria)

    @collection().remove conditions, options, (error) =>
      callback.call(@, error) if callback

    undefined

module.exports = Tower.Store.MongoDB.Persistence
