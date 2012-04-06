class Tower.Model.Relation.HasManyThrough extends Tower.Model.Relation.HasMany
  initialize: (options) ->
    super
    
    if @through && !options.type
      @throughRelation = throughRelation = @owner.relation(@through)
      options.type ||= throughRelation.targetType
  
  # Relation on the associated object that maps back to this relation.
  # 
  # @return [Tower.Model.Relation]
  inverseThrough: (relation) ->
    relations = relation.targetKlass().relations()
    
    if relation.inverseOf
      return relations[relation.inverseOf]  
    else
      name  = @name
      type  = @type
      for name, relation of relations
        # need a way to check if class extends another class in coffeescript...
        return relation if relation.inverseOf == name
      for name, relation of relations
        return relation if relation.targetType == type
    
  class @Criteria extends @Criteria
    isHasManyThrough: true
    
    constructor: (options = {}) ->
      super
      if @relation.through
        @throughRelation  = @owner.constructor.relation(@relation.through)
        @inverseRelation  = @relation.inverseThrough(@throughRelation)
        #relations = @throughRelation.targetKlass().relations()
        #for name, relation of relations
        #  @
        
    compile: ->
      @
    
    create: (callback) ->
      @_runBeforeCreateCallbacksOnStore =>
        @_create (error, record) =>
          unless error
            #@_idCacheRecords(record)
            
            @_runAfterCreateCallbacksOnStore =>
              @createThroughRelation record, (error, throughRecord) =>
                callback.call @, error, record if callback
          else
            callback.call @, error, record if callback
    
    count: (callback) ->
      @_runBeforeFindCallbacksOnStore =>
        @_count (error, record) =>
          unless error
            @_runAfterFindCallbacksOnStore =>
              callback.call @, error, record if callback
          else
            callback.call @, error, record if callback
            
    exists: (callback) ->
      @_runBeforeFindCallbacksOnStore =>
        @_exists (error, record) =>
          unless error
            @_runAfterFindCallbacksOnStore =>
              callback.call @, error, record if callback
          else
            callback.call @, error, record if callback
            
    appendThroughConditions: (callback) ->
      # @inverseRelation.foreignKey
      
      @owner[@relation.through]().all (error, records) =>
        ids = @store._mapKeys(@inverseRelation.foreignKey, records)
        
        # @addIds ???
        @where('id': $in: ids)
        
        callback()
        
    createThroughRelation: (records, callback) ->
      #record = @owner.relation(@relation.name).criteria.records
      returnArray = _.isArray(records)
      records = _.castArray(records) # may only get 1
      data    = []
      key     = @inverseRelation.foreignKey
      
      for record in records
        attributes = {}
        attributes[key] = record.get('id')
        data.push attributes
        
      @owner[@relation.through]().create data, (error, throughRecords) =>
        throughRecords = throughRecords[0] unless returnArray
        callback.call @, error, throughRecords if callback

module.exports = Tower.Model.Relation.HasManyThrough
