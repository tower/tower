# @module
Tower.Store.Memory.Persistence =
  # Load models into the store (for non-persistent stores).
  #
  # @return [Array] Returns array of added records.
  load: (data) ->
    records = _.castArray(data)
    @loadOne(@serializeModel(record)) for record in records
    records

  loadOne: (record) ->
    record.persistent = true
    @records[record.get("id").toString()] = record

  create: (criteria, callback) ->
    result    = []
    
    result.push @createOne(object) for object in criteria.data

    result    = criteria.export(result)

    callback.call(@, null, result) if callback

    result

  createOne: (record) ->
    attributes = @deserializeModel(record)
    attributes.id ?= @generateId()
    attributes.id = attributes.id.toString()
    @loadOne(@serializeModel(record))

  update: (updates, criteria, callback) ->
    @find criteria, (error, records) =>
      return _.error(error, callback) if error
      @updateOne(record, updates) for record in records
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
    delete @records[record.get("id").toString()]

module.exports = Tower.Store.Memory.Persistence
