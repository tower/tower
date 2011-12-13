class Metro.Model.Criteria
  constructor: (query = {}, options = {}) ->
    @query      = query
    @options    = options
  
  _mergeQuery: (conditions = {}) ->
    Metro.Support.Object.extend(@query, conditions)
    
  _mergeOptions: (options = {})
    Metro.Support.Object.extend(@options, options)
    
  where: (conditions) ->
    @_mergeQuery conditions
    
  order: (options) ->
    @_mergeOptions sort: options
    
  offset: (number) ->
    @_mergeOptions offset: number
    
  limit: (number) ->
    @_mergeOptions limit: number
    
  select: ->
    @_mergeOptions fields: Metro.Support.Array.args(arguments)
    
  joins: ->
    @_mergeOptions joins: Metro.Support.Array.args(arguments)
    
  includes: ->
    @_mergeOptions includes: Metro.Support.Array.args(arguments)
    
  # paginate perPage: 20, page: 20
  # Tile.paginate(perPage: 20, page: 3).where(title: "=~": "Hello").all()
  paginate: (options) ->
    limit   = options.perPage || options.limit
    page    = options.page || 0
    @limit  limit
    @offset page * limit
  
  # Tile.within(3, origin: [42.12415, -81.3815719]).all()  
  within: (options) ->
    throw new Error("within not yet implemented")
    
  clone: ->
    new @(Metro.Support.Object.cloneHash(@query), Metro.Support.Object.cloneHash(@options))

module.exports = Metro.Model.Criteria
