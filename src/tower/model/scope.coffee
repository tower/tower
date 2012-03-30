# Class used to build a database query or operation.
# 
# @include Tower.Model.Scope.Finders
# @include Tower.Model.Scope.Persistence
# @include Tower.Model.Scope.Queries
class Tower.Model.Scope extends Tower.Class
  constructor: (options = {}) ->
    @model    = options.model
    @criteria = options.criteria || new Tower.Model.Criteria
    @store    = @model.store()

  toQuery: (sortDirection) ->
    @toCriteria(sortDirection).toQuery()

  compile: (sortDirection) ->
    criteria = @criteria.clone()
    
    if sortDirection || !criteria._order.length > 0
      sort      = @model.defaultSort()
      criteria[sortDirection || sort.direction](sort.name) if sort

    criteria
    
  toCriteria: @::compile
  
  # Merge another scope with this one.
  # 
  # @param [Tower.Model.Scope] scope
  # @return [Tower.Model.Scope]
  merge: (scope) ->
    @criteria.merge(scope.criteria)

  # Clone this scope (and the critera attached to it).
  # 
  # @return [Tower.Model.Scope]
  clone: ->
    new @constructor(model: @model, criteria: @criteria.clone())
  
  # Builds a criteria object out of dynamic arguments for the {Tower.Model.Scope.Persistence#build} method.
  # 
  # @return [Array] {Tower.Model.Criteria}, callback ({Tower.Model.Scope.Persistence#build})
  _extractArgsForBuild: (args) ->
    criteria        = @criteria.clone()
    args            = Tower.Support.Array.args(args)
    callback        = Tower.Support.Array.extractBlock(args)
    # for `create`, the rest of the arguments must be records
    
    criteria.addData(args)
    
    [criteria, callback]
    
  # Builds a criteria object out of dynamic arguments for the {#create} method.
  # 
  # @private
  _extractArgsForCreate: (args) ->
    @_extractArgsForBuild(args)

  # Builds a criteria object out of dynamic arguments for the {#update} method.
  # 
  # @private
  _extractArgsForUpdate: (args) ->
    criteria        = @criteria.clone()
    args            = _.flatten Tower.Support.Array.args(args)
    callback        = Tower.Support.Array.extractBlock(args)
    # for `update`, the last argument before the callback must be the updates you're making
    updates         = args.pop()
    
    throw new Error("Must pass in updates hash") unless updates && typeof updates == "object"
    
    if args.length
      ids = []
      
      for object in args
        continue unless object?
        ids.push if object instanceof Tower.Model then object.get('id') else object
      
      criteria.where(id: $in: ids)
      
    [criteria, callback]
  
  # Builds a criteria object out of dynamic arguments for the {#destroy} method.
  # 
  # @private
  _extractArgsForDestroy: (args) ->
    @_extractArgsForFind(args)
  
  # Builds a criteria object out of dynamic arguments for the {#find} method.
  # 
  # @private
  _extractArgsForFind: (args) ->
    criteria        = @criteria.clone()
    args            = _.flatten Tower.Support.Array.args(args)
    callback        = Tower.Support.Array.extractBlock(args)
    
    if args.length
      ids = []
      
      for object in args
        continue unless object?
        ids.push if object instanceof Tower.Model then object.get('id') else object
      
      criteria.where(id: $in: ids)
      
    [criteria, callback]

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