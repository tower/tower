# @module
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
    @_find.apply @, @_extractArgsForFind(arguments)
  
  # Find the first record matching this scope's criteria.
  # 
  # @param [Function] callback
  first: (callback) ->
    criteria = @compile()
    criteria.defaultSort("asc")
    @store.findOne criteria, callback

  # Find the last record matching this scope's criteria.
  # 
  # @param [Function] callback
  last: (callback) ->
    criteria = @compile()
    criteria.defaultSort("desc")
    @store.findOne conditions, options, callback

  # Find all the records matching this scope's criteria.
  # 
  # @param [Function] callback
  all: (callback) ->
    @store.find @compile(), callback

  # Count the number of records matching this scope's criteria.
  # 
  # @param [Function] callback
  count: (callback) ->
    @store.count @compile(), callback

  # Check if a record exists that matches this scope's criteria.
  # 
  # @param [Function] callback
  exists: (callback) ->
    @store.exists @compile(), callback
  
  # @todo
  batch: ->
    @

  # @todo
  fetch: ->

  # @private
  _find: (criteria, callback) ->
    if criteria.options.findOne
      @store.findOne criteria, callback
    else
      @store.find criteria, callback

module.exports = Tower.Model.Scope.Finders
