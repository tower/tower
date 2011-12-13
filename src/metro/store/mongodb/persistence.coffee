Metro.Store.MongoDB.Persistence =     
  remove: (query, callback) ->
    
  removeAll: (callback) ->
    @collection().remove (error) ->
      callback.call(@, error) if callback
    
  #@alias "clear", "removeAll"
  #@alias "deleteAll", "deleteAll"
  
  update: (query, attributes, options, callback) ->
    if typeof options == 'function'
      callback = options
      options = {}
    else if !options
      options = {}
      
    options.safe    = false
    options.upsert  = false
    
    @collection().update @_translateQuery(query), "$set": attributes, options, (error, docs) ->
      throw error if error
      callback.call(@, error, docs) if callback
      
    @
    
  destroy: (query, callback) ->
    @collection().remove @_translateQuery(query), (error) ->
      callback.call(@, error) if callback
      
    @
  
  create: (attributes, query, options, callback) ->
    self    = @
    record  = @serializeAttributes(attributes)
    
    @collection().insert attributes, (error, docs) ->
      doc                   = docs[0]
      record.id  = doc["_id"]
      callback.call(@, error, record) if callback
    
    record.id = attributes["_id"]
    delete attributes["_id"]
    
    record
    
  update: (ids..., updates, query, options, callback) ->
    @store().update(ids..., updates, callback)
    
  updateAll: (updates, query, options, callback) ->
    @store().updateAll(updates, callback)

  delete: (ids..., query, options, callback)->
    @store().delete(ids..., callback)

  deleteAll: (query, options, callback) ->
    @store().deleteAll(ids..., callback)
    
  destroy: (ids..., query, options, callback) ->
    @store().destroy(ids..., callback)
    
  destroyAll: (query, options, callback) ->
    @store().destroy(ids..., callback)
  
    
module.exports = Metro.Store.MongoDB.Persistence
