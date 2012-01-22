class Tower.Model.Scope extends Tower.Class
  @scopes: [
    "where", 
    "order", 
    "asc", 
    "desc", 
    "limit", 
    "offset", 
    "select", 
    "joins", 
    "includes", 
    "excludes", 
    "paginate", 
    "within", 
    "allIn", 
    "allOf", 
    "alsoIn", 
    "anyIn", 
    "anyOf", 
    "near", 
    "notIn"
  ]
  
  @finders: [
    "find", 
    "all", 
    "first", 
    "last", 
    "count"
  ]
  
  @builders: [
    "build", 
    "create", 
    "update", 
    "delete", 
    "destroy"
  ]
  
  constructor: (options = {}) ->
    @model    = options.model
    @criteria = options.criteria || new Tower.Model.Criteria
    @store    = @model.store()
  
  for key in @scopes
    do (key) =>
      @::[key] = ->
        clone = @clone()
        clone.criteria[key](arguments...)
        clone
  
  find: ->
    {criteria, callback} = @_extractArgs(arguments, ids: true)
    {query, options} = criteria
    if query.id && query.id.hasOwnProperty("$in") && query.id.$in.length == 1
      @store.findOne query, options, callback
    else
      @store.find query, options, callback
    
  first: (callback) ->
    criteria = @toCriteria("asc")
    @store.findOne criteria.query, criteria.options, callback
    
  last: (callback) ->
    criteria = @toCriteria("desc")
    @store.findOne criteria.query, criteria.options, callback
  
  all: (callback) ->
    criteria  = @toCriteria()
    @store.find criteria.query, criteria.options, callback
    
  count: (callback) ->
    criteria  = @criteria
    @store.count criteria.query, criteria.options, callback
  
  build: (attributes, callback) ->
    @store.build Tower.Support.Object.extend(@criteria.query, attributes), @criteria.options, callback
  
  # create [{firstName: "Lance"}, {firstName: "Dane"}]
  # create [{firstName: "Lance"}, {firstName: "Dane"}], validate: false
  # create {firstName: "Lance"}, validate: false
  # create validate: false
  create: ->
    {criteria, updates, callback} = @_extractArgs(arguments, updates: true, options: true, ids: false)
    @store.create Tower.Support.Object.extend({}, criteria.query, updates), criteria.options, callback
  
  update: ->
    {criteria, updates, options, callback} = @_extractArgs(arguments, ids: true, updates: true, options: true)
    @store.update updates, criteria.query, criteria.options, callback
    
  destroy: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true, options: true)
    @store.destroy criteria.query, criteria.options, callback
    
  delete: ->
    @destroy.apply @, arguments
    
  merge: (scope) ->
    @criteria.merge(scope.criteria)
    
  clone: ->
    new @constructor(model: @model, criteria: @criteria.clone())
  
  _extractArgs: (args, opts = {}) ->
    args        = Tower.Support.Array.args(args)
    
    if typeof args[args.length - 1] == "function"
      callback  = args.pop()
    else
      callback  = undefined
      
    if opts.updates && Tower.Support.Object.isHash(args[args.length - 1])
      updates   = args.pop()
      
    if Tower.Support.Object.isHash(args[args.length - 1])
      if updates
        options   = updates
        updates   = args.pop()
      else
        options   = args.pop()
      
    updates     = {} unless opts.updates
    updates ||= {}
    
    criteria    = @criteria.clone()
    options     = _.extend criteria.options, options
    
    options.instantiate = true unless options.hasOwnProperty("instantiate")
    
    ids         = _.flatten(args) if opts.ids && args.length > 0
    
    if ids && ids.length > 0
      delete criteria.query.id
      criteria.where id: $in: ids
    
    criteria: criteria, updates: updates, callback: callback
    
  toCriteria: (sortDirection) ->
    criteria = @criteria
    
    if sortDirection || !criteria.options.hasOwnProperty("sort")
      criteria  = criteria.clone()
      sort      = @model.defaultSort()
      criteria[sortDirection || sort.direction](sort.name) if sort
    
    criteria

module.exports = Tower.Model.Scope
