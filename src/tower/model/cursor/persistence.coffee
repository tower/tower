# @mixin
Tower.Model.Cursor.Persistence =
  build: (callback) ->
    @_build(callback)

  _build: (callback) ->
    store       = @store
    attributes  = @attributes()

    data        = @data ||= []
    data.push({}) unless data.length

    result      = []

    for item in data
      if item instanceof Tower.Model
        item.setProperties(attributes)
      else
        item = store.serializeModel(_.extend({}, attributes, item))

      result.push(item)

    result = if @returnArray then result else result[0]

    callback.call(@, null, result) if callback

    result

  insert: (callback) ->
    @_insert(callback)

  _insert: (callback) ->
    records = undefined

    if @instantiate
      returnArray   = @returnArray
      @returnArray  = true
      records       = @build()
      @returnArray  = returnArray

      iterator = (record, next) ->
        if record
          record.save(next)
        else
          next()

      Tower.async records, iterator, (error) =>
        Tower.cb(error, records)

        unless callback
          throw error if error
          records = records[0] if !returnArray
        else
          return callback(error) if error
          records = records[0] if !returnArray
          callback(error, records)
    else
      @store.insert @, (error, records) =>
        callback.call(@, error, records) if callback
        # this should go into some Ember runLoop thing
        # it should also be moved to the store
        Tower.notifyConnections('create', records) unless error

    @

  update: (callback) ->
    @_update(callback)

  _update: (callback) ->
    updates     = @data[0]

    if @instantiate
      iterator = (record, next) =>
        record.updateAttributes(updates, next)

      @_each @, iterator, callback
    else
      @store.update updates, @, callback

    @

  destroy: (callback) ->
    @_destroy callback

  _destroy: (callback) ->
    if @instantiate
      iterator = (record, next) ->
        record.destroy(next)

      @_each(@, iterator, callback)
    else
      @store.destroy(@, callback)

    @

  # add to set
  add: (callback) ->

  # remove from set
  remove: (callback) ->

module.exports = Tower.Model.Cursor.Persistence
