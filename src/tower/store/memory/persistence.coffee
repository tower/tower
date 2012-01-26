Tower.Store.Memory.Persistence =
  load: (records) ->
    records = Tower.Support.Object.toArray(records)
    for record in records
      record = @serializeModel(record)
      @_setRecord(record)
    records
    
  create: (attributes, options, callback) ->
    result    = null
    
    if Tower.Support.Object.isArray(attributes)
      result  = []
      for object in attributes
        object.id ?= @generateId()
        result.push object
      result
    else
      attributes.id ?= @generateId()
      result  = attributes
    
    callback.call @, null, result if callback
    result
  
  update: (updates, query, options, callback) ->
    @find query, options, (error, records) =>
      return callback(error) if error
      for record, i in records
        for key, value of updates
          @_updateAttribute(record.attributes, key, value)
      callback.call(@, error, records) if callback
      records
      
  destroy: (query, options, callback) ->
    if Tower.Support.Object.isBlank(query)
      @clear(callback)
    else
      @find query, options, (error, records) ->
        return callback(error) if error
        for record in records
          #_records.splice(_records.indexOf(record), 1)
          @_removeRecord(record)
        callback.call(@, error, records) if callback
        records
        
  clear: (callback) ->
    @records = {}
    callback.call(@, null) if callback
    null
    
  _setRecord: (record) ->
    @records[record.get("id")] = record
    
  _getRecord: (key) ->
    
  _removeRecord: (record) ->
    delete @records[record.id]
    
module.exports = Tower.Store.Memory.Persistence
