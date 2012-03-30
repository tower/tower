# @module
Tower.Store.MongoDB.Persistence =
  # @see Tower.Store#create
  create: (attributes, options, callback) ->
    record      = @serializeModel(attributes)
    attributes  = @serializeAttributesForCreate(attributes)
    options     = @serializeOptions(options)
    
    @joins scope, =>
      @collection().insert attributes, options, (error, docs) =>
        doc       = docs[0]
        record.set("id", doc["_id"])
        record.persistent = !!!error
        callback.call(@, error, record.attributes) if callback

    record.set("id", attributes["_id"])

    record

  # @see Tower.Store#update
  update: (updates, conditions, options, callback) ->
    updates         = @serializeAttributesForUpdate(updates)
    conditions      = @serializeQuery(conditions)
    options         = @serializeOptions(options)

    options.safe    = true unless options.hasOwnProperty("safe")
    options.upsert  = false unless options.hasOwnProperty("upsert")
    # update multiple docs, b/c it defaults to false
    options.multi   = true unless options.hasOwnProperty("multi")
    
    @joins scope, =>
      @collection().update conditions, updates, options, (error) =>
        callback.call(@, error) if callback

    undefined

  # @see Tower.Store#destroy
  destroy: (conditions, options, callback) ->
    conditions      = @serializeQuery(conditions)
    options         = @serializeOptions(options)
    
    @joins scope, =>
      @collection().remove conditions, options, (error) =>
        callback.call(@, error) if callback

    undefined

module.exports = Tower.Store.MongoDB.Persistence
