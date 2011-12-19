class Coach.Model.Criteria
  constructor: (query = {}, options = {}) ->
    @query      = query
    @options    = options
  
  _mergeQuery: (conditions = {}) ->
    Coach.Support.Object.extend(@query, conditions)
    
  _mergeOptions: (options = {}) ->
    Coach.Support.Object.extend(@options, options)
    
  where: (conditions) ->
    @_mergeQuery conditions
    
  order: (attribute, direction = "asc") ->
    @_mergeOptions sort: [attribute, direction]
    
  offset: (number) ->
    @_mergeOptions offset: number
    
  limit: (number) ->
    @_mergeOptions limit: number
    
  select: ->
    @_mergeOptions fields: Coach.Support.Array.args(arguments)
    
  joins: ->
    @_mergeOptions joins: Coach.Support.Array.args(arguments)
    
  includes: ->
    @_mergeOptions includes: Coach.Support.Array.args(arguments)
    
  # paginate perPage: 20, page: 20
  # Tile.paginate(perPage: 20, page: 3).where(title: "=~": "Hello").all()
  paginate: (options) ->
    limit   = options.perPage || options.limit
    page    = options.page || 0
    @limit  limit
    @offset page * limit
  
  # Tile.within(3, origin: [42.12415, -81.3815719]).all()  
  within: (options) ->
    @
    
  clone: ->
    new @(Coach.Support.Object.cloneHash(@query), Coach.Support.Object.cloneHash(@options))

module.exports = Coach.Model.Criteria
