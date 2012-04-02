class Tower.Model.Relation.HasMany extends Tower.Model.Relation
  initialize: (options) ->
    if @through && !options.type
      options.type ||= @owner.relation(@through).ownerType
      
    super
    
  class @Criteria extends @Criteria
    isHasMany: true
    
    validate: ->
      unless @owner.isPersisted()
        throw new Error("You cannot call create unless the parent is saved")
    
    create: (callback) ->
      console.log "CRITER"
      @validate()
      
      #if @relation.embed && @owner.store().supports("embed")
      #  @_createEmbedded
      #else
      @_createReferenced(callback)

    update: ->
      @validate()

    destroy: ->
      @validate()
      
    # for update, destroy, and find
    compile: ->
      
    # @private
    _createEmbedded: (callback) ->
      updates = @_compileForCreateEmbedded()
      
      # update: (updates, conditions, options, callback) ->
      @owner.updateAttributes updates, (error) =>
        unless error
          callback.call @, error, records if callback
    
    # @private
    _createReferenced: (callback) ->
      @_compileForCreate()
      
      @_create (error, record) =>
        unless error
          @_cacheRecords(record)
          
          # add the id to the array on the owner record after it's created
          if @updateOwnerRecord()
            @owner.updateAttributes @ownerAttributes(record), (error) =>
              callback.call @, error, record if callback
          else
            callback.call @, error, record if callback
        else
          callback.call @, error, record if callback
    
    # @private
    _cacheRecords: (records) ->
      rootRelation = @owner.relation(@relation.name)
      rootRelation.criteria.records = rootRelation.criteria.records.concat _.castArray(records)
      
    # @private
    _compileForCreate: ->
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
      
    _compileForCreateEmbedded: ->
      owner           = @owner
      relation        = @relation
      returnArray     = @returnArray
      @returnArray    = true
      records         = @build()
      @returnArray    = returnArray
      updates         = $pushAll: {}
      
      attributes = []
      for record in records
        record.attributes._id  ?= relation.klass().store().generateId()
        delete record.attributes.id
        attributes.push record.attributes
        
      updates["$pushAll"][relation.name]  = attributes
      
      updates

module.exports = Tower.Model.Relation.HasMany
