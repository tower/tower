class Tower.Model.Relation.BelongsTo extends Tower.Model.Relation
  isBelongsTo: true
  
  init: (owner, name, options = {}) ->
    @_super arguments...

    @foreignKey = "#{name}Id"

    owner.field(@foreignKey, type: "Id")

    if @polymorphic
      @foreignType = "#{name}Type"
      owner.field(@foreignType, type: 'String')

    #owner.prototype[name] = ->
    #  @relation(name)

Tower.Model.Relation.BelongsTo.CursorMixin = Ember.Mixin.create
  isBelongsTo: true
  # need to do something here about Reflection

  clonePrototype: ->
    clone = @concat()
    clone.isCursor = true
    Tower.Model.Relation.CursorMixin.apply(clone)
    Tower.Model.Relation.BelongsTo.CursorMixin.apply(clone)

  find: ->
    @compile()

    @_super(arguments...)

  compile: ->
    relation  = @relation
    # @todo shouldn't have to do $in here...
    @where(id: $in: [@owner.get(relation.foreignKey)])

class Tower.Model.Relation.BelongsTo.Cursor extends Tower.Model.Relation.Cursor
  @make: ->
    array = []
    array.isCursor = true
    Tower.Model.Relation.CursorMixin.apply(array)
    Tower.Model.Relation.BelongsTo.CursorMixin.apply(array)

  @include Tower.Model.Relation.BelongsTo.CursorMixin

module.exports = Tower.Model.Relation.BelongsTo
