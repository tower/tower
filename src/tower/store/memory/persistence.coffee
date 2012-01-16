Tower.Store.Memory.Persistence =
  create: (attributes, options, callback) ->
    attributes.id ?= @generateId()
    record        = @serializeModel(attributes)
    @records[attributes.id] = record
    callback.call @, null, record if callback
    record
  
  # must have all 5 args!
  update: (updates, query, options, callback) ->
    self = @
    
    @all query, options, (error, records) ->
      unless error
        for record, i in records
          for key, value of updates
            self._updateAttribute(record.attributes, key, value)
            
      callback.call(@, error, records) if callback
  
  delete: (query, options, callback) ->
    _records = @records
    
    if Tower.Support.Object.isBlank(query)
      @clear(callback)
    else
      @find query, (error, records) ->
        unless error
          for record in records
            _records.splice(_records.indexOf(record), 1)
        callback.call(@, error, records) if callback
      
  clear: (callback) ->
    @records = {}
    callback.call(@, error, records) if callback
    @records

module.exports = Tower.Store.Memory.Persistence
