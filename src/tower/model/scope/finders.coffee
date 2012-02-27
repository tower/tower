Tower.Model.Scope.Finders =
  ClassMethods:
    finderMethods: [
      "find", 
      "all", 
      "first", 
      "last", 
      "count",
      "exists"
    ]
  
  find: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true)
    {conditions, options} = criteria.toQuery()
    @_find conditions, options, callback
    
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
    
  fetch: ->
    
  _find: (conditions, options, callback) ->
    if conditions.id && conditions.id.hasOwnProperty("$in") && conditions.id.$in.length == 1
      @store.findOne conditions, options, callback
    else if conditions.id && !conditions.id.hasOwnProperty("$in")
      conditions.id = {$in: Tower.Support.Object.toArray(conditions.id)}
      @store.findOne conditions, options, callback
    else
      @store.find conditions, options, callback
    
module.exports = Tower.Model.Scope.Finders
