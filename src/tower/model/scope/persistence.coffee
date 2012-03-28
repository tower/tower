Tower.Model.Scope.Persistence =
  ClassMethods:
    persistenceMethods: [
      "create",
      "update",
      "destroy"
    ]

  build: ->
    @_build.apply @, @toCriteria(arguments, data: true)
    
  create: ->
    @_create.apply @, @toCriteria(arguments, data: true)
    
  update: ->
    @_update.apply @, @toCriteria(arguments, ids: true, data: true)
  
  destroy: ->
    @_destroy.apply @, @toCriteria(arguments, ids: true)
    
  # @private
  _build: (attributes, conditions, options) ->
    store = @store
    
    if Tower.Support.Object.isArray(attributes)
      result  = []
      for object in attributes
        if object instanceof Tower.Model
          Tower.Support.Object.extend(object.attributes, conditions, object.attributes)
        else
          object = @store.serializeModel(Tower.Support.Object.extend({}, conditions, object))
          
        result.push object
      result
    else
      if attributes instanceof Tower.Model
        Tower.Support.Object.extend(attributes.attributes, conditions, attributes.attributes)
      else
        attributes = @store.serializeModel(Tower.Support.Object.extend({}, conditions, attributes))
      
      attributes

  # @private
  _create: (criteria, callback) ->
    if criteria.instantiate
      records = Tower.Support.Object.toArray(@build(criteria.records))
      
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
      @store.create criteria

  # @private
  _update: (criteria, callback) ->
    if criteria.instantiate
      iterator = (record, next) ->
        record.updateAttributes(criteria.args, next)

      @_each criteria, iterator, callback
    else
      @store.update criteria, callback

  # @private
  _destroy: (criteria) ->
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
