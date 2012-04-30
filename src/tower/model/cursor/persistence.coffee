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
        _.extend(item.attributes, attributes, item.attributes)
      else
        item = store.serializeModel(_.extend({}, attributes, item))

      result.push(item)

    result = if @returnArray then result else result[0]

    callback.call(@, null, result) if callback

    result

  create: (callback) ->
    @_create(callback)

  _create: (callback) ->
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
        unless callback
          throw error if error
          records = records[0] if !returnArray
        else
          return callback(error) if error
          records = records[0] if !returnArray
          callback(error, records)
    else
      @store.create @, callback

    records

  update: (callback) ->
    @_update callback

  _update: (callback) ->
    updates = @data[0]

    if @instantiate
      iterator = (record, next) =>
        record.updateAttributes(updates, next)

      @_each @, iterator, callback
    else
      @store.update updates, @, callback

  destroy: (callback) ->
    @_destroy callback

  _destroy: (callback) ->
    if @instantiate
      iterator = (record, next) ->
        record.destroy(next)

      @_each(@, iterator, callback)
    else
      @store.destroy(@, callback)

  # add to set
  add: (callback) ->

  # remove from set
  remove: (callback) ->

module.exports = Tower.Model.Cursor.Persistence
