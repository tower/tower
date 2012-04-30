# @mixin
Tower.Model.Cursor.Finders =
  find: (callback) ->
    @_find(callback)

  _find: (callback) ->
    if @one
      @store.findOne(@, callback)
    else
      @store.find @, (error, records) =>
        records = @export(records) if !error && records.length
        callback.call(@, error, records) if callback
        records

  # hack
  findOne: (callback) ->
    @limit(1)
    @returnArray = false
    @find(callback)

  count: (callback) ->
    @_count(callback)

  _count: (callback) ->
    @store.count(@, callback)

  exists: (callback) ->
    @_exists(callback)

  _exists: (callback) ->
    @store.exists(@, callback)

  getType: ->
    @model

  pushMatching: (records) ->
    matching = Tower.Store.Operators.select(records, @conditions())

    @pushObjects(matching)

    matching

  pullMatching: (records) ->
    matching = Tower.Store.Operators.select(records, @conditions())

    @pullObjects(matching)

    matching

module.exports = Tower.Model.Cursor.Finders
