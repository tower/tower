# @mixin
Tower.Model.Dirty =
  # Returns a hash in the format `{attribute1Name: [oldValue, newValue]}`, 
  # only for the attributes that have different before/after values.
  # 
  # @return [Object]
  changes: Ember.computed(->
    attributes        = @get('attributes')

    injectChange = (memo, value, key) =>
      memo[key] = [value, @getAttribute(key)]# [value, attributes[key]] # [old, new]
      memo

    _.inject(@get('changedAttributes'), injectChange, {})
  ).volatile()

  # The set of attributes sent to the database.
  # 
  # When the record is new, it is all the attributes except for the `id` 
  # and any attribute with an `undefined` value (`null` values still go to the database).
  # When the record is being updated, it only sends the attributes that have changed.
  # 
  # Some properties are set in before create/save/validate hooks, such as `createdAt` and `updatedAt`.
  # So when `record.get('dirtyAttributes')` is called from inside the `save` method for example,
  # as it is in the mongodb store, it is going to include those additional properties.
  # 
  # @example
  #   user = App.User.build(firstName: 'Newton')
  #   user.get('dirtyAttributes') #=> {firstName: 'Newton'}
  # 
  # @todo should dirtyAttributes include embedded documents?
  #   or should embedded documents be saved after the the parent model saves?
  #   this is the way mongoid does it (the later)
  dirtyAttributes: Ember.computed(->
    if @get('isNew')
      @attributesForCreate()
    else
      @attributesForUpdate()
  ).volatile()

  # A hash of the original attributes values before they were changed (if they were changed at all).
  # 
  # @example
  #   class App.Post extends Tower.Model
  #     @field 'likeCount', type: 'Integer', default: 0
  #     @field 'title', type: 'String'
  #     @field 'content', type: 'String'
  #   
  #   post = App.Post.build()
  #   post.get('attributes') #=> {id: undefined, likeCount: 0, title: undefined, content: undefined}
  #   post.get('dirtyAttributes') #=> {likeCount: 0}
  #   # Notice that even though there are 'dirty' attributes, there are no changed attributes,
  #   # because the dirty attribute `likeCount` is a default value.
  #   post.get('changedAttributes') #=> {}
  #   # But you can change that:
  #   post.set('likeCount', 1)
  #   post.get('changedAttributes') #=> {likeCount: [0, 1]}
  #   post.set('likeCount', 0)
  #   post.get('changedAttributes') #=> {}
  #   post.set('title', 'First Post')
  #   post.get('changedAttributes') #=> {title: [undefined, 'First Post']}
  # 
  # @return [Object]
  changedAttributes: Ember.computed((key, value) ->
    {}
  ).cacheable()

  # Array of changed attribute names.
  # 
  # @return [Array]
  changed: Ember.computed(->
    _.keys(@get('changedAttributes'))
  ).volatile()

  # Returns true if an attribute has changed, false otherwise.
  # 
  # @return [Boolean]
  attributeChanged: (name) ->
    @get('changedAttributes').hasOwnProperty(name)

  # Returns an array of `[beforeValue, afterValue]` if an attribute has changed, otherwise it returns `undefined`.
  attributeChange: (name) ->
    [@get('changedAttributes')[name], @get('attributes')[name]] if @attributeChanged(name)

  # Returns the previous attribute value, or `undefined`.
  attributeWas: (name) ->
    @get('changedAttributes')[name]

  # Sets the attribute value back to the default (or `undefined` if no value was set).
  resetAttribute: (key) ->
    changedAttributes = @get('changedAttributes')
    attributes        = @get('attributes')

    if changedAttributes.hasOwnProperty(key)
      value = changedAttributes[key]
    else
      value = @_defaultValue(key)

    @set(key, value)

  _defaultValue: (key) ->
    return field.defaultValue(@@) if field = @_getField(key)

  _getField: (key) ->
    @constructor.fields()[key]

  # Returns a hash of all the attributes to be persisted to the database on create.
  # 
  # It ignores any attribute with a value of `undefined` (but doesn't ignore `null` values).
  # 
  # @return [Object]
  attributesForCreate: ->
    @_attributesForPersistence(@attributeKeysForCreate())
  
  # Returns a hash of all the attributes to be persisted to the database on update.
  # 
  # It only includes the attributes that have changed since last save.
  # 
  # @return [Object]
  attributesForUpdate: (keys) ->
    @_attributesForPersistence(@attributeKeysForUpdate(keys))

  # This should only get the keys which have been defined, so it doesn't insert null values when
  # it doesn't need to.
  attributeKeysForCreate: ->
    primaryKey  = 'id'
    attributes  = @get('attributes')
    result      = []
    
    for key, value of attributes
      result.push(key) unless (key == primaryKey || typeof value == 'undefined')

    result

  # This only returns keys for attributes that have changed.
  attributeKeysForUpdate: (keys) ->
    primaryKey  = 'id'
    keys ||= _.keys(@get('changedAttributes'))
    _.select keys, (key) -> key != primaryKey

  # @private
  _updateChangedAttribute: (key, value) ->
    changedAttributes = @get('changedAttributes')
    # @todo this is not the current attributes... need to get rid of data.unsavedData
    attributes        = @get('attributes')
    # @todo, need to account for typecasting better
    if changedAttributes.hasOwnProperty(key)
      if _.isEqual(changedAttributes[key], value)
        delete changedAttributes[key]
    else
      old = @_clonedValue(attributes[key]) # @readAttribute(key)
      changedAttributes[key] = old unless _.isEqual(old, value) # if old != value

  # @private
  _attributesForPersistence: (keys) ->
    result      = {}
    attributes  = @get('attributes')

    for key in keys
      result[key] = attributes[key]

    result
    
  _clonedValue: (value) ->
    if _.isArray(value)
      value.concat()
    else if _.isDate(value)
      new Date(value.getTime())
    else if typeof value == 'object'
      _.clone(value)
    else
      value

module.exports = Tower.Model.Dirty
