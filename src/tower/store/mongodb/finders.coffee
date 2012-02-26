Tower.Store.MongoDB.Finders =
  serializeModel: (attributes) ->
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
    
  findOne: (query, options, callback) ->
    self          = @
    query         = @serializeQuery(query)
    options.limit = 1
    options       = @serializeOptions(options)
    
    @collection().findOne query, (error, doc) ->
      doc = self.serializeModel(doc) unless error || !doc
      callback.call(@, error, doc) if callback
    @
  
  count: (conditions, options, callback) ->
    result        = undefined
    conditions    = @serializeQuery(conditions)
    
    @collection().count conditions, (error, count) =>
      result      = count
      callback.call @, error, result if callback
      
    result
    
  exists: (query, options, callback) ->
    result        = undefined
    conditions    = @serializeQuery(conditions)
    
    @collection().count query, (error, exists) ->
      result      = exists
      callback.call @, error, result if callback
    
    result

module.exports = Tower.Store.MongoDB.Finders
