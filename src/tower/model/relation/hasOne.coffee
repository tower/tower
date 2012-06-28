class Tower.Model.Relation.HasOne extends Tower.Model.Relation
  isHasOne: true

class Tower.Model.Relation.HasOne.Cursor extends Tower.Model.Relation.Cursor
  isHasOne: true

  insert: (callback) ->
    @compile()
    @_insert(callback)

  # same as hasMany
  compile: ->
    owner           = @owner
    relation        = @relation
    id              = owner.get('id')
    data            = {}

    if relation.foreignKey
      data[relation.foreignKey]     = id if id != undefined
      # must check here if owner is instance of foreignType
      data[relation.foreignType]  ||= owner.constructor.className() if relation.foreignType

    @where(data)

module.exports = Tower.Model.Relation.HasOne
