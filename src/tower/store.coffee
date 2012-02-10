class Tower.Store extends Tower.Class
  @defaultLimit: 100
  
  @isKeyword: (key) ->
    @queryOperators.hasOwnProperty(key) || @atomicModifiers.hasOwnProperty(key)
    
  @hasKeyword: (object) ->
    return true if object.hasOwnProperty(key) for key, value of @queryOperators
    return true if object.hasOwnProperty(key) for key, value of @atomicModifiers
    false
  
  @atomicModifiers:
    "$set":     "$set"
    "$unset":   "$unset"
    "$push":    "$push"
    "$pushAll": "$pushAll"
    "$pull":    "$pull"
    "$pullAll": "$pullAll"
    "$inc":     "$inc"
    "$pop":     "$pop"
  
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
    "$match":   "$match"
    "$notMatch":   "$notMatch"
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
    
  deserializeModel: (data) ->
    if data instanceof Tower.Model then data.attributes else data
    
  constructor: (options = {}) ->
    @name       = options.name
    @className  = options.type || Tower.namespaced(Tower.Support.String.camelize(Tower.Support.String.singularize(@name)))
    
  _defaultOptions: (options) ->
    options
    
  load: (records) ->
    
  fetch: ->
    
  schema: ->
    Tower.constant(@className).fields()
      
Tower.Store.include Tower.Support.Callbacks

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
