# @mixin
Tower.Store.Memory.Persistence =
  # Load models into the store (for non-persistent stores).
  #
  # @return [Array] Returns array of added records.
  load: (data) ->
    records = @_load(data)
    Tower.notifyConnections('load', records)
    records

  _load: (data) ->
    records = _.castArray(data)

    Ember.beginPropertyChanges()
    
    for record, i in records
      records[i] = @loadOne(@serializeModel(record))

    Ember.endPropertyChanges()

    records

  loadOne: (record) ->
    records         = @records
    cid             = record.get('_cid')

    originalRecord  = records.get(cid) if cid?

    if originalRecord
      # some how we want to make sure this doesn't override properties set between request and response (rare)
      # maybe some versioning/timestamping in the future.
      originalRecord.set('data', record.get('data'))
      # also need to handle updating the cursors.
      records.replaceKey(cid, record.get('id'))
      # don't want to do this b/c we just set it above... leaving for now just for notes
      # originalRecord.propertyDidChange('data')
      record = originalRecord
    else
      # @todo now that this is an Ember.Map we don't have to make it a string
      records.set(record.get('id'), record)

    record.set('isNew', false)
    # record.set('_cid', undefined)

    record

  insert: (cursor, callback) ->
    result    = []

    result.push(@insertOne(object)) for object in cursor.data

    result    = cursor.export(result)

    callback.call(@, null, result) if callback

    result

  insertOne: (record) ->
    unless record.get('_id')?
      if Tower.isClient
        record.set('_cid', @generateId()) unless record.get('_cid')?
      else
        record.set('id', @generateId())

    attributes = @deserializeModel(record)
    @loadOne(@serializeModel(record))

  update: (updates, cursor, callback) ->
    @find cursor, (error, records) =>
      return _.error(error, callback) if error
      # already updated by this point.
      #@updateOne(record, updates) for record in records
      callback.call(@, error, records) if callback
      records

  updateOne: (record, updates) ->
    for key, value of updates
      @_updateAttribute(record.attributes, key, value)
    record

  destroy: (cursor, callback) ->
    @find cursor, (error, records) ->
      return _.error(error, callback) if error
      @destroyOne(record) for record in records
      callback.call(@, error, records) if callback
      records

  destroyOne: (record) ->
    @records.remove(record.get('id'))

module.exports = Tower.Store.Memory.Persistence
