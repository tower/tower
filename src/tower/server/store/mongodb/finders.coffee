# @module
Tower.Store.MongoDB.Finders =
  # Find and return an array of documents.
  # 
  # @param [Tower.Model.Scope] scope A scope object with all of the query information.
  # 
  # @return undefined Requires a callback to get the value.
  find: (scope, callback) ->
    scope = @serializeScope(scope)
    
    @transaction =>
      @joins scope, =>
        @collection().find(conditions, options).toArray (error, docs) =>
          unless error
            unless raw
              for doc in docs
                doc.id = doc["_id"]
                delete doc["_id"]
              docs = @serialize(docs)
              for model in docs
                model.persistent = true
              @eagerLoad scope, docs, callback
          callback.call(@, error, docs) if callback
      
    undefined
  
  # @return undefined Requires a callback to get the value.
  findOne: (scope, callback) ->
    scope     = @serializeScope(scope)
    scope.criteria.limit(1)
    
    @transaction =>
      @joins scope, =>
        @collection().findOne scope.criteria.compileConditions(), (error, doc) =>
          unless raw || error || !doc
            doc = @serializeModel(doc)
            doc.persistent = true
          
          callback.call(@, error, doc) if callback
        
    undefined
  
  # @return undefined Requires a callback to get the value.
  count: (scope, callback) ->
    scope         = @serializeScope(scope)
    
    @transaction =>
      @joins scope, =>
        @collection().count scope.criteria.compileConditions(), (error, count) =>
          callback.call @, error, count || 0 if callback
    
    undefined
  
  # @return undefined Requires a callback to get the value.
  exists: (conditions, options, callback) ->
    conditions    = @serializeQuery(conditions)
    
    @joins scope, =>
      @collection().count scope.criteria.compileConditions(), (error, exists) =>
        callback.call @, error, exists if callback
      
    undefined
  
  joins: (scope, callback) ->
    throughScope  = scope.throughScope() if scope.throughScope
    return callback.call @, null unless throughScope
    
    throughKey    = scope.throughKey
    eagerLoad     = options.eagerLoad
    raw           = options.raw
    conditions    = @serializeQuery(conditions)
    options       = @serializeOptions(options)
    
    throughScope.select(throughKey).all (error, records) =>
      conditions = {}
      conditions._id = $in: @_mapKey(throughKey, records)
      
      scope.criteria.where(conditions)
      
      callback.call @, null

    undefined
    
  eagerLoad: (scope, records, callback) ->
    ids = @_mapKeys('id', records)
    
    eagerLoad = (eagerLoadScope, next) =>
      query = {}
      query[eagerLoadScope.foreignKey] = $in: ids
      eagerLoadScope.where(query).all (error, children) =>
    
    Tower.parallel scope.eagerLoadScopes, eagerLoad, callback

module.exports = Tower.Store.MongoDB.Finders
