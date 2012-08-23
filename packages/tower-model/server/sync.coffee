Future = require('fibers/future')

Tower.ModelCursorSync =
  find: ->
    @_returnInFuture @_find

  count: ->
    @_returnInFuture @_count

  exists: ->
    @_returnInFuture @_exists

  insert: (callback) ->
    @_returnInFuture @_insert, callback

  update: (callback) ->
    @_returnInFuture @_update, callback

  destroy: (callback) ->
    @_returnInFuture @_destroy, callback

  _returnInFuture: (method, callback) ->
    future = new Future

    method.call @, (error, result) =>
      future.return([error, result])

    [error, result] = future.wait()
    if callback
      callback.call(@, error, result)
      result
    else
      throw error if error
      result
