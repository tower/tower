Tower.Model.Hierarchical =
  ClassMethods:
    hierarchical: ->
      @field "lft", type: "Integer"
      @field "rgt", type: "Integer"
      @field "parentId", type: "Integer"
      
    root: (callback) ->
      @roots.first(callback)
      
    roots: ->
      @where(parentColumnName: null).order(@quotedLeftColumnName())
      
    leaves: ->
      @where("#{@quotedRightColumnName()} - #{@quotedLeftColumnName()} = 1").order(@quotedLeftColumnName())
  
  isRoot: ->
    !!!@get("parentId")
    
  root: (callback) ->
    @selfAndAncestors.where(parentColumnName: null).first(callback)
    
  selfAndAncestors: ->
    @nestedSetScope().where([
      "#{self.class.quotedTableName}.#{quotedLeftColumnName} <= ? AND #{self.class.quotedTableName}.#{quotedRightColumnName} >= ?", left, right
    ])
  
  ancestors: ->
    @withoutSelf @selfAndAncestors

  selfAndSiblings: ->
    @nestedSetScope().where(parentColumnName: parentId)
  
  siblings: ->
    @withoutSelf @selfAndSiblings()

  leaves: ->
    @descendants().where("#{self.class.quotedTableName}.#{quotedRightColumnName} - #{self.class.quotedTableName}.#{quotedLeftColumnName} = 1")
  
  level: (callback) ->
    if get('parentId') == null then 0 else ancestors().count(callback)
  
  selfAndDescendants: ->
    @nestedSetScope().where([
      "#{self.class.quotedTableName}.#{quotedLeftColumnName} >= ? AND #{self.class.quotedTableName}.#{quotedRightColumnName} <= ?", left, right
    ])
  
  descendants: ->
    @withoutSelf @selfAndDescendants()

  isDescendantOf: (other) ->
    other.left < self.left && self.left < other.right && sameScope?(other)
    
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
