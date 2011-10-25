# All finder methods return a Cursor, which optimizes traversal and query construction.
class Scope
  constructor: (sourceClassName, store) ->
    @sourceClassName = sourceClassName
    @store      = store
    @conditions = []
  
  anyIn: ->
    @conditions.push ["anyIn", arguments]
    @
    
  allIn: ->
    @conditions.push ["allIn", arguments]
    @
  
  where: ->
    @conditions.push ["where", arguments]
    @
    
  order: ->
    @conditions.push ["order", arguments]
    @
    
  limit: ->
    @conditions.push ["limit", arguments]
    @
    
  select: ->
    @conditions.push ["select", arguments]
    @
    
  joins: ->
    @conditions.push ["joins", arguments]
    @
      
  includes: ->
    @conditions.push ["includes", arguments]
    @
    
  all: (callback) ->
    @store.all(@conditions, callback)
    
  first: (callback) ->
    @store.first(@conditions, callback)
    
  last: (callback) ->
    @store.last(@conditions, callback)
  
  sourceClass: ->
    global[@sourceClassName]

module.exports = Scope
