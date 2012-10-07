_ = Tower._

# @mixin
Tower.StoreMemoryPersistence =
  # Load models into the store (for non-persistent stores).
  #
  # @return [Array] Returns array of added records.
  load: (data, action) ->
    records = @_load(data)

    if action == 'update'
      for record in records
        record.reload()

    Tower.notifyConnections('load', records)

    records

  _load: (data) ->
    records = _.castArray(data)

    Ember.beginPropertyChanges()
    
    for record, i in records
      records[i] = @loadOne(@serializeModel(record, true))

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

  # This should basically be a soft delete, not touching the server 
  # but acting like it's been deleted on the client.
  # @todo need to refactor and think about some more.
  unload: (records) ->
    records = @_unload(records)
    Tower.notifyConnections('unload', records)
    records

  _unload: (data) ->
    records = _.castArray(data)

    Ember.beginPropertyChanges()
    
    for record, i in records
      records[i] = @unloadOne(@serializeModel(record))

    Ember.endPropertyChanges()

    records

  # A lot of this code is the same as {Tower.Model#destroy}, refactoring time later :)
  # The key thing is `record.notifyRelations`, which will update views which is important.
  unloadOne: (record) ->
    records         = @records
    records.remove(record.get('id'))
    record.set('isNew', false)
    record.set('isDeleted', true)
    # the method below was originally copied from record.destroyRelations.
    # maybe Ember bindings can be used here to automatically set `authorId` or whatever to null
    # because it's bound to `author.get('id')`?
    # That might have performance issues, so going to do a hack for now.
    record.notifyRelations()
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

module.exports = Tower.StoreMemoryPersistence
