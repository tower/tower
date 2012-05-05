# @mixin
Tower.Store.Memory.Serialization =
  generateId: ->
    (@lastId++).toString()

module.exports = Tower.Store.Memory.Serialization
