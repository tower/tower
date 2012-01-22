class Tower.Store extends Tower.Class
  @defaultLimit: 100
  
  @atomicModifiers:
    "$set":     "$set"
    "$unset":   "$unset"
    "$push":    "$push"
    "$pushAll": "$pushAll"
    "$pull":    "$pull"
    "$pullAll": "$pullAll"
    
  @reservedOperators:
    "_sort":    "_sort"
    "_limit":   "_limit"
  
  @queryOperators:
    ">=":       "$gte"
    "$gte":     "$gte"
    ">":        "$gt"
    "$gt":      "$gt"
    "<=":       "$lte"
    "$lte":     "$lte"
    "<":        "$lt"
    "$lt":      "$lt"
    "$in":      "$in"
    "$nin":     "$nin"
    "$any":     "$any"
    "$all":     "$all"
    "=~":       "$regex"
    "$m":       "$regex"
    "$regex":   "$regex"
    "!~":       "$nm"
    "$nm":      "$nm"
    "=":        "$eq"
    "$eq":      "$eq"
    "!=":       "$neq"
    "$neq":     "$neq"
    "$null":    "$null"
    "$notNull": "$notNull"
    
  @booleans:
    true:    true
    "true":  true
    "TRUE":  true
    "1":     true
    1:       true
    1.0:     true
    false:   false
    "false": false
    "FALSE": false
    "0":     false
    0:       false
    0.0:     false
  
  serialize: (data) ->
    data[i] = @serializeModel(item) for item, i in data
    data
  
  deserialize: (models) ->
    models[i] = @deserializeModel(model) for model, i in models
    models
    
  serializeModel: (attributes) ->
    return attributes if attributes instanceof Tower.Model
    klass = Tower.constant(@className)
    new klass(attributes)
    
  deserializeModel: (model) ->
    model.attributes
    
  constructor: (options = {}) ->
    @name       = options.name
    @className  = options.type || Tower.namespaced(Tower.Support.String.camelize(Tower.Support.String.singularize(@name)))
  
  find: (query, options, callback) ->
    
  findOne: ->
    
  create: (attributes, options, callback) ->
    if options.instantiate
      @_createEach attributes, options, callback
    else
      @_create attributes, options, callback
      
  _createEach: (attributes, options, callback) ->
    isArray = Tower.Support.Object.isArray(attributes)
    
    @_build attributes, options, (error, records) =>
      return callback(error) if error
      records = Tower.Support.Object.toArray(records)
      iterator = (record, next) -> record.save(next)
      Tower.async records, iterator, (error) =>
        unless callback
          throw error if error
        else
          return callback(error) if error
          if isArray
            callback(error, records)
          else
            callback(error, records[0])
    
  update: (updates, query, options, callback) ->
    if options.instantiate
      @_updateEach updates, query, options, callback
    else
      @_update updates, query, options, callback
    
  _updateEach: (updates, query, options, callback) ->
    iterator = (record, next) -> record.updateAttributes(updates, next)
    @each query, options, iterator, callback
    
  _update: (updates, query, options, callback) ->
    
    
  destroy: (query, options, callback) ->
    if options.instantiate
      @_destroyEach query, options, callback
    else
      @_destroy query, options, callback
      
  _destroyEach: (query, options, callback) ->
    iterator = (record, next) -> record.destroy(next)
    @each query, options, iterator, callback
    
  _destroy: (query, options, callback) ->
    
  delete: (query, options, callback) ->
    @destroy.apply @, arguments

  build: (attributes, options, callback) ->
    record        = @serializeModel(attributes)
    callback.call @, null, record if callback
    record
    
  load: (records) ->
    
  each: (query, options, iterator, callback) ->
    @find query, options, (error, records) =>
      if error
        callback.call @, error, records
      else
        Tower.async records, iterator, (error) =>
          unless callback
            throw error if error
          else
            callback.call @, error, records if callback
  
  schema: ->
    Tower.constant(@className).fields()

require './store/cassandra'
require './store/couchdb'
require './store/fileSystem'
require './store/local'
require './store/memory'
require './store/mongodb'
require './store/neo4j'
require './store/postgresql'
require './store/riak'
require './store/redis'

module.exports = Tower.Store
