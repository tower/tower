class Tower.Engine extends Tower.Hook
  @configure: (block) ->
    @initializers().push block

  @initializers: ->
    @_initializers ||= []

  configure: (block) ->
    @constructor.configure(block)

  subscribe: (key, block) ->
    Tower.Model.Cursor.subscriptions.push(key)
    @[key] = if typeof block == 'function' then block() else block

  # @todo
  unsubscribe: (key) ->
    Tower.Model.Cursor.subscriptions.splice(_.indexOf(key), 1)
    delete @[key]

module.exports = Tower.Engine
