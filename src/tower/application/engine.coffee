class Tower.Engine extends Tower.Hook
  subscribe: (key, block) ->
    Tower.Model.Cursor.subscriptions.push(key)
    @[key] = if typeof block == 'function' then block() else block

  # @todo
  unsubscribe: (key) ->
    Tower.Model.Cursor.subscriptions.push(key).splice(_.indexOf(key), 1)
    delete @[key]

module.exports = Tower.Engine
