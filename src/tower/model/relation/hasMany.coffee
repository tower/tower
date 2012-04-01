class Tower.Model.Relation.HasMany extends Tower.Model.Relation
  initialize: (options) ->
    if @through && !options.type
      options.type ||= @owner.relation(@through).ownerType
      
    super
    
  class @Scope extends @Scope
    isHasMany: true
    
    create: ->
      unless @owner.isPersisted()
        throw new Error("You cannot call create unless the parent is saved")
      
      {criteria, data, options, callback} = @_extractArgs(arguments, data: true)
      
      if @relation.embed && @owner.store().supports("embed")
        @_createEmbedded criteria, data, options, callback
      else
        @_createReferenced criteria, data, options, callback

    update: ->

    destroy: ->

    compile: ->
      criteria  = super
      relation  = @relation
      
      defaults  = {}
      
      if relation.through
        criteria.through(scope: @owner[relation.through](), key: "wallId")
      else if relation.cache
        #defaults[relation.cacheKey] = $in: [@owner.get("id")]
        defaults.id = $in: @owner.get(relation.cacheKey)
        criteria.where(defaults)
      else
        defaults[relation.foreignKey] = $in: @owner.get('id')
        criteria.where(defaults)

      criteria
      
    # @private
    _createEmbedded: (criteria, args, options, callback) ->
      owner           = @owner
      relation        = @relation
      
      criteria.mergeOptions(options)
      
      {attributes, options} = criteria.toCreate()
      
      records = @_build args, attributes, options
      
      updates   = {$pushAll: {}}
      
      if _.isArray(records)
        attributes = []
        for record in records
          record.attributes._id  ?= relation.klass().store().generateId()
          delete record.attributes.id
          attributes.push record.attributes
        updates["$pushAll"][relation.name]  = attributes
      else
        records.attributes._id  ?= relation.klass().store().generateId()
        delete records.attributes.id
        updates["$pushAll"][relation.name]  = [records.attributes]
      
      # update: (updates, conditions, options, callback) ->
      owner.store().update updates, {id: owner.get('id')}, {}, (error) =>
        unless error
          if _.isArray(records)
            @owner.relation(@relation.name).records = @records.concat(records)
          else
            @owner.relation(@relation.name).records.push(records)
            
          #record = relation.klass().store().serializeModel(attributes)
          #@owner.relation(@relation.name).records.push(record)
          callback.call @, error, records if callback
    
    # @private
    _createReferenced: (criteria, args, options, callback) ->
      owner           = @owner
      relation        = @relation
      inverseRelation = relation.inverse()
      
      id = owner.get("id")
      
      data = {}
      
      if inverseRelation && inverseRelation.cache
        array = data[inverseRelation.cacheKey] || []
        array.push(id) if array.indexOf(id) == -1
        data[inverseRelation.cacheKey] = array
      else if relation.foreignKey
        data[relation.foreignKey]     = id if id != undefined
        # must check here if owner is instance of foreignType
        data[relation.foreignType]  ||= owner.constructor.name if @relation.foreignType
        
      criteria.where(data)
      criteria.mergeOptions(options)

      if inverseRelation && inverseRelation.counterCacheKey
        defaults  = {}
        defaults[inverseRelation.counterCacheKey] = 1
        criteria.where(defaults)
      
      instantiate = options.instantiate != false
      
      {attributes, options} = criteria.toCreate()
      
      attributes = @_build args, attributes, options
      
      options.instantiate = true
      
      @_create criteria, attributes, options, (error, record) =>
        unless error
          if _.isArray(record)
            @owner.relation(@relation.name).records = @records.concat(record)
          else
            @owner.relation(@relation.name).records.push(record)
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
            owner.updateAttributes updates, (error) =>
              callback.call @, error, record if callback
          else
            callback.call @, error, record if callback
        else
          callback.call @, error, record if callback

    # @private
    _serializeAttributes: (attributes = {}) ->
      target    = Tower.constant(@relation.targetClassName)
      relations = target.relations()

      for name, relation of relations
        if attributes.hasOwnProperty(name)
          value = attributes[name]
          delete attributes[name]
          if relation instanceof Tower.Model.Relation.BelongsTo
            attributes[relation.foreignKey] = value.id
            attributes[relation.foreignType] = value.type if relation.polymorphic

      attributes

module.exports = Tower.Model.Relation.HasMany
