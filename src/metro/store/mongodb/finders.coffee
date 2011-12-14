Metro.Store.MongoDB.Finders =   
  findOne: (query, options, callback) ->
    self          = @
    query         = @serializeQuery(query)
    options.limit = 1
    options       = @serializeOptions(options)
    
    @collection().findOne query, options, (error, doc) ->
      doc = self.serialize(doc) unless error
      callback.call(@, error, doc)
    @
  
  # all()  
  # all(title: "Title")
  # all({title: "Title"}, {safe: true})
  # all({title: "Title"}, {safe: true}, (error, records) ->)
  # You can only do the last one!
  all: (query, options, callback) ->
    self          = @
    query         = @serializeQuery(query)
    options       = @serializeOptions(options)
    
    @collection().find(query, options).toArray (error, docs) ->
      unless error
        for doc in docs
          doc.id = doc["_id"]
          delete doc["_id"]
        docs = self.serialize(docs)
      
      callback.call(@, error, docs)
    
    @
  
  count: (query, options, callback) ->
    @collection().count query, options, (error, result) ->
      callback.call @, error, result
    @

module.exports = Metro.Store.MongoDB.Finders
