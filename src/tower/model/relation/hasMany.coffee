# Right now this is only going to work on "referenced" associations.
# 
# @note Thinking about making ./referenced and ./embedded copies,
#   similar to how Mongoid does it.
class Tower.Model.Relation.HasMany extends Tower.Model.Relation
  # @option options [String|Function] beforeAdd Callback before an item is added.
  # @option options [String|Function] afterAdd Callback after an item is added.
  
  class @Criteria extends @Criteria
    isHasMany: true
    
    # @before "create", "compileForCreate"
    # @before "update", "compileForUpdate"
    # @before "destroy", "compileForDestroy"
    # @before "find", "compileForFind"
    
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
        
    #find: (callback) ->
    #  @validate (error) =>
    #    @findReferenced(callback)
    
    createReferenced: (callback) ->
      @compileForCreate()
      
      @_runBeforeCreateCallbacksOnStore =>
        @_create (error, record) =>
          unless error
            #@_cacheRecords(record)
            
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
    
    compile: ->
      owner           = @owner
      relation        = @relation
      inverseRelation = relation.inverse()
      
      id              = owner.get("id")
      
      data            = {}
      
      #if relation.cache
      #  #defaults[relation.cacheKey] = $in: [@owner.get("id")]
      #  defaults.id = $in: @owner.get(relation.cacheKey)
      #  criteria.where(defaults)
      #else
      #  defaults[relation.foreignKey] = $in: @owner.get('id')
      #  criteria.where(defaults)
      
      if inverseRelation && inverseRelation.cache
        array = data[inverseRelation.cacheKey] || []
        array.push(id) if array.indexOf(id) == -1
        data[inverseRelation.cacheKey] = array
      else if relation.foreignKey
        data[relation.foreignKey]     = id if id != undefined
        # must check here if owner is instance of foreignType
        data[relation.foreignType]  ||= owner.constructor.name if relation.foreignType
        
      if inverseRelation && inverseRelation.counterCacheKey
        data[inverseRelation.counterCacheKey] = 1
      
      @where(data)
      
    compileForCreate: ->
      @compile()
    
    compileForUpdate: ->
      @compile()
      
    compileForDestroy: ->
      @compile()
      
    compileForFind: ->
      @compile()
      
    updateOwnerRecord: ->
      relation = @relation
      !!(relation && (relation.cache || relation.counterCache))
      
    ownerAttributes: (record) ->
      relation = @relation
      
      if relation.cache
        push    = {}
        push[relation.cacheKey] = record.get("id")
      if relation.counterCacheKey
        inc     = {}
        inc[relation.counterCacheKey] = 1
        
      updates   = {}
      updates["$push"]  = push if push
      updates["$inc"]   = inc if inc
      
      updates
      
    # @private
    _cacheRecords: (records) ->
      rootRelation = @owner.relation(@relation.name)
      rootRelation.criteria.records = rootRelation.criteria.records.concat _.castArray(records)


module.exports = Tower.Model.Relation.HasMany
