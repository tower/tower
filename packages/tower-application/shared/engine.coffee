class Tower.Engine extends Tower.Hook
  @configure: (block) ->
    @initializers().push block

  @initializers: ->
    @_initializers ||= []

  configure: (block) ->
    @constructor.configure(block)

  subscribe: (key, block) ->
    Tower.ModelCursor.subscriptions.push(key)
    @[key] = if typeof block == 'function' then block() else block

  # @todo
  unsubscribe: (key) ->
    Tower.ModelCursor.subscriptions.splice(_.indexOf(key), 1)
    delete @[key]
