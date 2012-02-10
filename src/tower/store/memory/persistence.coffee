Tower.Store.Memory.Persistence =
  load: (data) ->
    records = Tower.Support.Object.toArray(data)
    @loadOne(@serializeModel(record)) for record in records
    records
    
  loadOne: (record) ->
    @records[record.get("id")] = record
    
  create: (data, options, callback) ->
    result    = null
    if Tower.Support.Object.isArray(data)
      result  = []
      result.push @createOne(attributes) for attributes in data
    else
      result  = @createOne(data)
    
    callback.call @, null, result if callback
    
    result
    
  createOne: (record) ->
    attributes = @deserializeModel(record)
    attributes.id ?= @generateId()
    @loadOne(@serializeModel(record))
  
  update: (updates, query, options, callback) ->
    @find query, options, (error, records) =>
      return callback(error) if error
      @updateOne(record) for record in records
      records
      
  updateOne: (record, updates) ->
    for key, value of updates
      @_updateAttribute(record.attributes, key, value)
    record
    
  destroy: (query, options, callback) ->
    @find query, options, (error, records) ->
      return callback(error) if error
      @destroyOne(record) for record in records
      callback.call(@, error, records) if callback
      records
        
  destroyOne: (record) ->
    delete @records[record.get("id")]
    
module.exports = Tower.Store.Memory.Persistence
