# Right now this is only going to work on "referenced" associations.
# 
# @note Thinking about making ./referenced and ./embedded copies,
#   similar to how Mongoid does it.
class Tower.Model.Relation.HasMany extends Tower.Model.Relation
  # @option options [String|Function] beforeAdd Callback before an item is added.
  # @option options [String|Function] afterAdd Callback after an item is added.
  
  class @Criteria extends @Criteria
    isHasMany: true
    
    # @todo
    has: (object) ->
      object  = _.castArray(object)
      records = []
      return false unless records.length
      return false
    
    validate: (callback) ->
      unless @owner.isPersisted()
        throw new Error("You cannot call create unless the parent is saved")
        
      callback.call @
    
    create: (callback) ->
      @validate (error) =>
        @createReferenced(callback)

    update: (callback) ->
      @validate (error) =>
        @updateReferenced(callback)

    destroy: (callback) ->
      @validate (error) =>
        @destroyReferenced(callback)
        
    find: (callback) ->
      @validate (error) =>
        @findReferenced(callback)
        
    count: (callback) ->
      @validate (error) =>
        @compileForFind()
        
        @_runBeforeFindCallbacksOnStore =>
          @_count (error, record) =>
            unless error
              @_runAfterFindCallbacksOnStore =>
                callback.call @, error, record if callback
            else
              callback.call @, error, record if callback
              
    exists: (callback) ->
      @validate (error) =>
        @compileForFind()

        @_runBeforeFindCallbacksOnStore =>
          @_exists (error, record) =>
            unless error
              @_runAfterFindCallbacksOnStore =>
                callback.call @, error, record if callback
            else
              callback.call @, error, record if callback
        
    #find: (callback) ->
    #  @validate (error) =>
    #    @findReferenced(callback)
    
    createReferenced: (callback) ->
      @compileForCreate()
      
      @_runBeforeCreateCallbacksOnStore =>
        @_create (error, record) =>
          unless error
            #@_idCacheRecords(record)
            
            @_runAfterCreateCallbacksOnStore =>
              # add the id to the array on the owner record after it's created
              if @updateOwnerRecord()
                @owner.updateAttributes @ownerAttributes(record), (error) =>
                  callback.call @, error, record if callback
              else
                callback.call @, error, record if callback
          else
            callback.call @, error, record if callback
            
    updateReferenced: (callback) ->
      @compileForUpdate()
      
      @_runBeforeUpdateCallbacksOnStore =>
        @_update (error, record) =>
          unless error
            @_runAfterUpdateCallbacksOnStore =>
              callback.call @, error, record if callback
          else
            callback.call @, error, record if callback
            
    destroyReferenced: (callback) ->
      @compileForDestroy()
      
      @_runBeforeDestroyCallbacksOnStore =>
        @_destroy (error, record) =>
          unless error
            @_runAfterDestroyCallbacksOnStore =>
              if @updateOwnerRecord()
                @owner.updateAttributes @ownerAttributesForDestroy(record), (error) =>
                  callback.call @, error, record if callback
              else
                callback.call @, error, record if callback
          else
            callback.call @, error, record if callback
            
    findReferenced: (callback) ->
      @compileForFind()
      
      @_runBeforeFindCallbacksOnStore =>
        @_find (error, record) =>
          unless error
            @_runAfterFindCallbacksOnStore =>
              callback.call @, error, record if callback
          else
            callback.call @, error, record if callback

    # add to set
    add: (callback) ->
      throw new Error unless @relation.idCache
      
      @owner.updateAttributes @ownerAttributes(), (error) =>
        callback.call @, error, @data if callback

    # remove from set
    remove: (callback) ->
      throw new Error unless @relation.idCache
      
      @owner.updateAttributes @ownerAttributesForDestroy(), (error) =>
        callback.call @, error, @data if callback
    
    compile: ->
      owner           = @owner
      relation        = @relation
      inverseRelation = relation.inverse()
      
      id              = owner.get("id")
      
      data            = {}
      
      #if relation.idCache
      #  #defaults[relation.idCacheKey] = $in: [@owner.get("id")]
      #  defaults.id = $in: @owner.get(relation.idCacheKey)
      #  criteria.where(defaults)
      #else
      #  defaults[relation.foreignKey] = $in: @owner.get('id')
      #  criteria.where(defaults)
      
      if inverseRelation && inverseRelation.idCache
        array = data[inverseRelation.idCacheKey] || []
        array.push(id) if array.indexOf(id) == -1
        data[inverseRelation.idCacheKey] = array
      else if relation.foreignKey && !relation.idCache
        data[relation.foreignKey]     = id if id != undefined
        # must check here if owner is instance of foreignType
        data[relation.foreignType]  ||= owner.constructor.name if relation.foreignType
        
      if inverseRelation && inverseRelation.counterCacheKey
        data[inverseRelation.counterCacheKey] = 1
      
      @where(data)
      
    compileForCreate: ->
      @compile()
    
    compileForUpdate: ->
      @compileForFind()
      
      @returnArray = true unless @ids && @ids.length
      
    compileForDestroy: ->
      @compileForFind()
      
    compileForFind: ->
      @compile()
      
      relation = @relation
      
      if relation.idCache
        @where(id: $in: @owner.get(relation.idCacheKey))
      
    updateOwnerRecord: ->
      relation = @relation
      !!(relation && (relation.idCache || relation.counterCache))
      
    ownerAttributes: (record) ->
      relation = @relation
      
      if relation.idCache
        push    = {}
        data    = if record then record.get("id") else @store._mapKeys('id', @data)
        push[relation.idCacheKey] = if _.isArray(data) then {$each: data} else data
      if relation.counterCacheKey
        inc     = {}
        inc[relation.counterCacheKey] = 1
        
      updates   = {}
      # probably should be $addToSet
      updates["$addToSet"]  = push if push
      updates["$inc"]   = inc if inc
      
      updates
      
    ownerAttributesForDestroy: (record) ->
      relation = @relation
      
      if relation.idCache
        pull    = {}
        # tmp hack
        pull[relation.idCacheKey] = if @ids && @ids.length then @ids else @owner.get(relation.idCacheKey)
      if relation.counterCacheKey
        inc     = {}
        inc[relation.counterCacheKey] = -1
        
      updates   = {}
      # probably should be $addToSet
      updates["$pullAll"]  = pull if pull
      updates["$inc"]   = inc if inc
      
      updates
    
    # @private
    _idCacheRecords: (records) ->
      rootRelation = @owner.relation(@relation.name)
      rootRelation.criteria.records = rootRelation.criteria.records.concat _.castArray(records)

module.exports = Tower.Model.Relation.HasMany
