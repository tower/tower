_ = Tower._

class Tower.Store extends Tower.Class
  @include Tower.SupportCallbacks

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

  @configure: (options) ->
    @config = options

  @initialize: (callback) ->
    callback() if callback

  @env: ->
    @config

  supports: {}

  addIndex: (name, options) ->

  serialize: (data, saved = false) ->
    data[i] = @serializeModel(item, saved) for item, i in data
    data

  deserialize: (models) ->
    models[i] = @deserializeModel(model) for model, i in models
    models

  serializeModel: (attributes, saved) ->
    return attributes if attributes instanceof Tower.Model
    
    model = @records.get(attributes.id) if attributes.id? && @records

    unless model
      klass = Tower.constant(@className)
      #new klass(attributes)
      model = klass.new()

    # @todo get rid of this
    #if saved
    #  model.setSavedAttributes(attributes)
    #else
    #  model.assignAttributes(attributes)
    model.initialize(attributes, isNew: !saved)

    model

  deserializeModel: (data) ->
    if data instanceof Tower.Model then data.get('dirtyAttributes') else data

  init: (options = {}) ->
    @_super arguments...

    @name       = options.name
    @className  = options.type || Tower.namespaced(Tower.SupportString.camelize(Tower.SupportString.singularize(@name)))

  _defaultOptions: (options) ->
    options

  load: (records) ->

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

  # @todo Removes all models and fetches new ones.
  # 
  # It has to manage all of the published cursors as well.
  refresh: ->
    
  # Makes a request with JSON like this:
  #     {
  #       "sort": ["firstName", "asc"],
  #       "page": 2,
  #       "limit": 20,
  #       "conditions": [{"firstName": {"=~": "/^[az]/i"}}]
  #     }
  # 
  # And you get a response back like this:
  #     {
  #       "sort": ["firstName", "asc"],
  #       "page": 2,
  #       "limit": 20,
  #       "conditions": [{"firstName": {"=~": "/^[az]/i"}}],
  #       "count": 337,
  #       "data": [{"firstName": "Andy"}, {"firstName": "Zach"}, ...]
  #     }
  # 
  # If you want to just `count` the records, or test if they exist,
  # you can add a boolean key to the JSON request:
  #     {"count": true}
  # 
  # @todo Once you reach the end of your paginated collection,
  #   it should no longer make requests.
  #
  # Say you first search for all users with `firstName` starting with the letter "a",
  # then you search for all users with `firstName` starting with either letter "a" or "b".
  # When you do the first search, say it returns the first page of 20 records.
  # Then when you do the next search, what should happen?  It's not smart enough
  # to know it's already fetched those records, so it will return them again.
  # There is the possibility that we test all the records currently on the client against the
  # fetching cursor, and append the ids of the matching records to the `conditions` field.
  # This way that "a" or "b" request might look like this:
  #     {
  #       "page": 1,
  #       "limit": 20,
  #       "conditions": [{"firstName": {"=~": "/^[ab]/i"}, "id": {"$notIn": [1, 2, 3...]}}]
  #     }
  # 
  # ... we'll have to run performance tests to see if this kind of optimization actually helps.
  # It would be preventing the serialization of, in this case, 20 records we already have on the client, 
  # which decreases the amount of data we have to send over the wire.  But the extra complexity of
  # that `$notIn` query might slow the query down enough to nullify benefit you'd get from decreasing
  # the size of the data sent over the wire.
  # 
  # Ooh, this just made me think.  One way to be able to do real-time pub/sub from client to server
  # is to have the server TCP request a list of ids or `updatedAt` values from the client to do the diff...
  fetch: (cursor, callback) ->
    # need to clean this up
    if cursor.returnArray == false
      @findOne(cursor, callback)
    else
      @find(cursor, callback)

module.exports = Tower.Store
