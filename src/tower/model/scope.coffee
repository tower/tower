class Tower.Model.Scope extends Tower.Class
  @scopes:    ["where", "order", "asc", "desc", "limit", "offset", "select", "joins", "includes", "excludes", "paginate", "within", "allIn", "allOf", "alsoIn", "anyIn", "anyOf", "near", "notIn"]
  @finders:   ["find", "all", "first", "last", "count"]
  @builders:  ["build", "create", "update", "delete", "destroy"]
  
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
    
  # find(1)
  # find(1, 2, 3)
  find: ->
    {criteria, callback} = @_extractArgs(arguments, ids: true)
    @store.find criteria.query, criteria.options, callback
    
  all: (callback) ->
    @store.all @criteria.query, @criteria.options, callback
    
  first: (callback) ->
    @store.first @criteria.query, @criteria.options, callback
    
  last: (callback) ->
    @store.last @criteria.query, @criteria.options, callback
    
  count: (callback) ->
    @store.count @criteria.query, @criteria.options, callback
  
  build: (attributes, callback) ->
    @store.build Tower.Support.Object.extend(@criteria.query, attributes), @criteria.options, callback
  
  # ## Examples
  #
  #     User.create name: "John", (error, record)
  #
  create: (attributes, callback) ->
    @store.create Tower.Support.Object.extend({}, @criteria.query, attributes), @criteria.options, callback
  
  # ## Examples
  #
  #     User.update 1, 2, 3, name: "John", (error, records)
  #     User.update 1, 2, 3, name: "John", (error)
  #     User.update [1, 2, 3], name: "John", (error, records)
  #     User.update [1, 2, 3], name: "John", (error)
  #     User.update name: "John", (error, records)
  #     User.update name: "John", (error)
  #     User.update 1, 2, 3, {name: "John"}, {instantiate: false, validate: false}, (error)
  #     User.update {name: "John"}, {instantiate: false, validate: false}, (error)
  #
  update: ->
    {criteria, updates, options, callback} = @_extractArgs(arguments, ids: true, updates: true, options: true)
    
    if options.instantiate || options.validate
      @store.all criteria.query, criteria.options, (error, records) =>
        if error
          callback.call @, error, records
        else
          iterator = (record, next) ->
            record.updateAttributes updates, next
          
          Tower.async.forEachSeries records, iterator, callback
    else
      @store.update updates, criteria.query, criteria.options, callback
  
  # ## Examples
  # 
  #     # delete users 1, 2, and 3
  #     User.delete 1, 2, 3, (error, records)
  #     User.delete [1, 2, 3], (error, records)
  #     User.delete [1, 2, 3], (error)
  #     User.delete 1, 2, 3, {instantiate: false, validate: false}, (error)
  #     User.delete {instantiate: false, validate: false}, (error)
  # 
  delete: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true, options: true)
    
    if options.instantiate || options.validate
      @store.all criteria.query, criteria.options, (error, records) =>
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
    
  store: ->
    @model.store()
    
  merge: (scope) ->
    @criteria.merge(scope.criteria)
    
  # you want to clone it so you can reuse it multiple times:
  # 
  #     users = User.where(username: /santa/)
  #     newUsers = users.where(createdAt: ">=": _(2).days().ago())
  #     users.all()
  #     newUsers.all()
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
        
    # in case you're trying to cheat :)
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
