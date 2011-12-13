Metro.Store.MongoDB.Finders =   
  findOne: (query, options, callback) ->
    options.limit = 1
    @collection().findOne @_translateQuery(query), options,  (error, doc) ->
      doc = self.serializeAttributes(doc) unless error
      callback.call(@, error, doc)
    @
  
  # all()  
  # all(title: "Title")
  # all({title: "Title"}, {safe: true})
  # all({title: "Title"}, {safe: true}, (error, records) ->)
  # You can only do the last one!
  all: (query, options, callback) ->
    self    = @
    
    @collection().find(@_translateQuery(query), options).toArray (error, docs) ->
      unless error
        for doc in docs
          doc.id = doc["_id"]
          delete doc["_id"]
        docs = self.serialize(docs)
      
      callback.call(@, error, docs)
    
    @
  
  length: (query, callback) ->
    @collection().count (error, result) ->
      callback.call @, error, result
    @
    
  count: @length

module.exports = Metro.Store.MongoDB.Finders
