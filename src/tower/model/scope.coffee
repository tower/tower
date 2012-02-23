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
    "destroy"
  ]
  
  constructor: (options = {}) ->
    @model    = options.model
    @criteria = options.criteria || new Tower.Model.Criteria
    
  store: ->
    @model.store()
  
  find: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true)
    {conditions, options} = criteria.toQuery()
    @_find conditions, options, callback
    
  first: (callback) ->
    {conditions, options} = @toQuery("asc")
    @store().findOne conditions, options, callback
    
  last: (callback) ->
    {conditions, options} = @toQuery("desc")
    @store().findOne conditions, options, callback
  
  all: (callback) ->
    {conditions, options} = @toQuery()
    @store().find conditions, options, callback
    
  count: (callback) ->
    {conditions, options} = @toQuery()
    @store().count conditions, options, callback
    
  exists: (callback) ->
    {conditions, options} = @toQuery()
    @store().exists conditions, options, callback
    
  batch: ->
    
  fetch: ->
    
  sync: ->
  
  transaction: ->
    
  build: (attributes, options) ->
    {conditions, options} = @toCreate()
    @_build attributes, conditions, options
  
  # User.create(firstName: "Lance")
  # User.where(firstName: "Lance").create()
  # User.where(firstName: "Lance").create([{lastName: "Pollard"}, {lastName: "Smith"}])
  # User.where(firstName: "Lance").create(new User(lastName: "Pollard"))
  # create(attributes)
  # create([attributes, attributes])
  # create(attributes, options)
  create: ->
    {criteria, data, options, callback} = @_extractArgs(arguments, data: true)
    criteria.mergeOptions(options)
    @_create criteria, data, options, callback
  
  # User.where(firstName: "Lance").update(1, 2, 3)
  # User.update(User.first(), User.last(), firstName: "Lance")
  # User.update([User.first(), User.last()], firstName: "Lance")
  # User.update([1, 2], firstName: "Lance")
  update: ->
    {criteria, data, options, callback} = @_extractArgs(arguments, ids: true, data: true)
    criteria.mergeOptions(options)
    @_update criteria, data, options, callback
    
  destroy: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true)
    criteria.mergeOptions(options)
    @_destroy criteria, options, callback
  
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
    
  _find: (conditions, options, callback) ->
    if conditions.id && conditions.id.hasOwnProperty("$in") && conditions.id.$in.length == 1
      @store().findOne conditions, options, callback
    else
      @store().find conditions, options, callback
    
  _build: (attributes, conditions, options) ->
    if Tower.Support.Object.isArray(attributes)
      result  = []
      for object in attributes
        result.push @store().serializeModel(Tower.Support.Object.extend({}, conditions, object))
      result
    else
      @store().serializeModel(Tower.Support.Object.extend({}, conditions, attributes))
  
  _create: (criteria, data, opts, callback) ->
    if opts.instantiate
      isArray = Tower.Support.Object.isArray(data)
      records = Tower.Support.Object.toArray(@build(data))
      
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
      @store().create data, opts, callback
      
  _update: (criteria, data, opts, callback) ->    
    {conditions, options} = criteria.toQuery()
    if opts.instantiate
      iterator = (record, next) ->
        record.updateAttributes(data, next)
        
      @_each conditions, options, iterator, callback
    else
      @store().update data, conditions, options, callback
  
  _destroy: (criteria, opts, callback) ->
    {conditions, options} = criteria.toQuery()
    if opts.instantiate
      iterator = (record, next) ->
        record.destroy(next)
        
      @_each conditions, options, iterator, callback
    else
      @store().destroy conditions, options, callback
    
  _each: (conditions, options, iterator, callback) ->
    @store().find conditions, options, (error, records) =>
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
    last            = args[args.length - 1]
    
    if opts.data && (Tower.Support.Object.isHash(last) || Tower.Support.Object.isArray(last))
      data    = args.pop()
      
    if Tower.Support.Object.isHash(args[args.length - 1])
      if data
        options     = data
        data  = args.pop()
      else
        options     = args.pop()
      
    data      = {} unless opts.data
    data    ||= {}
    criteria        = @criteria.clone()
    options       ||= {}
    
    options.instantiate = true unless options.hasOwnProperty("instantiate")
    
    ids             = _.flatten(args) if opts.ids && args.length > 0
    
    if ids && ids.length > 0
      criteria.where id: $in: _.map(ids, (idOrRecord) -> if idOrRecord instanceof Tower.Model then idOrRecord.get("id") else idOrRecord)
    
    criteria: criteria, data: data, callback: callback, options: options
    
for key in Tower.Model.Scope.scopes
  do (key) =>
    Tower.Model.Scope::[key] = ->
      clone = @clone()
      clone.criteria[key](arguments...)
      clone

module.exports = Tower.Model.Scope
