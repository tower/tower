class Tower.Model.Criteria
  constructor: (query = {}, options = {}) ->
    @query      = query
    @options    = options
  
  _mergeQuery: (conditions = {}) ->
    Tower.Support.Object.deepMergeWithArrays(@query, conditions)
    
  _mergeOptions: (options = {}) ->
    Tower.Support.Object.deepMergeWithArrays(@options, options)
    
  where: (conditions) ->
    @_mergeQuery conditions
    
  order: (attribute, direction = "asc") ->
    @_mergeOptions sort: [[attribute, direction]]
    
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
    
  # paginate perPage: 20, page: 20
  # Tile.paginate(perPage: 20, page: 3).where(title: "=~": "Hello").all()
  paginate: (options) ->
    limit   = options.perPage || options.limit
    page    = options.page || 1
    @limit  limit
    @offset((page - 1) * limit)
  
  # Tile.within(3, origin: [42.12415, -81.3815719]).all()  
  within: (options) ->
    @
    
  clone: ->
    new @constructor(Tower.Support.Object.cloneHash(@query), Tower.Support.Object.cloneHash(@options))
    
  merge: (criteria) ->
    @_mergeQuery(criteria.query)
    @_mergeOptions(criteria.options)

module.exports = Tower.Model.Criteria
