class Tower.Model.Relation.HasManyThrough extends Tower.Model.Relation.HasMany
  init: (options) ->
    @_super arguments...

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

class Tower.Model.Relation.HasManyThrough.Criteria extends Tower.Model.Relation.HasMany.Criteria
  isHasManyThrough: true

  init: (options = {}) ->
    @_super arguments...
    
    if @relation.through
      @throughRelation  = @owner.constructor.relation(@relation.through)
      @inverseRelation  = @relation.inverseThrough(@throughRelation)
      #relations = @throughRelation.targetKlass().relations()
      #for name, relation of relations
      #  @

  compile: ->
    @

  #build: (callback) ->
  #  @_build (error, records) =>
  #    for record in _.castArray(records)
  #      record._throughCriteria = @ if record
  #
  #    callback.call @, error, records if callback
  #    records

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

  # add to set
  add: (callback) ->
    @_build (error, record) =>
      unless error
        @createThroughRelation record, (error, throughRecord) =>
          callback.call @, error, record if callback
      else
        callback.call @, error, record if callback

  # remove from set
  remove: (callback) ->
    throw new Error unless @relation.idCache

    @owner.updateAttributes @ownerAttributesForDestroy(), (error) =>
      callback.call @, error, @data if callback

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
