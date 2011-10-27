# All finder methods return a Cursor, which optimizes traversal and query construction.
class Scope
  constructor: (sourceClassName) ->
    @sourceClassName = sourceClassName
    @store = global[@sourceClassName].store()
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
    @store.all(@query(), callback)
    
  first: (callback) ->
    @store.first(@query(), callback)
    
  last: (callback) ->
    @store.last(@query(), callback)
  
  sourceClass: ->
    global[@sourceClassName]
    
  query: ->
    conditions = @conditions
    result = {}
    
    for condition in conditions
      switch condition[0]
        when "where"
          item = condition[1][0]
          for key, value of item
            result[key] = value
        when "order"
          result._sort = condition[1][0]
    
    result

module.exports = Scope
