Future  = null
_       = Tower._
Tower.future  = undefined

Tower.ModelCursorSync =
  # The first time it's included, require the future library
  included: ->
    Future ||= try require('fibers/future')

  find: (callback) ->
    @_returnInFuture(@_find, callback)

  count: (callback) ->
    @_returnInFuture(@_count, callback)

  exists: (callback) ->
    @_returnInFuture(@_exists, callback)

  insert: (callback) ->
    if @instantiate
      @_returnInFuture(@_insert, callback)
    else
      @_insert(callback)

  update: (callback) ->
    if @instantiate
      @_returnInFuture(@_update, callback)
    else
      @_update(callback)

  destroy: (callback) ->
    if @instantiate
      @_returnInFuture(@_destroy, callback)
    else
      @_destroy(callback)

  _returnInFuture: (method, callback) ->
    result

    future = Tower.future

    if future
      method.call @, callback
    else
      Tower.future = future = new Future

      method.call @, (error, data) =>
        future.return([error, data])

      [error, result] = future.wait()

      Tower.future = undefined
      
      if callback
        callback.call(@, error, result)
      else
        throw error if error

    result
