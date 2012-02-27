Tower.Store.MongoDB.Finders =
  serializeModel: (attributes) ->
    return attributes if attributes instanceof Tower.Model
    klass = Tower.constant(@className)
    attributes.id ||= attributes._id
    delete attributes._id
    model = new klass(attributes)
    model
  
  find: (conditions, options, callback) ->
    conditions    = @serializeQuery(conditions)
    options       = @serializeOptions(options)
    
    @collection().find(conditions, options).toArray (error, docs) =>
      unless error
        for doc in docs
          doc.id = doc["_id"]
          delete doc["_id"]
        docs = @serialize(docs)
        for model in docs
          model.persistent = true
      
      callback.call(@, error, docs) if callback
    
    @
    
  findOne: (conditions, options, callback) ->
    conditions    = @serializeQuery(conditions)
    options.limit = 1
    options       = @serializeOptions(options)
    
    @collection().findOne conditions, (error, doc) =>
      unless error || !doc
        doc = @serializeModel(doc)
        doc.persistent = true
      callback.call(@, error, doc) if callback
    @
  
  count: (conditions, options, callback) ->
    result        = undefined
    conditions    = @serializeQuery(conditions)
    
    @collection().count conditions, (error, count) =>
      result      = count
      callback.call @, error, result if callback
      
    result
    
  exists: (conditions, options, callback) ->
    result        = undefined
    conditions    = @serializeQuery(conditions)
    
    @collection().count conditions, (error, exists) ->
      result      = exists
      callback.call @, error, result if callback
    
    result

module.exports = Tower.Store.MongoDB.Finders
