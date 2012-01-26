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
    
  allIn: (attributes) ->
    @_whereOperator "$all", attributes
    
  anyIn: (attributes) ->
    @_whereOperator "$any", attributes
    
  notIn: (attributes) ->
    @_whereOperator "$nin", attributes
    
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
    
  page: (number) ->
    @offset(number)
  
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
    
  _whereOperator: (operator, attributes) ->
    query = {}
    for key, value of attributes
      query[key] = {}
      query[key][operator] = value
    @where query

module.exports = Tower.Model.Criteria
