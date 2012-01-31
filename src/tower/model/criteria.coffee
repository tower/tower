class Tower.Model.Criteria
  constructor: (query = {}, options = {}) ->
    @query      = query
    @options    = options
  
  where: (conditions) ->
    @mergeQuery conditions
    
  order: (attribute, direction = "asc") ->
    @mergeOptions sort: [[attribute, direction]]
    
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
    @mergeOptions offset: number
    
  limit: (number) ->
    @mergeOptions limit: number
    
  select: ->
    @mergeOptions fields: Tower.Support.Array.args(arguments)
    
  joins: ->
    @mergeOptions joins: Tower.Support.Array.args(arguments)
    
  includes: ->
    @mergeOptions includes: Tower.Support.Array.args(arguments)
    
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
    @mergeQuery(criteria.query)
    @mergeOptions(criteria.options)
  
  mergeQuery: (conditions = {}) ->
    Tower.Support.Object.deepMergeWithArrays(@query, conditions)

  mergeOptions: (options = {}) ->
    Tower.Support.Object.deepMergeWithArrays(@options, options)
    
  mergeUpdates: ->
    
  mergeAttributes: ->
    
  toUpdate: ->
    
  toCreate: ->
    
  toFind: ->
    @query
    
  _whereOperator: (operator, attributes) ->
    query = {}
    for key, value of attributes
      query[key] = {}
      query[key][operator] = value
    @where query

module.exports = Tower.Model.Criteria
