Tower.Store.MongoDB.Finders =
  serializeModel: (attributes) ->
    return attributes if attributes instanceof Tower.Model
    klass = Tower.constant(@className)
    attributes.id ||= attributes._id
    delete attributes._id
    model = new klass(attributes)
    model
  
  # find conditions: {title: "=~": "Lance"}, options
  find: (criteria, callback) ->
    @serializeCriteria(criteria)
    
    @joins criteria, (error, joinConditions) =>
      @collection().find(conditions, options).toArray (error, docs) =>
        unless error
          unless raw
            for doc in docs
              doc.id = doc["_id"]
              delete doc["_id"]
            docs = @serialize(docs)
            for model in docs
              model.persistent = true
            @eagerLoad docs, eagerLoad, callback
        callback.call(@, error, docs) if callback
      
    @
    
  joins: (criteria, callback) ->
    through       = options.through
    eagerLoad     = options.eagerLoad
    raw           = options.raw
    conditions    = @serializeQuery(conditions)
    options       = @serializeOptions(options)
    
    return callback.call @, null, {} unless through
    
    through.scope.select(through.key).all (error, records) =>
      conditions = {}
      conditions._id = $in: _.map(records, (record) -> record.get(through.key))
      callback.call @, null, conditions

    @
    
  eagerLoad: (records, eagerLoadScopes, callback) ->
    ids = _.map records, (record) -> record.get('id')
    
    eagerLoad = (eagerLoadScope, next) =>
      query = {}
      query[eagerLoadScope.foreignKey] = $in: ids
      eagerLoadScope.where(query).all (error, children) =>
      
    
    Tower.parallel eagerLoadScopes, eagerLoad, callback

  findOne: (conditions, options, callback) ->
    conditions    = @serializeQuery(conditions)
    options.limit = 1
    raw           = options.raw == true
    options       = @serializeOptions(options)
    
    @collection().findOne conditions, (error, doc) =>
      unless raw || error || !doc
        doc = @serializeModel(doc)
        doc.persistent = true
      callback.call(@, error, doc) if callback
    @

  count: (conditions, options, callback) ->
    result        = 0
    conditions    = @serializeQuery(conditions)
    options       = @serializeOptions(options)
    
    @collection().count conditions, (error, count) =>
      result      = count || 0
      callback.call @, error, result if callback
    
    result

  exists: (conditions, options, callback) ->
    result        = undefined
    conditions    = @serializeQuery(conditions)

    @collection().count conditions, (error, exists) ->
      result      = exists
      callback.call @, error, result if callback

    result
    
  through: (through, callback) ->
    return callback.call @, null, {} unless through
    
    through.scope.select(through.key).all (error, records) =>
      conditions = {}
      conditions._id = $in: _.map(records, (record) -> record.get(through.key))
      callback.call @, null, conditions

module.exports = Tower.Store.MongoDB.Finders
