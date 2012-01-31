class Tower.Store extends Tower.Class
  @defaultLimit: 100
  
  @atomicModifiers:
    "$set":     "$set"
    "$unset":   "$unset"
    "$push":    "$push"
    "$pushAll": "$pushAll"
    "$pull":    "$pull"
    "$pullAll": "$pullAll"
    "$inc":     "$inc"
    "$pop":     "$pop"
    
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
    
  delete: (query, options, callback) ->
    @destroy.apply @, arguments
    
  load: (records) ->
    
  schema: ->
    Tower.constant(@className).fields()

require './store/cassandra'
require './store/couchdb'
require './store/fileSystem'
require './store/memory'
require './store/local'
require './store/mongodb'
require './store/neo4j'
require './store/postgresql'
require './store/riak'
require './store/redis'

module.exports = Tower.Store
