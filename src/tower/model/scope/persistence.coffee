# @module
Tower.Model.Scope.Persistence =
  ClassMethods:
    persistenceMethods: [
      "create",
      "update",
      "destroy"
    ]

  # Builds one or many records based on the scope's criteria.
  # 
  # @example Build single record
  #   App.User.build(firstName: "Lance")
  # 
  # @example Build multiple records
  #   # splat arguments
  #   App.User.build({firstName: "Lance"}, {firstName: "John"})
  #   # or pass in an explicit array of records
  #   App.User.build([{firstName: "Lance"}, {firstName: "John"}])
  # 
  # @example Build by passing in records
  #   App.User.build(new User(firstName: "Lance"))
  # 
  # @example Build from scope
  #   # single record
  #   App.User.where(firstName: "Lance").build()
  #   # multiple records
  #   App.User.where(firstName: "Lance").build([{lastName: "Pollard"}, {lastName: "Smith"}])
  # 
  # @example Build without instantiating the object in memory
  #   App.User.options(instantiate: false).where(firstName: "Lance").build()
  # 
  # @return [void] Requires a callback to get the data.
  build: ->
    @_build.apply @, @_extractArgsForBuild(arguments, data: true)
    
  # Creates one or many records based on the scope's criteria.
  # 
  # @example Create single record
  #   App.User.create(firstName: "Lance")
  # 
  # @example Create multiple records
  #   # splat arguments
  #   App.User.create({firstName: "Lance"}, {firstName: "John"})
  #   # or pass in an explicit array of records
  #   App.User.create([{firstName: "Lance"}, {firstName: "John"}])
  # 
  # @example Create by passing in records
  #   App.User.create(new User(firstName: "Lance"))
  # 
  # @example Create from scope
  #   # single record
  #   App.User.where(firstName: "Lance").create()
  #   # multiple records
  #   App.User.where(firstName: "Lance").create([{lastName: "Pollard"}, {lastName: "Smith"}])
  # 
  # @example Create without instantiating the object in memory
  #   App.User.options(instantiate: false).where(firstName: "Lance").create()
  # 
  # @return [void] Requires a callback to get the data.
  create: ->
    @_create.apply @, @_extractArgsForCreate(arguments)
  
  # Updates records based on the scope's criteria.
  # 
  # @example Update by id
  #   App.User.update(1, firstName: "Lance")
  #   App.User.update(1, 2, firstName: "Lance")
  #   App.User.update([1, 2], firstName: "Lance")
  # 
  # @example Update all
  #   App.User.update(firstName: "Lance")
  # 
  # @example Update by passing in records
  #   App.User.update(userA, firstName: "Lance")
  #   App.User.update(userA, userB, firstName: "Lance")
  #   App.User.update([userA, userB], firstName: "Lance")
  # 
  # @example Update from scope
  #   App.User.where(firstName: "John").update(firstName: "Lance")
  #   App.User.where(firstName: "John").update(1, 2, 3, firstName: "Lance")
  # 
  # @return [void] Requires a callback to get the data.
  update: ->
    @_update.apply @, @_extractArgsForUpdate(arguments)
  
  # Deletes records based on the scope's criteria.
  #
  # @example Destroy by id
  #   App.User.destroy(1)
  #   App.User.destroy(1, 2)
  #   App.User.destroy([1, 2])
  # 
  # @example Destroy all
  #   App.User.destroy()
  # 
  # @example Update by passing in records
  #   App.User.destroy(userA)
  #   App.User.destroy(userA, userB)
  #   App.User.destroy([userA, userB])
  # 
  # @example Update from scope
  #   App.User.where(firstName: "John").destroy()
  #   App.User.where(firstName: "John").destroy(1, 2, 3)
  # 
  # @return [void] Requires a callback to get the data.
  destroy: ->
    @_destroy.apply @, @_extractArgsForDestroy(arguments)
  
  # @private
  _build: (scope, callback) ->
    criteria    = scope.criteria
    store       = @store
    attributes  = {}#criteria.build()
    data        = criteria.values.data
    result      = []
    
    for item in data
      if item instanceof Tower.Model
        _.extend(item.attributes, attributes, item.attributes)
      else
        object = store.serializeModel(_.extend({}, attributes, item))
        
      result.push(object)
      
    if criteria.returnArray then result else result[0]
  
  # @private
  _create: (scope, callback) ->
    criteria = scope.criteria
    
    if criteria.values.options.instantiate
      returnArray = criteria.returnArray
      criteria.returnArray = true
      records     = @build(scope)
      criteria.returnArray = returnArray
      
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
          if returnArray
            callback(error, records)
          else
            callback(error, records[0])
    else
      @store.create criteria, callback

  # @private
  _update: (criteria, callback) ->
    if criteria.instantiate
      iterator = (record, next) ->
        record.updateAttributes(criteria.data, next)
      
      @_each criteria, iterator, callback
    else
      @store.update criteria, callback

  # @private
  _destroy: (criteria, callback) ->
    if criteria.instantiate
      iterator = (record, next) ->
        record.destroy(next)
        
      @_each criteria, iterator, callback
    else
      @store.destroy criteria, callback

  # @private
  _each: (criteria, iterator, callback) ->
    @store.find criteria, (error, records) =>
      if error
        callback.call @, error, records
      else
        Tower.parallel records, iterator, (error) =>
          unless callback
            throw error if error
          else
            callback.call @, error, records if callback


module.exports = Tower.Model.Scope.Persistence
