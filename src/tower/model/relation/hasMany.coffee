class Tower.Model.Relation.HasMany extends Tower.Model.Relation
  class @Scope extends @Scope
    create: ->
      unless @owner.isPersisted()
        throw new Error("You cannot call create unless the parent is saved")
        
      relation        = @relation
      inverseRelation = relation.inverse()
      
      {criteria, data, options, callback} = @_extractArgs(arguments, data: true)
      
      id = @owner.get("id")
      
      if inverseRelation && inverseRelation.cache
        array = data[inverseRelation.cacheKey] || []
        array.push(id) if array.indexOf(id) == -1
        data[inverseRelation.cacheKey] = array
      else if relation.foreignKey
        data[relation.foreignKey]     = id if id != undefined
        # must check here if owner is instance of foreignType
        data[relation.foreignType]  ||= @owner.constructor.name if @relation.foreignType  
      
      criteria.where(data)
      criteria.mergeOptions(options)
      
      if inverseRelation && inverseRelation.counterCacheKey
        defaults  = {}
        defaults[inverseRelation.counterCacheKey] = 1
        criteria.where(defaults)
      
      instantiate = options.instantiate != false
      {attributes, options} = criteria.toCreate()
      
      options.instantiate = true
      
      @_create criteria, attributes, options, (error, record) =>
        unless error
          # add the id to the array on the owner record after it's created
          if relation && (relation.cache || relation.counterCache)
            if relation.cache
              push    = {}
              push[relation.cacheKey] = record.get("id")
            if relation.counterCacheKey
              inc     = {}
              inc[relation.counterCacheKey] = 1
            updates   = {}
            updates["$push"]  = push if push
            updates["$inc"]   = inc if inc
            @owner.updateAttributes updates, callback
          else
            callback.call @, error, record if callback
        else
          callback.call @, error, record if callback
          
    update: ->
      
    destroy: ->
      
    concat: ->
      
    _serializeAttributes: (attributes = {}) ->
      target = Tower.constant(@relation.targetClassName)
      
      for name, relation of target.relations()
        if attributes.hasOwnProperty(name)
          value = attributes[name]
          delete attributes[name]
          if relation instanceof Tower.Model.Relation.BelongsTo
            attributes[relation.foreignKey] = value.id
            attributes[relation.foreignType] = value.type if relation.polymorphic
            
      attributes
      
    toCriteria: ->
      criteria  = super
      relation  = @relation
      if relation.cache
        defaults  = {}
        defaults[relation.foreignKey + "s"] = $in: [@owner.get("id")]
        criteria.where(defaults)
      
      criteria
  
module.exports = Tower.Model.Relation.HasMany
