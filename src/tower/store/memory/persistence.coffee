Tower.Store.Memory.Persistence =
  load: (records) ->
    records = Tower.Support.Object.toArray(records)
    for record in records
      record = @_buildOne(record)
      @records[record.get("id")] = record
    records
    
  _create: (attributes, options, callback) ->
    result    = null
    
    if Tower.Support.Object.isArray(attributes)
      result  = []
      for object in attributes
        result.push @_createOne(object, options)
      result
    else
      result  = @_createOne(attributes, options)
    
    callback.call @, null, result if callback
    result
    
  _createOne: (attributes, options) ->
    attributes.id ?= @generateId()
    attributes
    
  _build: (attributes, options, callback) ->
    result    = null

    if Tower.Support.Object.isArray(attributes)
      result  = []
      for object in attributes
        result.push @_buildOne(object, options)
      result
    else
      result  = @_buildOne(attributes, options)
      
    callback.call @, null, result if callback
    result

  _buildOne: (attributes, options) ->
    @serializeModel(attributes)
    
  # must have all 5 args!
  _update: (updates, query, options, callback) ->
    @find query, options, (error, records) =>
      return callback(error) if error
      for record, i in records
        @_updateOne(record, updates)
      callback.call(@, error, records) if callback
      records
      
  _updateOne: (record, updates) ->
    for key, value of updates
      @_updateAttribute(record.attributes, key, value)
  
  _destroy: (query, options, callback) ->
    _records = @records
    
    if Tower.Support.Object.isBlank(query)
      @_clear(callback)
    else
      @find query, options, (error, records) ->
        return callback(error) if error
        for record in records
          #_records.splice(_records.indexOf(record), 1)
          delete _records[record.id]
        callback.call(@, error, records) if callback
        records
      
  _clear: (callback) ->
    @records = {}
    callback.call(@, null) if callback
    null

module.exports = Tower.Store.Memory.Persistence
