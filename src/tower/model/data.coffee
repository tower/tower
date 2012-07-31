class Tower.Model.Data
  constructor: (record) ->
    throw new Error('Data must be passed a record') unless record

    @record             = record

    @attributes         = {}
    @changedAttributes  = {}
    # @todo this should hold references to the association cursors, not the scopes
    @associations       = {}
    @savedData          = {} # this should be persisted data, even for client (waiting for ajax)
    @primaryKey         = 'id' # tmp, make more robust

  changes: ->
    @record.get('changes')

  changed: ->
    @record.get('changed')

  resetAttribute: (key) ->
    @record.resetAttribute(key)

  isReadOnlyAttribute: (key) ->
    !!@_getField(key).readonly

  # @todo think about this more, should it return defaults (and if so, lazily or not?)
  #   It needs to call record.toJSON() so it can get the defaults in there.
  getAttributes: ->
    attributes = @attributes #@record.toJSON()

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

  # stuff for merging api into model
  unknownProperty: (key) ->
    @getAttribute(key) # which is @get(key)

  setUnknownProperty: (key, value) ->
    @setAttribute(key, value)

  setAttribute: (key, value)  ->
    @set(key, value)

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
      # @todo need a better way to do this...
      if !@record.get('isNew') && key == 'id'
        return @attributes[key] = value

      @_actualSet(key, value)

    @record.set('isDirty', @isDirty())

    value

  # Strip value for atomic update
  strip: (key) ->
    delete @changedAttributes[key]

  isDirty: ->
    _.isPresent(@changedAttributes)

  setSavedAttributes: (object) ->
    # there's something weird going on here when destroy instantiates a record already in memory
    if object
      savedData = @savedData
      #attributes = @attributes
      for key, value of object
        field = @_getField(key)
        value = field.encode(value, @record) if field && value? # @todo think this is in reverse...
        savedData[key] = value
        #attributes[key] = value
    #_.extend(@attributes, object)

  commit: ->
    @previousChanges = @changes()
    @changedAttributes = {}
    @record.set('isDirty', false)

  rollback: ->
    _.extend(@attributes, @changedAttributes)
    @changedAttributes = {}
    @record.propertyDidChange('data')

  # Filters out the primary keys, from the attribute names, when the primary
  # key is to be generated (e.g. the id attribute has no value).
  attributesForCreate: ->
    @record.attributesForCreate()

  # Filters the primary keys and readonly attributes from the attribute names.
  attributesForUpdate: (keys) ->
    @record.attributesForUpdate(keys)

  attributeKeysForCreate: ->
    @record.attributeKeysForCreate()

  attributeKeysForUpdate: (keys) ->
    @record.attributeKeysForUpdate(keys)

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
      @

  # @private
  _push: (key, value, array = false) ->
    currentValue = @get(key)
    currentValue ||= []

    if array
      currentValue = currentValue.concat(_.castArray(value))
    else
      currentValue.push(value)

    # probably shouldn't reset it, need to consider
    @_actualSet(key, currentValue)

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
    @_actualSet(key, currentValue)

  # @private
  _add: (key, value, array = false) ->
    currentValue = @get(key)
    currentValue ||= []
    # @todo need to figure out better way of comparing old/new values, not based on actual javascript object instance
    currentValue = @_clonedValue(currentValue)

    if array
      for item in _.castArray(value)
        currentValue.push(item) if _.indexOf(currentValue, item) == -1
    else
      currentValue.push(value) if _.indexOf(currentValue, value) == -1

    # probably shouldn't reset it, need to consider
    @_actualSet(key, currentValue)

  # @private
  _inc: (key, value) ->
    currentValue = @get(key)
    currentValue ||= 0
    currentValue += value

    @_actualSet(key, currentValue)

  _getField: (key) ->
    @record.constructor.fields()[key]

  # @todo horrible hack, just getting it to work.
  _actualSet: (key, value) ->
    @_updateChangedAttribute(key, value)

    @attributes[key] = value# unless @record.constructor.relations().hasOwnProperty(key)

  _updateChangedAttribute: (key, value) ->
    @record._updateChangedAttribute(key, value)

  _clonedValue: (value) ->
    if _.isArray(value)
      value.concat()
    else if _.isDate(value)
      new Date(value.getTime())
    else if typeof value == 'object'
      _.clone(value)
    else
      value

  _defaultValue: (key) ->
    return field.defaultValue(@record) if field = @_getField(key)

module.exports = Tower.Model.Data