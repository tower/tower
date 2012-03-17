class Tower.Model.Scope extends Tower.Class
  constructor: (options = {}) ->
    @model    = options.model
    @criteria = options.criteria || new Tower.Model.Criteria
    @store    = @model.store()
  
  toQuery: (sortDirection) ->
    @toCriteria(sortDirection).toQuery()
    
  toCriteria: (sortDirection) ->
    criteria = @criteria.clone()
    
    if sortDirection || !criteria._order.length > 0
      sort      = @model.defaultSort()
      criteria[sortDirection || sort.direction](sort.name) if sort
    
    criteria
    
  toCreate: ->
    @toQuery()
    
  toUpdate: ->
    @toQuery()
    
  toDestroy: ->
    
  merge: (scope) ->
    @criteria.merge(scope.criteria)
    
  clone: ->
    new @constructor(model: @model, criteria: @criteria.clone())
    
  # @private
  _extractArgs: (args, opts = {}) ->
    args            = Tower.Support.Array.args(args)
    callback        = Tower.Support.Array.extractBlock(args)
    last            = args[args.length - 1]
    
    if opts.data && (Tower.Support.Object.isHash(last) || Tower.Support.Object.isArray(last))
      data    = args.pop()

    if Tower.Support.Object.isHash(args[args.length - 1])
      if data
        options = data
        data    = args.pop()
      else      
        if Tower.Support.Object.isBaseObject(args[args.length - 1])
          options     = args.pop()
      
    data      = {} unless opts.data
    data    ||= {}
    criteria        = @criteria.clone()
    options       ||= {}
    
    options.instantiate = true unless options.hasOwnProperty("instantiate")
    
    ids             = _.flatten(args) if opts.ids && args.length > 0
    
    if ids && ids.length > 0
      ids = _.map(ids, (idOrRecord) -> if idOrRecord instanceof Tower.Model then idOrRecord.get("id") else idOrRecord)
      criteria.where id: $in: ids
    
    criteria: criteria, data: data, callback: callback, options: options
    
require './scope/finders'
require './scope/persistence'
require './scope/queries'

Tower.Model.Scope.include Tower.Model.Scope.Finders
Tower.Model.Scope.include Tower.Model.Scope.Persistence
Tower.Model.Scope.include Tower.Model.Scope.Queries
    
for key in Tower.Model.Scope.queryMethods
  do (key) =>
    Tower.Model.Scope::[key] = ->
      clone = @clone()
      clone.criteria[key](arguments...)
      clone

module.exports = Tower.Model.Scope