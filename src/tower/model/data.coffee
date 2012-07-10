# This class encapsulates all the logic for modifying attributes, relations, and attachments on a record.
#
# When a record is first loaded, `data.savedData` is set to the initial values.
# Then when you change an attribute, the model enters the `uncommitted` state
# and starts adding to the `data.changes` object.  This allows us to rollback changes,
# and only send the changed attributes to the database.
#
# You can do a bunch of changes to your model and the bindings will only be executed _once_, in the next frame.
# You can call `model.flush()` to executes the binds for the model before the next frame.
#
# You can also set relations and they will be tracked here.
#
# @example Set arrays
#   post.set 'tags', ['ruby', 'javascript']
#   post.push 'tags', 'node'
#   post.pushEach 'tags', ['rails', 'tower']
#
# @example Set arrays through parameters
#   post.set tags: ['ruby', 'javascript']
#   post.set $push: tags: 'node'
#   post.set $pushEach: tags: ['rails', 'tower']
#
# @example Set nested attributes
#   post.push 'comments', message: 'First comment'
#   post.set $push: comments: {message: 'First comment'}
#
# @example Increment attributes
#   post.inc 'likeCount', 1
#   post.set $inc: likeCount: 1
#
# @example Decrement attributes
#   post.inc 'likeCount', -1
#   post.set $inc: likeCount: -1
#
# @example Add item to array
#   post.add 'tags', 'coffeescript'
#   post.set $add: tags: 'coffeescript'
#   post.addEach 'tags', ['javascript', 'coffeescript']
#   post.set $addEach: tags: ['javascript', 'coffeescript']
#
# @example Remove item from array
#   post.remove 'tags', 'coffeescript'
#   post.set $remove: tags: 'coffeescript'
#   post.removeEach 'tags', ['javascript', 'coffeescript']
#   post.set $removeEach: tags: ['javascript', 'coffeescript']
#
# @example Pull item from array (same as remove)
#   post.pull 'tags', 'coffeescript'
#   post.set $pull: tags: 'coffeescript'
#   post.pullEach 'tags', ['javascript', 'coffeescript']
#   post.set $pullEach: tags: ['javascript', 'coffeescript']
#
# @example Each together
#   user = App.User.first() # id == 1
#   post = new App.Post(user: user, title: 'First Post')
#   post.get('data').get('changes') #=> {userId: 1, title: 'First Post'}
#   post.set 'tags', ['ruby', 'javascript']
#   post.get('data').get('changes') #=> {userId: 1, title: 'First Post', tags: ['ruby', 'javascript']}
#   post.set 'comments', [new App.Comment]
#   post.comments().push new App.Comment
#
# @example Crazy params example
#   post.set
#     title: 'Renamed Post'
#     $add:
#       tags: 'node'
#     $removeEach:
#       tags: ['ruby', 'jasmine']
#
class Tower.Model.Data
  constructor: (record) ->
    throw new Error('Data must be passed a record') unless record

    @record             = record

    @attributes         = {}
    @changedAttributes  = {}
    # @previousChanges    = {}
    @savedData          = {} # this should be persisted data, even for client (waiting for ajax)
    @unsavedData        = {}
    @primaryKey         = 'id' # tmp, make more robust

  changes: ->
    injectChange = (memo, value, key) =>
      memo[key] = [value, @attributes[key]] # [old, new]
      memo

    _.inject(@changedAttributes, injectChange, {})

  changed: ->
    _.keys(@changedAttributes)

  resetAttribute: (key) ->
    if (old = @changedAttributes[key])?
      delete @changedAttributes[key]
      @attributes[key] = old
    else
      @attributes[key] = @defaultValue(key)

  defaultValue: (key) ->
    return field.defaultValue(@record) if field = @_getField(key)

  cloneAttribute: (key) ->
    _.clone(key)

  isReadOnlyAttribute: (key) ->
    !!@_getField(key).readonly

  # Get a value defined by a {Tower.Model.field}.
  #
  # @note It will try to get a default value for you the first time it is retrieved.
  #
  # @param [name]
  #
  # @return [Object]
  get: (key) ->
    passedKey = key
    # @todo cleanup/optimize
    key = if key == '_id' then 'id' else key
    result = @_cid if key == '_cid'
    result = Ember.get(@attributes, key) if result == undefined
    result = Ember.get(@savedData, key) if result == undefined
    # in the "public api" we want there to be no distinction between cid/id, that should be managed transparently.
    result = @_cid if passedKey == 'id' && result == undefined
    result

  set: (key, value) ->
    if key == '_cid'
      if value?
        @_cid = value
      else
        delete @_cid
      @record.propertyDidChange('id')
      return value

    if Tower.Store.Modifiers.MAP.hasOwnProperty(key)
      @[key.replace('$', '')](value)
    else
      # need a better way to do this...
      if !@record.get('isNew') && key == 'id'
        return @savedData[key] = value

      # track changes!
      # @todo, need to account for typecasting better
      if (old = @changedAttributes[key])?
        delete @changedAttributes[key] if old == value
      else
        old = @attributes[key] # @readAttribute(key)
        @changedAttributes[key] = old if old != value

      @attributes[key] = value

      if value == undefined || @savedData[key] == value
        # TODO Ember.deletePath
        delete @unsavedData[key]
      else
        #@unsavedData[key] = value
        Ember.setPath(@unsavedData, key, value)

    @record.set('isDirty', @isDirty())

    value

  isDirty: ->
    _.isPresent(@unsavedData)

  setSavedAttributes: (object) ->
    _.extend(@savedData, object)

  commit: ->
    # @attributes()
    @previousChanges = @changes()
    _.deepMerge(@savedData, @unsavedData)
    @record.set('isDirty', false)
    @unsavedData = {}

  rollback: ->
    @unsavedData = {}
    @record.propertyDidChange('data')

  attributesOld: ->
    # _.extend(@savedData, @unsavedData)
    _.deepMerge(@savedData, @unsavedData)

  copyAttributes: ->
    _.deepMerge({}, @savedData, @unsavedData)

  unsavedRelations: ->
    relations = @record.constructor.relations()
    result    = {}

    for key, value of @unsavedData
      if relations.hasOwnProperty(key)
        result[key] = value

    result

  # Filters out the primary keys, from the attribute names, when the primary
  # key is to be generated (e.g. the id attribute has no value).
  attributesForCreate: ->
    @_attributesForPersistence(@attributeKeysForCreate())

  # Filters the primary keys and readonly attributes from the attribute names.
  attributesForUpdate: (keys) ->
    @_attributesForPersistence(@attributeKeysForUpdate(keys))

  _attributesForPersistence: (keys) ->
    result      = {}
    attributes  = @attributes

    for key in keys
      result[key] = attributes[key]

    result

  attributeKeysForCreate: ->
    _.keys(@attributes)

  attributeKeysForUpdate: (keys = _.keys(@changedAttributes)) ->
    primaryKey  = @primaryKey
    _.select(keys, (key) -> key != primaryKey)

  push: (key, value) ->
    _.oneOrMany(@, @_push, key, value)

  pushEach: (key, value) ->
    _.oneOrMany(@, @_push, key, value, true)

  pull: (key, value) ->
    _.oneOrMany(@, @_pull, key, value)

  pullEach: (key, value) ->
    _.oneOrMany(@, @_pull, key, value, true)

  remove: @::pull
  removeEach: @::pullEach

  inc: (key, value) ->
    _.oneOrMany(@, @_inc, key, value)

  add: (key, value) ->
    _.oneOrMany(@, @_add, key, value)

  addEach: (key, value) ->
    _.oneOrMany(@, @_add, key, value, true)

  unset: ->
    keys = _.flatten _.args(arguments)
    delete @[key] for key in keys
    undefined

  # @private
  _set: (key, value) ->
    if Tower.Store.Modifiers.MAP.hasOwnProperty(key)
      @[key.replace('$', '')](value)
    else
      if value == undefined
        # TODO Ember.deletePath
        delete @unsavedData[key]
      else
        Ember.setPath(@unsavedData, key, value)

  # @private
  _push: (key, value, array = false) ->
    currentValue = @get(key)
    currentValue ||= []

    if array
      currentValue = currentValue.concat(_.castArray(value))
    else
      currentValue.push(value)

    # probably shouldn't reset it, need to consider
    Ember.set(@unsavedData, key, currentValue)

  # @private
  _pull: (key, value, array = false) ->
    currentValue = @get(key)
    return null unless currentValue

    if array
      for item in _.castArray(value)
        currentValue.splice(_.toStringIndexOf(currentValue, item), 1)
    else
      currentValue.splice(_.toStringIndexOf(currentValue, value), 1)

    # probably shouldn't reset it, need to consider
    Ember.set(@unsavedData, key, currentValue)

  # @private
  _add: (key, value, array = false) ->
    currentValue = @get(key)
    currentValue ||= []

    if array
      for item in _.castArray(value)
        currentValue.push(item) if _.indexOf(currentValue, item) == -1
    else
      currentValue.push(value) if _.indexOf(currentValue, value) == -1

    # probably shouldn't reset it, need to consider
    Ember.set(@unsavedData, key, currentValue)

  # @private
  _inc: (key, value) ->
    currentValue = @get(key)
    currentValue ||= 0
    currentValue += value

    Ember.set(@unsavedData, key, currentValue)

  _getField: (key) ->
    @record.constructor.fields()[key]

  _getRelation: (key) ->
    @record.constructor.relations()[key]

module.exports = Tower.Model.Data