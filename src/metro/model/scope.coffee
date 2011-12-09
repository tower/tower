class Metro.Model.Scope extends Metro.Object
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
    
  all: (query, callback) ->
    @store().all(Metro.Support.Object.extend(@query(), query), callback)
    
  first: (query, callback) ->
    @store().first(@query(), callback)
    
  last: (query, callback) ->
    @store().last(query, @query(), callback)
    
  store: ->
    Metro.constant(@sourceClassName).store()
    
  deleteAll: ->
    
  destroyAll: ->
    
  updateAll: ->
    
  find: ->
    
  build: (attributes, callback) ->
    @store().build Metro.Support.Object.extend(@query(), attributes), callback
    
  create: (attributes, callback) ->
    @store().create Metro.Support.Object.extend(@query(), attributes), callback
    
  updateAttribute: (key, value, callback) ->
    attributes      = {}
    @store().update @query(), attributes, callback
    
  updateAttributes: (attributes, callback) ->
    
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
