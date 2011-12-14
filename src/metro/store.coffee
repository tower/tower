# Stores are the interface models use to find their data.
# http://www.w3.org/TR/IndexedDB/
# https://github.com/kriszyp/perstore
class Metro.Store extends Metro.Object
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
    klass = Metro.constant(@className)
    new klass(attributes)
    
  deserializeModel: (model) ->
    model.attributes
    
  constructor: (options = {}) ->
    @name       = options.name
    @className  = options.className || Metro.namespaced(Metro.Support.String.camelize(Metro.Support.String.singularize(@name)))
    @model      = Metro.constant(@className)
  
  # find(1)  
  # find(1, 2, 3)
  # find(ids..., callback)
  find: (ids..., query, options, callback) ->
    if ids.length == 1
      query.id = ids[0]
      @findOne query, options, callback
    else
      query.id = $in: ids
      @all query, options, callback
  
  first: (query, options, callback) ->
    @findOne query, options, callback

  last: (query, options, callback) ->
    @findOne query, options, callback
    
  build: (attributes, options, callback) ->
    record        = @serializeModel(attributes)
    callback.call @, null, record if callback
    record
    
  update: (ids..., updates, query, options, callback) ->
    #query.id = if ids.length == 1 then ids[0] else $in: ids
    query.id = $in: ids
    @updateAll updates, query, options, callback
    
  delete: (ids..., query, options, callback) ->
    query.id = if ids.length == 1 then ids[0] else $in: ids
    @deleteAll query, options, callback
    
  schema: ->
    Metro.constant(@className).schema()

require './store/cassandra'
require './store/couchdb'
require './store/fileSystem'
require './store/local'
require './store/memory'
require './store/mongodb'
require './store/postgresql'
require './store/redis'

module.exports = Metro.Store
