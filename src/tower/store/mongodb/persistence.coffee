Tower.Store.MongoDB.Persistence =
  create: (attributes, options, callback) ->
    self        = @
    record      = @serializeModel(attributes)
    attributes  = @serializeAttributesForCreate(attributes)
    options     = @serializeOptions(options)
    
    @collection().insert attributes, options, (error, docs) ->
      doc       = docs[0]
      record.id = doc["_id"]
      callback.call(@, error, record.attributes) if callback
    
    record.id   = attributes["_id"]
    
    record
    
  update: (updates, query, options, callback) ->  
    updates         = @serializeAttributesForUpdate(updates)
    query           = @serializeQuery(query)
    options         = @serializeOptions(options)
    
    options.safe    = true unless options.hasOwnProperty("safe")
    options.upsert  = false unless options.hasOwnProperty("upsert")
    # update multiple docs, b/c it defaults to false
    options.multi   = true unless options.hasOwnProperty("multi")
    
    @collection().update query, updates, options, (error) =>
      callback.call(@, error) if callback
      
    @
    
  destroy: (query, options, callback) ->
    query           = @serializeQuery(query)
    options         = @serializeOptions(options)
    
    @collection().remove query, options, (error) =>
      callback.call(@, error) if callback

    @
    
module.exports = Tower.Store.MongoDB.Persistence
