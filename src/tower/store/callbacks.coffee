Tower.Store.Callbacks =  
  # Prepare the criteria before you execute {#create},
  # perhaps for mimicking join tables in MongoDB.
  #
  # @return [void] Requires a callback.
  runBeforeCreate: (criteria, callback) ->
    callback()

  # Process the criteria after {#create}, perhaps for eager loading.
  #
  # @return [void] Requires a callback.
  runAfterCreate: (criteria, callback) ->
    #if criteria.throughRelation
    #  criteria.createThroughRelation(callback)
    #else
    #  callback()
    callback()

  # Prepare the criteria before you execute {#update}.
  #
  # @return [void] Requires a callback.
  runBeforeUpdate: (criteria, callback) ->
    if criteria.throughRelation
      criteria.appendThroughConditions(callback)
    else
      callback()

  # Process the criteria after {#update}.
  #
  # @return [void] Requires a callback.
  runAfterUpdate: (criteria, callback) ->
    callback()

  # Prepare the criteria before you execute {#destroy}.
  #
  # @return [void] Requires a callback.
  runBeforeDestroy: (criteria, callback) ->
    if criteria.throughRelation
      criteria.appendThroughConditions(callback)
    else
      callback()

  # Process the criteria after {#destroy}.
  #
  # @return [void] Requires a callback.
  runAfterDestroy: (criteria, callback) ->
    callback()

  # Prepare the criteria before you execute {#find}.
  #
  # @return [void] Requires a callback.
  runBeforeFind: (criteria, callback) ->
    if criteria.throughRelation
      criteria.appendThroughConditions(callback)
    else
      callback()

  # Process the criteria after {#find}.
  #
  # @return [void] Requires a callback.
  runAfterFind: (criteria, callback) ->
    callback()
    
module.exports = Tower.Store.Callbacks
