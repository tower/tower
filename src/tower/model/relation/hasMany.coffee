class Tower.Model.Relation.HasMany extends Tower.Model.Relation
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
  
  class @Scope extends @Scope
    # user.posts().create() # owner == user, foreignKey == userId, foreignKeys == userIds, foreignType == User
    # need to handle if owner.type changes
    create: ->
      unless @owner.isPersisted()
        throw new Error("You cannot call create unless the parent is saved")
        
      relation        = @relation
      inverseRelation = relation.inverse()
      
      {criteria, attributes, options, callback} = @_extractArgs(arguments, attributes: true)
      
      id = @owner.get("id")
      
      if inverseRelation && inverseRelation.cache
        array = attributes[inverseRelation.cacheKey] || []
        array.push(id) if array.indexOf(id) == -1
        attributes[inverseRelation.cacheKey] = array
      else if relation.foreignKey
        attributes[relation.foreignKey]     = id if id != undefined
        # must check here if owner is instance of foreignType
        attributes[relation.foreignType]  ||= @owner.constructor.name if @relation.foreignType  
      
      criteria.where(attributes)
      criteria.mergeOptions(options)
      
      instantiate = options.instantiate != false
      {attributes, options} = criteria.toCreate()
      
      options.instantiate = true
      
      @_create attributes, options, (error, record) =>
        unless error
          # add the id to the array on the owner record after it's created
          if relation && (relation.cache || relation.counterCache)
            push  = {}
            push[relation.cacheKey] = record.get("id") if relation.cache
            inc   = {}
            inc[relation.counterCacheKey] = 1
            @owner.updateAttributes "$push": push, "$inc": inc, callback
          else
            callback.call @, error, record if callback
        else
          callback.call @, error, record if callback
          
    update: ->
      console.log arguments
      
    destroy: ->
      
    concat: ->
      
    replace: (otherArray) ->
      if @owner.isNew()
        @replaceRecords(otherArray, originalTarget)
      else
        @transaction =>
          @replaceRecords(otherArray, originalTarget)
          
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
        defaults = {}
        defaults[relation.foreignKey + "s"] = $in: [@owner.get("id")]
        criteria.where defaults
      
      criteria
  
module.exports = Tower.Model.Relation.HasMany
