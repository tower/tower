Tower.Store.MongoDB.Finders =
  serializeModel: (attributes) ->
    klass = Tower.constant(@className)
    attributes.id ||= attributes._id
    delete attributes._id
    new klass(attributes)
  
  find: (query, options, callback) ->
    self          = @
    query         = @serializeQuery(query)
    options       = @serializeOptions(options)
    
    @collection().find(query, options).toArray (error, docs) ->
      unless error
        for doc in docs
          doc.id = doc["_id"]
          delete doc["_id"]
        docs = self.serialize(docs)
      
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
  
  count: (query, options, callback) ->
    @collection().count query, (error, result) ->
      callback.call @, error, result if callback
    @
    
  exists: (query, options, callback) ->
    @collection().count query, (error, result) ->
      callback.call @, error, result if callback
    @

module.exports = Tower.Store.MongoDB.Finders
