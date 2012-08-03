class Tower.ModelRelationBelongsTo extends Tower.ModelRelation
  isBelongsTo: true
  
  init: (owner, name, options = {}) ->
    @_super arguments...

    @foreignKey = "#{name}Id"

    owner.field(@foreignKey, type: "Id")

    # this is kind of a hack until it becomes clear how to accomplish in the ember api
    mixins    = owner.PrototypeMixin.mixins
    computed  = mixins[mixins.length - 1].properties[@foreignKey]
    computed._dependentKeys.push(@name)

    if @polymorphic
      @foreignType = "#{name}Type"
      owner.field(@foreignType, type: 'String')

    #owner.prototype[name] = ->
    #  @relation(name)

Tower.ModelRelationBelongsToCursorMixin = Ember.Mixin.create
  isBelongsTo: true
  # need to do something here about Reflection

  clonePrototype: ->
    clone = @concat()
    clone.isCursor = true
    Tower.ModelRelationCursorMixin.apply(clone)
    Tower.ModelRelationBelongsToCursorMixin.apply(clone)

  find: ->
    @compile()

    @_super(arguments...)

  compile: ->
    relation  = @relation
    # @todo shouldn't have to do $in here...
    @where(id: $in: [@owner.get(relation.foreignKey)])

class Tower.ModelRelationBelongsToCursor extends Tower.ModelRelationCursor
  @make: ->
    array = []
    array.isCursor = true
    Tower.ModelRelationCursorMixin.apply(array)
    Tower.ModelRelationBelongsToCursorMixin.apply(array)

  @include Tower.ModelRelationBelongsToCursorMixin

module.exports = Tower.ModelRelationBelongsTo
