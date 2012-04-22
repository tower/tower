Tower.Model.Cursor.Finders =  
  find: (callback) ->
    @_find callback

  _find: (callback) ->
    if @one
      @store.findOne @, callback
    else
      @store.find @, (error, records) =>
        records = @export(records) if !error && records.length
        callback.call @, error, records if callback
        records

  # hack
  findOne: (callback) ->
    @limit(1)
    @returnArray = false
    @find callback

  count: (callback) ->
    @_count callback

  _count: (callback) ->
    @store.count @, callback

  exists: (callback) ->
    @_exists callback

  _exists: (callback) ->
    @store.exists @, callback

module.exports = Tower.Model.Cursor.Finders
