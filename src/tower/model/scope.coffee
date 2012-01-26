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
    "count",
    "exists"
  ]
  
  @builders: [
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
    
  exists: (callback) ->
    criteria  = @criteria
    @store.exists criteria.query, criteria.options, callback
    
  batch: ->
    
  build: (attributes, options) ->
    if Tower.Support.Object.isArray(attributes)
      result  = []
      for object in attributes
        result.push @store.serializeModel(object)
      result
    else
      @store.serializeModel(attributes)
  
  # create [{firstName: "Lance"}, {firstName: "Dane"}]
  # create [{firstName: "Lance"}, {firstName: "Dane"}], validate: false
  # create {firstName: "Lance"}, validate: false
  # create {}, validate: false
  create: ->
    {criteria, updates, options, callback} = @_extractArgs(arguments, updates: true, options: true, ids: false)
    
    attributes                    = Tower.Support.Object.extend({}, criteria.query, updates)
    
    if options.instantiate
      isArray = Tower.Support.Object.isArray(attributes)
      records = Tower.Support.Object.toArray(@build(attributes, options))
      
      iterator = (record, next) ->
        if record
          record.save(next)
        else
          next()
        
      Tower.async records, iterator, (error) =>
        unless callback
          throw error if error
        else
          return callback(error) if error
          if isArray
            callback(error, records)
          else
            callback(error, records[0])
    else
          
      @store.create attributes, options, callback
  
  update: ->
    {criteria, updates, options, callback} = @_extractArgs(arguments, ids: true, updates: true, options: true)
    
    if options.instantiate
      iterator = (record, next) -> record.updateAttributes(updates, next)
      @_each criteria.query, criteria.options, iterator, callback
    else
      @store.update updates, criteria.query, criteria.options, callback
  
  destroy: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true, options: true)
    
    if options.instantiate
      iterator = (record, next) -> record.destroy(next)
      @_each criteria.query, criteria.options, iterator, callback
    else
      @store.destroy criteria.query, criteria.options, callback
    
  delete: ->
    @destroy.apply @, arguments
    
  toCriteria: (sortDirection) ->
    criteria = @criteria
    
    if sortDirection || !criteria.options.hasOwnProperty("sort")
      criteria  = criteria.clone()
      sort      = @model.defaultSort()
      criteria[sortDirection || sort.direction](sort.name) if sort
    
    criteria
    
  merge: (scope) ->
    @criteria.merge(scope.criteria)
    
  clone: ->
    new @constructor(model: @model, criteria: @criteria.clone())
    
  _each: (query, options, iterator, callback) ->
    @store.find query, options, (error, records) =>
      if error
        callback.call @, error, records
      else
        Tower.async records, iterator, (error) =>
          unless callback
            throw error if error
          else
            callback.call @, error, records if callback
  
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
    updates   ||= {}
    
    criteria    = @criteria.clone()
    options   ||= {}
    
    options.instantiate = true unless options.hasOwnProperty("instantiate")
    
    ids         = _.flatten(args) if opts.ids && args.length > 0
    
    if ids && ids.length > 0
      delete criteria.query.id
      criteria.where id: $in: ids
    
    criteria: criteria, updates: updates, callback: callback, options: options

module.exports = Tower.Model.Scope
