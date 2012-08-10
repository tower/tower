_ = Tower._

# @mixin
Tower.StoreMemorySerialization =
  generateId: ->
    #(@lastId++)#.toString()
    _.uuid()

module.exports = Tower.StoreMemorySerialization
