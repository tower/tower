# @mixin
Tower.Store.Memory.Serialization =
  generateId: ->
    #(@lastId++)#.toString()
    _.uuid()

module.exports = Tower.Store.Memory.Serialization
