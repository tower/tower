# Interface to {Tower.Model.Criteria}, used to build database operations.
class Tower.Model.Scope extends Tower.Class
  @finderMethods: [
    "find",
    "all",
    "first",
    "last",
    "count",
    "exists",
    "instantiate",
    "pluck"
  ]
  
  @persistenceMethods: [
    "create",
    "update",
    "destroy",
    "build"
  ]
  
  # These methods are added to {Tower.Model}.
  @queryMethods: [
    "where",
    "order",
    "sort",
    "asc",
    "desc",
    "gte",
    "gt",
    "lte",
    "lt",
    "limit",
    "offset",
    "select",
    "joins",
    "includes",
    "excludes",
    "paginate",
    "page",
    "allIn",
    "allOf",
    "alsoIn",
    "anyIn",
    "anyOf",
    "notIn",
    "near",
    "within"
  ]

  # Map of human readable query operators to
  # normalized query operators to pass to a {Tower.Store}.
  @queryOperators:
    ">=":       "$gte"
    "$gte":     "$gte"
    ">":        "$gt"
    "$gt":      "$gt"
    "<=":       "$lte"
    "$lte":     "$lte"
    "<":        "$lt"
    "$lt":      "$lt"
    "$in":      "$in"
    "$nin":     "$nin"
    "$any":     "$any"
    "$all":     "$all"
    "=~":       "$regex"
    "$m":       "$regex"
    "$regex":   "$regex"
    "$match":   "$match"
    "$notMatch":   "$notMatch"
    "!~":       "$nm"
    "$nm":      "$nm"
    "=":        "$eq"
    "$eq":      "$eq"
    "!=":       "$neq"
    "$neq":     "$neq"
    "$null":    "$null"
    "$notNull": "$notNull"
    "$near":    "$near"
    
  constructor: (criteria) ->
    @criteria = criteria
  
  # Check if this scope or relation contains this object
  # 
  # @param [Object] object an object or array of objects.
  has: (object) ->
    @criteria.has(object)
  
  # Builds one or many records based on the scope's criteria.
  # 
  # @example Build single record
  #   App.User.build(firstName: "Lance")
  # 
  # @example Build multiple records
  #   # splat arguments
  #   App.User.build({firstName: "Lance"}, {firstName: "John"})
  #   # or pass in an explicit array of records
  #   App.User.build([{firstName: "Lance"}, {firstName: "John"}])
  # 
  # @example Build by passing in records
  #   App.User.build(new User(firstName: "Lance"))
  # 
  # @example Build from scope
  #   # single record
  #   App.User.where(firstName: "Lance").build()
  #   # multiple records
  #   App.User.where(firstName: "Lance").build([{lastName: "Pollard"}, {lastName: "Smith"}])
  # 
  # @example Build without instantiating the object in memory
  #   App.User.options(instantiate: false).where(firstName: "Lance").build()
  # 
  # @return [void] Requires a callback to get the data.
  build: ->
    criteria        = @compile()
    args            = _.args(arguments)
    callback        = _.extractBlock(args)
    # for `create`, the rest of the arguments must be records
    
    criteria.addData(args)
    
    criteria.build(callback)
    
  # Creates one or many records based on the scope's criteria.
  # 
  # @example Create single record
  #   App.User.create(firstName: "Lance")
  # 
  # @example Create multiple records
  #   # splat arguments
  #   App.User.create({firstName: "Lance"}, {firstName: "John"})
  #   # or pass in an explicit array of records
  #   App.User.create([{firstName: "Lance"}, {firstName: "John"}])
  # 
  # @example Create by passing in records
  #   App.User.create(new User(firstName: "Lance"))
  # 
  # @example Create from scope
  #   # single record
  #   App.User.where(firstName: "Lance").create()
  #   # multiple records
  #   App.User.where(firstName: "Lance").create([{lastName: "Pollard"}, {lastName: "Smith"}])
  # 
  # @example Create without instantiating the object in memory
  #   App.User.options(instantiate: false).where(firstName: "Lance").create()
  # 
  # @return [void] Requires a callback to get the data.
  create: ->
    criteria        = @compile()
    args            = _.args(arguments)
    callback        = _.extractBlock(args)
    # for `create`, the rest of the arguments must be records
    
    criteria.addData(args)
    
    criteria.create(callback)
  
  # Updates records based on the scope's criteria.
  # 
  # @example Update by id
  #   App.User.update(1, firstName: "Lance")
  #   App.User.update(1, 2, firstName: "Lance")
  #   App.User.update([1, 2], firstName: "Lance")
  # 
  # @example Update all
  #   App.User.update(firstName: "Lance")
  # 
  # @example Update by passing in records
  #   App.User.update(userA, firstName: "Lance")
  #   App.User.update(userA, userB, firstName: "Lance")
  #   App.User.update([userA, userB], firstName: "Lance")
  # 
  # @example Update from scope
  #   App.User.where(firstName: "John").update(firstName: "Lance")
  #   App.User.where(firstName: "John").update(1, 2, 3, firstName: "Lance")
  # 
  # @return [void] Requires a callback to get the data.
  update: ->
    criteria        = @compile()
    args            = _.flatten _.args(arguments)
    callback        = _.extractBlock(args)
    # for `update`, the last argument before the callback must be the updates you're making
    updates         = args.pop()
    
    throw new Error("Must pass in updates hash") unless updates && typeof updates == "object"
    
    criteria.addData(updates)
    
    criteria.addIds(args)
      
    criteria.update(callback)
  
  # Deletes records based on the scope's criteria.
  #
  # @example Destroy by id
  #   App.User.destroy(1)
  #   App.User.destroy(1, 2)
  #   App.User.destroy([1, 2])
  # 
  # @example Destroy all
  #   App.User.destroy()
  # 
  # @example Update by passing in records
  #   App.User.destroy(userA)
  #   App.User.destroy(userA, userB)
  #   App.User.destroy([userA, userB])
  # 
  # @example Update from scope
  #   App.User.where(firstName: "John").destroy()
  #   App.User.where(firstName: "John").destroy(1, 2, 3)
  # 
  # @return [void] Requires a callback to get the data.
  destroy: ->
    criteria        = @compile()
    args            = _.flatten _.args(arguments)
    callback        = _.extractBlock(args)
    
    criteria.addIds(args)
      
    criteria.destroy(callback)
  
  # Add to set.
  add: ->
    criteria        = @compile()
    args            = _.args(arguments)
    callback        = _.extractBlock(args)
    # for `create`, the rest of the arguments must be records
    
    criteria.addData(args)
    
    criteria.add(callback)
    
  # Remove from set.
  remove: ->
    criteria        = @compile()
    args            = _.flatten _.args(arguments)
    callback        = _.extractBlock(args)
    
    criteria.addIds(args)
      
    criteria.remove(callback)
  
  # Updates one or many records based on the scope's criteria.
  # 
  # @example Find single record
  #   # find record with `id` 45
  #   App.User.find(45)
  # 
  # @example Find multiple records
  #   # splat arguments
  #   App.User.find(10, 20)
  #   # or pass in an explicit array of records
  #   App.User.find([10, 20])
  # 
  # @example Create from scope
  #   App.User.where(firstName: "Lance").find(1, 2)
  # 
  # @return [undefined] Requires a callback to get the data.
  find: ->
    criteria        = @compile()
    args            = _.flatten _.args(arguments)
    callback        = _.extractBlock(args)
    
    criteria.addIds(args)
      
    criteria.find(callback)
  
  # Find the first record matching this scope's criteria.
  # 
  # @param [Function] callback
  first: (callback) ->
    criteria = @compile()
    criteria.findOne(callback)

  # Find the last record matching this scope's criteria.
  # 
  # @param [Function] callback
  last: (callback) ->
    criteria = @compile()
    criteria.reverseSort()
    criteria.findOne(callback)

  # Find all the records matching this scope's criteria.
  # 
  # @param [Function] callback
  all: (callback) ->
    @compile().find(callback)
    
  # Returns an array of column values directly from the underlying table/collection.
  # This also works with serialized attributes.
  # @todo
  pluck: (attributes...) ->
    @compile().find(callback)
    
  # Show query that will be used for the datastore.
  # @todo
  explain: ->
    @compile().explain(callback)

  # Count the number of records matching this scope's criteria.
  # 
  # @param [Function] callback
  count: (callback) ->
    @compile().count(callback)

  # Check if a record exists that matches this scope's criteria.
  # 
  # @param [Function] callback
  exists: (callback) ->
    @compile().exists(callback)
  
  # @todo
  batch: ->
    @

  # @todo
  fetch: ->
    
  # Metadata.
  # 
  # @param [Object] options
  # 
  # @return [Object] returns all of the options.
  options: (options) ->
    _.extend @criteria.options, options
    
  compile: ->
    @criteria.clone()
  
  # Clone this scope (and the critera attached to it).
  # 
  # @return [Tower.Model.Scope]
  clone: ->
    new @constructor(@criteria.clone())

for key in Tower.Model.Scope.queryMethods
  do (key) =>
    Tower.Model.Scope::[key] = ->
      clone = @clone()
      clone.criteria[key](arguments...)
      clone

module.exports = Tower.Model.Scope