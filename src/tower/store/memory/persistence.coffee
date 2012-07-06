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
    
    for record, i in records
      records[i] = @loadOne(@serializeModel(record))

    records

  loadOne: (record) ->
    record.persistent = true
    record.set('isNew', false)
    # @todo now that this is an Ember.Map we don't have to make it a string
    @records.set(record.get('id'), record)
    record

  insert: (criteria, callback) ->
    result    = []

    result.push(@insertOne(object)) for object in criteria.data

    result    = criteria.export(result)

    callback.call(@, null, result) if callback

    result

  insertOne: (record) ->
    attributes = @deserializeModel(record)
    attributes.id ?= @generateId()
    #attributes.id = attributes.id#.toString()
    @loadOne(@serializeModel(record))

  update: (updates, criteria, callback) ->
    @find criteria, (error, records) =>
      return _.error(error, callback) if error
      # already updated by this point.
      #@updateOne(record, updates) for record in records
      callback.call(@, error, records) if callback
      records

  updateOne: (record, updates) ->
    for key, value of updates
      @_updateAttribute(record.attributes, key, value)
    record

  destroy: (criteria, callback) ->
    @find criteria, (error, records) ->
      return _.error(error, callback) if error
      @destroyOne(record) for record in records
      callback.call(@, error, records) if callback
      records

  destroyOne: (record) ->
    @records.remove(record.get('id'))

module.exports = Tower.Store.Memory.Persistence
