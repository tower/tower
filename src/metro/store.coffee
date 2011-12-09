# Stores are the interface models use to find their data.
# http://www.w3.org/TR/IndexedDB/
# https://github.com/kriszyp/perstore
class Metro.Store extends Metro.Object
  @defaultLimit: 100
  
  @atomicModifiers:
    "$set":     "$set"
    "$push":    "$push"
    "$pushAll": "$pushAll"
    "$pull":    "$pull"
    "$pullAll": "$pullAll"

  @reservedOperators:
    "_sort":  "_sort"
    "_limit": "_limit"
  
  @queryOperators:
    ">=":       "gte"
    "gte":      "gte"
    ">":        "gt"
    "gt":       "gt"
    "<=":       "lte"
    "lte":      "lte"
    "<":        "lt"
    "lt":       "lt"
    "in":       "in"
    "nin":      "nin"
    "any":      "any"
    "all":      "all"
    "=~":       "m"
    "m":        "m"
    "!~":       "nm"
    "nm":       "nm"
    "=":        "eq"
    "eq":       "eq"
    "!=":       "neq"
    "neq":      "neq"
    "null":     "null"
    "notNull":  "notNull"
  
  serialize: (data) ->
    return data unless @serializeAttributes
    data[i] = @serializeAttributes(item) for item, i in data
    data
  
  deserialize: (models) ->
    return models unless @deserializeAttributes
    models[i] = @deserializeAttributes(model) for model, i in models
    models
    
  serializeAttributes: (attributes) ->
    klass = Metro.constant(@className)
    new klass(attributes)
    
  deserializeAttributes: (model) ->
    model.attributes
    
  constructor: (options = {}) ->
    @name       = options.name
    @className  = options.className || Metro.namespaced(Metro.Support.String.camelize(Metro.Support.String.singularize(@name)))

require './store/cassandra'
require './store/couchdb'
require './store/fileSystem'
require './store/local'
require './store/memory'
require './store/mongodb'
require './store/postgresql'
require './store/redis'

module.exports = Metro.Store
