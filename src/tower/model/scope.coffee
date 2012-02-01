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
    {criteria, options, callback} = @_extractArgs(arguments, ids: true)
    {conditions, options} = criteria.toQuery()
    @_find conditions, options, callback
    
  _find: (conditions, options, callback) ->
    if conditions.id && conditions.id.hasOwnProperty("$in") && conditions.id.$in.length == 1
      @store.findOne conditions, options, callback
    else
      @store.find conditions, options, callback
    
  first: (callback) ->
    {conditions, options} = @toQuery("asc")
    @store.findOne conditions, options, callback
    
  last: (callback) ->
    {conditions, options} = @toQuery("desc")
    @store.findOne conditions, options, callback
  
  all: (callback) ->
    {conditions, options} = @toQuery()
    @store.find conditions, options, callback
    
  count: (callback) ->
    {conditions, options} = @toQuery()
    @store.count conditions, options, callback
    
  exists: (callback) ->
    {conditions, options} = @toQuery()
    @store.exists conditions, options, callback
    
  batch: ->
    
  build: (attributes, options) ->
    {conditions, options} = @toCreate()
    @_build attributes, conditions, options
    
  create: ->
    {criteria, attributes, options, callback} = @_extractArgs(arguments, attributes: true)
    criteria.where(attributes)
    criteria.mergeOptions(options)
    @_create criteria.toCreate().attributes, options, callback
  
  update: ->
    {criteria, attributes, options, callback} = @_extractArgs(arguments, ids: true, attributes: true)
    criteria.mergeOptions(options)
    @_update criteria, attributes, options, callback
    
  destroy: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true)
    criteria.mergeOptions(options)
    @_destroy criteria, options, callback
  
  delete: @::destroy
  
  transaction: ->
    
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
    
  _build: (attributes, conditions, options) ->
    if Tower.Support.Object.isArray(attributes)
      result  = []
      for object in attributes
        result.push @store.serializeModel(Tower.Support.Object.extend({}, conditions, object))
      result
    else
      @store.serializeModel(Tower.Support.Object.extend({}, conditions, attributes))

  _create: (attributes, options, callback) ->
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
      
  _update: (criteria, attributes, opts, callback) ->    
    {conditions, options} = criteria.toQuery()
    
    if opts.instantiate
      iterator = (record, next) -> record.updateAttributes(attributes, next)
      @_each conditions, options, iterator, callback
    else
      @store.update attributes, conditions, options, callback
  
  _destroy: (criteria, opts, callback) ->
    {conditions, options} = criteria.toQuery()
    
    if opts.instantiate
      iterator = (record, next) -> record.destroy(next)
      @_each conditions, options, iterator, callback
    else
      @store.destroy conditions, options, callback
    
  _each: (conditions, options, iterator, callback) ->
    @store.find conditions, options, (error, records) =>
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
      criteria.where id: $in: ids
    
    criteria: criteria, attributes: attributes, callback: callback, options: options

module.exports = Tower.Model.Scope
