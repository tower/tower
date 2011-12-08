class Metro.Model.Scope
  constructor: (sourceClassName) ->
    @sourceClassName  = sourceClassName
    @conditions       = []
  
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
    
  paginate: ->
    @conditions.push ["paginate", arguments]
    @
    
  within: ->
    @conditions.push ["within", arguments]
    @
    
  all: (callback) ->
    @store().all(@query(), callback)
    
  first: (callback) ->
    @store().first(@query(), callback)
    
  last: (callback) ->
    @store().last(@query(), callback)
    
  store: ->
    Metro.constant(@sourceClassName).store()
    
  deleteAll: ->
    
  destroyAll: ->
    
  updateAll: ->
    
  find: ->
    
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

module.exports = Metro.Model.Scope
