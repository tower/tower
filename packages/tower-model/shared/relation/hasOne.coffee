class Tower.Model.Relation.HasOne extends Tower.Model.Relation
  isHasOne: true

# @todo deal with only allowing one record per association (either error or override).
Tower.Model.Relation.HasOne.CursorMixin = Ember.Mixin.create
  isHasOne: true

  clonePrototype: ->
    clone = @concat()
    clone.isCursor = true
    Tower.Model.Relation.CursorMixin.apply(clone)
    Tower.Model.Relation.HasOne.CursorMixin.apply(clone)

  insert: (callback) ->
    @compile()
    result = undefined
    
    @_insert (error, record) =>
      result = record
      @owner.set(@relation.name, record) if !error && record
      callback.call(@, error, record) if callback

    result

  find: (callback) ->
    result = undefined

    @_find (error, record) =>
      result = record
      @owner.set(@relation.name, record) if !error && record
      callback.call(@, error, record) if callback

    result

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

class Tower.Model.Relation.HasOne.Cursor extends Tower.Model.Relation.Cursor
  @make: ->
    array = []
    array.isCursor = true
    Tower.Model.Relation.CursorMixin.apply(array)
    Tower.Model.Relation.HasOne.CursorMixin.apply(array)

  @include Tower.Model.Relation.HasOne.CursorMixin

module.exports = Tower.Model.Relation.HasOne
