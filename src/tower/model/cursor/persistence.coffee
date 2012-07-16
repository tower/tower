# @mixin
Tower.Model.Cursor.Persistence = Ember.Mixin.create
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
        #Tower.cb(error, records)
        # @todo need to throw an error if records weren't saved an no callback was passed in.
        #error ||= new Error('Record invalid') if _.isPresent(records[0]) && _.isPresent(records[0].errors)
        unless callback
          throw error if error
          records = records[0] if !returnArray
        else
          if error
            callback(error)
          else
            records = records[0] if !returnArray
            callback(error, records)
    else
      @store.insert @, (error, result) =>
        records = result
        # tmp solution to get hasMany through working,
        # since you need to wait for the first record to be created on the client via Ajax,
        # then create the middle record.
        # Because on client async:true in development, this works (putting notify before callback is called).
        # It also works in test/production when async:false, b/c the ajax queue system.
        Tower.notifyConnections('create', records) unless error
        callback.call(@, error, records) if callback

    if Tower.isClient then records else @ # tmp solution

  update: (callback) ->
    @_update(callback)

  _update: (callback) ->
    updates     = @data[0]
    records     = undefined

    if @instantiate
      iterator = (record, next) =>
        record.updateAttributes(updates, next)

      @_each @, iterator, callback
    else
      @store.update updates, @, (error, result) =>
        records = result
        Tower.notifyConnections('update', records) unless error
        callback.call(@, error, records) if callback
        # this should go into some Ember runLoop thing
        # it should also be moved to the store

    if Tower.isClient then records else @ # tmp solution

  destroy: (callback) ->
    @_destroy callback

  _destroy: (callback) ->
    if @instantiate
      iterator = (record, next) ->
        record.destroy(next)

      @_each(@, iterator, callback)
    else
      @store.destroy @, (error, records) =>
        Tower.notifyConnections('destroy', records) unless error
        callback.call(@, error, records) if callback
        # this should go into some Ember runLoop thing
        # it should also be moved to the store
    @

  # add to set
  add: (callback) ->

  # remove from set
  remove: (callback) ->

module.exports = Tower.Model.Cursor.Persistence
