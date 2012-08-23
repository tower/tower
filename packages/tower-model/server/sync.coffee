Future = require('fibers/future')

Tower.ModelCursorSync =
  find: ->
    @_returnInFuture @_find

  count: ->
    @_returnInFuture @_count

  exists: ->
    @_returnInFuture @_exists

  insert: ->
    @_returnInFuture @_insert

  update: ->
    @_returnInFuture @_update

  destroy: ->
    @_returnInFuture @_destroy

  _returnInFuture: (method) ->
    future = new Future

    method.call @, (error, result) =>
      future.return([error, result])

    [error, result] = future.wait()
    throw error if error
    result

Tower.ModelCursor.include Tower.ModelCursorSync