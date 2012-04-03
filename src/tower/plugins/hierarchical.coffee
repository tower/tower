# @module
# @todo
# copied this from acts_as_nested_set, haven't messed with it yet.
Tower.Model.Hierarchical =
  ClassMethods:
    hierarchical: (options = {}) ->
      @metadata().lft       = options.lft ||= "lft"
      @metadata().rgt       = options.rgt ||= "rgt"
      @metadata().parentId  = options.parentId ||= "parentId"
      
      @field options.lft, type: "Integer"
      @field options.rgt, type: "Integer"
      @field options.parentId, type: "Integer"

    root: (callback) ->
      @roots.first(callback)

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
    @selfAndAncestors.where(conditions).first(callback)

  selfAndAncestors: ->
    @nestedSetScope().where(
      lft: "<=": @get("lft")
      rgt: ">=": @get("rgt")
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
      lft: ">=": @get("lft")
      rgt: "<=": @get("rgt")
    )

  descendants: ->
    @withoutSelf @selfAndDescendants()

  isDescendantOf: (other) ->
    other.get("left") < @get("left") && @get("left") < @get("right") && @sameScope?(other)

  moveLeft: ->
    @moveToLeftOf @leftSibling()

  moveRight: ->
    @moveToRightOf @rightSibling()

  moveToLeftOf: (node) ->
    @moveTo node, "left"

  moveToRightOf: (node) ->
    @moveTo node, "right"

  moveToChildOf: (node) ->
    @moveTo node, "child"

  moveToRoot: ->
    @moveTo null, "root"

  moveTo: (target, position) ->
    @runCallbacks "move", ->

  isOrIsDescendantOf: (other) ->
    other.left <= self.left && self.left < other.right && sameScope?(other)

  isAncestorOf: (other) ->
    self.left < other.left && other.left < self.right && sameScope?(other)

  isOrIsAncestorOf: (other) ->
    self.left <= other.left && other.left < self.right && sameScope?(other)

  sameScope: (other) ->
    Array(actsAsNestedSetOptions.scope).all (attr) ->
      self.send(attr) == other.send(attr)

  leftSibling: ->
    siblings.where(["#{self.class.quotedTableName}.#{quotedLeftColumnName} < ?", left]).
            order("#{self.class.quotedTableName}.#{quotedLeftColumnName} DESC").last

  rightSibling: ->
    siblings.where(["#{self.class.quotedTableName}.#{quotedLeftColumnName} > ?", left]).first

module.exports = Tower.Model.Hierarchical
