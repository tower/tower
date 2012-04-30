class Tower.Store extends Tower.Class
  @include Tower.Support.Callbacks

  @defaultLimit: 100

  @isKeyword: (key) ->
    @queryOperators.hasOwnProperty(key) || @atomicModifiers.hasOwnProperty(key)

  @hasKeyword: (object) ->
    return true if object.hasOwnProperty(key) for key, value of @queryOperators
    return true if object.hasOwnProperty(key) for key, value of @atomicModifiers
    false

  @atomicModifiers:
    "$set":       "$set"
    "$unset":     "$unset"
    "$push":      "$push"
    "$pushAll":   "$pushAll"
    "$pull":      "$pull"
    "$pullAll":   "$pullAll"
    "$inc":       "$inc"
    "$pop":       "$pop"
    "$addToSet":  "$addToSet"

  @queryOperators:
    ">=":         "$gte"
    "$gte":       "$gte"
    ">":          "$gt"
    "$gt":        "$gt"
    "<=":         "$lte"
    "$lte":       "$lte"
    "<":          "$lt"
    "$lt":        "$lt"
    "$in":        "$in"
    "$any":       "$in"
    "$nin":       "$nin"
    "$all":       "$all"
    "=~":         "$regex"
    "$m":         "$regex"
    "$regex":     "$regex"
    "$match":     "$regex"
    "$notMatch":  "$notMatch"
    "!~":         "$nm"
    "$nm":        "$nm"
    "=":          "$eq"
    "$eq":        "$eq"
    "!=":         "$neq"
    "$neq":       "$neq"
    "$null":      "$null"
    "$notNull":   "$notNull"

  @booleans:
    true:         true
    "true":       true
    "TRUE":       true
    "1":          true
    1:            true
    1.0:          true
    false:        false
    "false":      false
    "FALSE":      false
    "0":          false
    0:            false
    0.0:          false

  supports: {}

  addIndex: (name, options) ->


  serialize: (data, saved = false) ->
    data[i] = @serializeModel(item, saved) for item, i in data
    data

  deserialize: (models) ->
    models[i] = @deserializeModel(model) for model, i in models
    models

  serializeModel: (attributes) ->
    return attributes if attributes instanceof Tower.Model
    klass = Tower.constant(@className)
    #new klass(attributes)
    model = klass.new()
    model.setAttributes(attributes)
    model

  deserializeModel: (data) ->
    if data instanceof Tower.Model then data.get('changes') else data

  init: (options = {}) ->
    @_super arguments...
    
    @name       = options.name
    @className  = options.type || Tower.namespaced(Tower.Support.String.camelize(Tower.Support.String.singularize(@name)))

  _defaultOptions: (options) ->
    options

  load: (records) ->

  fetch: ->

  schema: ->
    Tower.constant(@className).fields()

  supports: (key) ->
    @constructor.supports[key] == true
    
  hashWasUpdated: (type, clientId, record) ->
    return if Ember.get(record, 'isDeleted')
    
    @updateCursors(type, clientId, record)
  
  cursors: Ember.computed(-> []).cacheable()
  
  updateCursors: (type, clientId, record) ->
    #console.log Ember.get @, 'cursors'
    
  removeFromCursors: (record) ->
    #console.log Ember.get @, 'cursors'

  _mapKeys: (key, records) ->
    _.map(records, (record) -> record.get(key))

require './store/callbacks'
require './store/batch'
require './store/memory'
require './store/modifiers'
require './store/operators'
require './store/serializer'
require './store/transaction'

Tower.Store.include Tower.Store.Callbacks

module.exports = Tower.Store
