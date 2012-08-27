_ = Tower._

# @todo
# 
# @mixin
Tower.ModelHierarchical =
  ClassMethods:
    hierarchical: (options = {}) ->
      @metadata().lft       = options.lft ||= 'lft'
      @metadata().rgt       = options.rgt ||= 'rgt'
      @metadata().parentId  = options.parentId ||= 'parentId'

      @field options.lft, type: 'Integer'
      @field options.rgt, type: 'Integer'
      @field options.parentId, type: 'Integer'

    root: (callback) ->
      @roots().first(callback)

    roots: ->
      metadata    = @metadata()
      conditions  = {}
      conditions[metadata.parentId] = null

      @where(conditions).asc(metadata.lft)

    leaves: ->
      metadata    = @metadata()
      @where("#{metadata.rgt} - #{metadata.lft} = 1").asc(metadata.lft)

  isRoot: ->
    !!!@get(@metadata().parentId)

  root: (callback) ->
    metadata    = @metadata()
    conditions  = {}
    conditions[metadata.parentId] = null
    @selfAndAncestors().where(conditions).first(callback)

  selfAndAncestors: ->
    @nestedSetScope().where(
      lft: '<=': @get('lft')
      rgt: '>=': @get('rgt')
    )

  ancestors: ->
    @withoutSelf @selfAndAncestors

  selfAndSiblings: ->
    metadata    = @metadata()
    conditions  = {}
    conditions[metadata.parentId] = @get(metadata.parentId)

    @nestedSetScope().where(conditions)

  siblings: ->
    @withoutSelf @selfAndSiblings()

  leaves: ->
    metadata = @metadata()
    @descendants().where("#{metadata.rgt} - #{metadata.lft} = 1").asc(metadata.lft)

  level: (callback) ->
    metadata = @metadata()
    if @get(metadata.parentId) == null then 0 else @ancestors().count(callback)

  selfAndDescendants: ->
    @nestedSetScope().where(
      lft: '>=': @get('lft')
      rgt: '<=': @get('rgt')
    )

  nestedSetScope: ->
    @constructor.where(id: @get('id'))

  descendants: ->
    @withoutSelf @selfAndDescendants()

  isDescendantOf: (other) ->
    other.get('lft') < @get('lft') && @get('rgt') < @get('rgt') && @isSameScope(other)

  moveLeft: ->
    @moveToLeftOf @leftSibling()

  moveRight: ->
    @moveToRightOf @rightSibling()

  moveToLeftOf: (node) ->
    @moveTo node, 'lft'

  moveToRightOf: (node) ->
    @moveTo node, 'rgt'

  moveToChildOf: (node) ->
    @moveTo node, 'child'

  moveToRoot: ->
    @moveTo null, 'root'

  moveTo: (target, position) ->
    @runCallbacks 'move', ->

  isOrIsDescendantOf: (other) ->
    other.get('lft') <= @get('lft') && @get('lft') < other.get('right') && @isSameScope(other)

  isAncestorOf: (other) ->
    @get('lft') < other.get('lft') && other.get('lft') < @get('right') && @isSameScope(other)

  isOrIsAncestorOf: (other) ->
    @get('lft') <= other.get('lft') && other.get('lft') < @get('right') && @isSameScope(other)

  isSameScope: (other) ->
    Array(actsAsNestedSetOptions.scope).all (attr) ->
      @get(attr) == other.get(attr)

  leftSibling: (callback) ->
    metadata    = @constructor.metadata()
    conditions  = {}
    conditions[metadata.lft] = $lt: @get('lft')
    siblings.where(conditions).desc(metadata.lft).last(callback)

  rightSibling: (callback) ->
    metadata    = @constructor.metadata()
    conditions  = {}
    conditions[metadata.lft] = $gt: @get('lft')
    siblings.where(conditions).first(callback)

module.exports = Tower.ModelHierarchical
