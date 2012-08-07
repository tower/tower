class Tower.ModelRelationHasOne extends Tower.ModelRelation
  isHasOne: true

# @todo deal with only allowing one record per association (either error or override).
Tower.ModelRelationHasOneCursorMixin = Ember.Mixin.create
  isHasOne: true

  clonePrototype: ->
    clone = @concat()
    clone.isCursor = true
    Tower.ModelRelationCursorMixin.apply(clone)
    Tower.ModelRelationHasOneCursorMixin.apply(clone)

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

class Tower.ModelRelationHasOneCursor extends Tower.ModelRelationCursor
  @makeOld: ->
    array = []
    array.isCursor = true
    Tower.ModelRelationCursorMixin.apply(array)
    Tower.ModelRelationHasOneCursorMixin.apply(array)

  @include Tower.ModelRelationHasOneCursorMixin

module.exports = Tower.ModelRelationHasOne
