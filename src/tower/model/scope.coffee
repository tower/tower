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
    @store.find criteria.query, criteria.options, callback
    
  all: (callback) ->
    @store.find @criteria.query, @criteria.options, callback
    
  first: (callback) ->
    @store.findOne @criteria.query, @criteria.options, callback
    
  last: (callback) ->
    @store.findOne @criteria.query, @criteria.options, callback
    
  count: (callback) ->
    @store.count @criteria.query, @criteria.options, callback
  
  build: (attributes, callback) ->
    @store.build Tower.Support.Object.extend(@criteria.query, attributes), @criteria.options, callback
  
  create: (attributes, callback) ->
    @store.create Tower.Support.Object.extend({}, @criteria.query, attributes), @criteria.options, callback
  
  update: ->
    {criteria, updates, options, callback} = @_extractArgs(arguments, ids: true, updates: true, options: true)
    
    if options.instantiate || options.validate
      @store.find criteria.query, criteria.options, (error, records) =>
        if error
          callback.call @, error, records
        else
          iterator = (record, next) ->
            record.updateAttributes updates, next
          
          Tower.async.forEachSeries records, iterator, callback
    else
      @store.update updates, criteria.query, criteria.options, callback
  
  delete: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true, options: true)
    
    if options.instantiate || options.validate
      @store.find criteria.query, criteria.options, (error, records) =>
        if error
          callback.call @, error, records
        else
          iterator = (record, next) ->
            record.destroy next
          
          Tower.async.forEachSeries records, iterator, callback
    else
      @store.delete criteria.query, criteria.options, callback
    
  destroy: ->
    @delete arguments...
    
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
        
    updates     = undefined unless opts.updates
    options ||= {}
    options.instantiate = true unless options.hasOwnProperty("instantiate")
    options.validate    = true unless !options.instantiate || options.hasOwnProperty("validate")
    
    ids         = _.flatten(args) if opts.ids && args.length > 0
    criteria    = @criteria
    
    if ids && ids.length > 0
      criteria  = criteria.clone()
      delete criteria.query.id
      criteria.where id: $in: ids
    
    criteria: criteria, options: options, updates: updates, callback: callback

module.exports = Tower.Model.Scope
