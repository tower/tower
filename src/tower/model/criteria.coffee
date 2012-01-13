class Tower.Model.Criteria
  constructor: (query = {}, options = {}) ->
    @query      = query
    @options    = options
  
  where: (conditions) ->
    @_mergeQuery conditions
    
  order: (attribute, direction = "asc") ->
    @_mergeOptions sort: [[attribute, direction]]
    
  asc: (attributes...) ->
    @order(attribute) for attribute in attributes
    
  desc: (attributes...) ->
    @order(attribute, "desc") for attribute in attributes
    
  offset: (number) ->
    @_mergeOptions offset: number
    
  limit: (number) ->
    @_mergeOptions limit: number
    
  select: ->
    @_mergeOptions fields: Tower.Support.Array.args(arguments)
    
  joins: ->
    @_mergeOptions joins: Tower.Support.Array.args(arguments)
    
  includes: ->
    @_mergeOptions includes: Tower.Support.Array.args(arguments)
  
  paginate: (options) ->
    limit   = options.perPage || options.limit
    page    = options.page || 1
    @limit  limit
    @offset((page - 1) * limit)
  
  within: (options) ->
    @
    
  clone: ->
    new @constructor(Tower.Support.Object.cloneHash(@query), Tower.Support.Object.cloneHash(@options))
    
  merge: (criteria) ->
    @_mergeQuery(criteria.query)
    @_mergeOptions(criteria.options)
  
  _mergeQuery: (conditions = {}) ->
    Tower.Support.Object.deepMergeWithArrays(@query, conditions)

  _mergeOptions: (options = {}) ->
    Tower.Support.Object.deepMergeWithArrays(@options, options)

module.exports = Tower.Model.Criteria
