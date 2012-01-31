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
    {query, options, callback} = @_extractArgs(arguments, ids: true)
    @_find query, options, callback
    
  _find: (query, options, callback) ->
    if query.id && query.id.hasOwnProperty("$in") && query.id.$in.length == 1
      @store.findOne query, options, callback
    else
      @store.find query, options, callback
    
  first: (callback) ->
    criteria = @toQuery("asc")
    @store.findOne criteria.query, criteria.options, callback
    
  last: (callback) ->
    criteria = @toQuery("desc")
    @store.findOne criteria.query, criteria.options, callback
  
  all: (callback) ->
    criteria  = @toQuery()
    @store.find criteria.query, criteria.options, callback
    
  count: (callback) ->
    criteria  = @toQuery()
    @store.count criteria.query, criteria.options, callback
    
  exists: (callback) ->
    criteria  = @toQuery()
    @store.exists criteria.query, criteria.options, callback
    
  batch: ->
    
  build: (attributes, options) ->
    criteria = @toCreate()
    @_build attributes, criteria.query, criteria.options
    
  create: ->
    {criteria, attributes, options, callback} = @_extractArgs(arguments, attributes: true)
    criteria.mergeAttributes(attributes)
    criteria.mergeOptions(options)
    @_create criteria, callback
  
  update: ->
    {criteria, attributes, options, callback} = @_extractArgs(arguments, ids: true, attributes: true)
    criteria.mergeUpdates(attributes)
    criteria.mergeOptions(options)
    @_update criteria, callback
    
  destroy: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true)
    criteria.mergeOptions(options)
    @_destroy criteria, callback
  
  delete: @::destroy
  
  transaction: ->
    
  toQuery: (sortDirection) ->
    criteria = @criteria.clone()
    
    if sortDirection || !criteria.options.hasOwnProperty("sort")
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
    
  _build: (attributes, query, options) ->
    if Tower.Support.Object.isArray(attributes)
      result  = []
      for object in attributes
        result.push @store.serializeModel(Tower.Support.Object.extend({}, query, object))
      result
    else
      @store.serializeModel(Tower.Support.Object.extend({}, query, attributes))
      
  _create: (criteria, callback) ->
    
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
      
  _update: (criteria, callback) ->
    if options.instantiate
      iterator = (record, next) -> record.updateAttributes(attributes, next)
      @_each criteria.query, criteria.options, iterator, callback
    else
      @store.update attributes, criteria.query, criteria.options, callback
  
  _destroy: (criteria, callback) ->
    if options.instantiate
      iterator = (record, next) -> record.destroy(next)
      @_each criteria.query, criteria.options, iterator, callback
    else
      @store.destroy criteria.query, criteria.options, callback
    
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
    args            = Tower.Support.Array.args(args)
    callback        = Tower.Support.Array.extractBlock(args)
    
    if opts.attributes && Tower.Support.Object.isHash(args[args.length - 1])
      attributes    = args.pop()
      
    if Tower.Support.Object.isHash(args[args.length - 1])
      if attributes
        options     = attributes
        attributes  = args.pop()
      else
        options     = args.pop()
      
    attributes      = {} unless opts.attributes
    attributes    ||= {}
    criteria        = @criteria.clone()
    options       ||= {}
    
    options.instantiate = true unless options.hasOwnProperty("instantiate")
    
    ids             = _.flatten(args) if opts.ids && args.length > 0
    
    if ids && ids.length > 0
      delete criteria.query.id
      criteria.where id: $in: ids
    
    criteria: criteria, attributes: attributes, callback: callback, options: options

module.exports = Tower.Model.Scope
