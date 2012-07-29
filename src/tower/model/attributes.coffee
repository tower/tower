# @mixin
Tower.Model.Attributes =
  Serialization: {}

  ClassMethods:
    dynamicFields: true
    primaryKey: 'id'

    # @todo
    # 
    # List of names you should not use as field names.
    destructiveFields: [
      'id'
      'push'
      'isValid'
      'data'
      'changes'
      'getAttribute'
      'setAttribute'
      'unknownProperty'
      'setUnknownProperty'
    ]

    # Define a database field on your model.
    #
    # The field can have one of several types.
    #
    # @example String field
    #   class App.User extends Tower.Model
    #     @field 'email'
    #
    # @param [String] name
    # @param [Object] options
    # @option options [String] type the data type for this field
    # @option option [Object] default default value
    #
    # @return [Tower.Model.Attribute]
    field: (name, options) ->
      # @todo convert this to Ember.Map so it's an ordered set
      @fields()[name] = new Tower.Model.Attribute(@, name, options)

    # The set of fields for the model.
    #
    # @return [Object]
    fields: ->
      fields = @metadata().fields

      switch arguments.length
        when 0
          fields
        when 1
          @field(name, options) for name, options of arguments[0]
        else
          names   = _.args(arguments)
          options = _.extractOptions(names)
          @field(name, options) for name in names

      fields

    # Returns a hash with keys for every attribute, and the default value (or `undefined`).
    # 
    # @return [Object]
    _defaultAttributes: (record) ->
      attributes = {}

      for name, field of @fields()
        attributes[name] = field.defaultValue(record)

      attributes

    # attributeNames: Ember.computed ->

  InstanceMethods:
    dynamicFields: true

    # Want to get rid of this, don't like.
    data: Ember.computed((key, value) ->
      # sets the value or uses defaults
      value || new Tower.Model.Data(@)
    ).cacheable()

    # How about you can only `get` the attributes, it will make the API much simpler.
    # It needs to be all fields with default values
    attributes: Ember.computed(->
      throw new Error('Cannot set attributes hash directly') if arguments.length == 2
      #if arguments.length == 2
      #  @assignAttributes(arguments[1]) if _.isHash(arguments[1])
      #@get('data').getAttributes()
      # @todo should this also include the values from @defaultScope ?
      @constructor._defaultAttributes(@)
    ).property('data')

    modifyAttribute: (operation, key, value) ->
      operation = Tower.Store.Modifiers.MAP[operation]
      operation = if operation then operation.replace(/^\$/, '') else 'set'

      @[operation](key, value)

    atomicallySetAttribute: ->
      @modifyAttribute(arguments...)

    # @todo add to .build, .create, #updateAttributes
    # This takes in a params hash, usually straight from a request in a controller, 
    # so it should be thoroughly cleansed.
    assignAttributes: (attributes, options, operation) ->
      return unless _.isHash(attributes)
      options ||= {}

      unless options.withoutProtection
        options.as ||= 'default'
        attributes = @_sanitizeForMassAssignment(attributes, options.as)

      Ember.beginPropertyChanges()

      @_assignAttributes(attributes, options, operation)

      Ember.endPropertyChanges()

    setSavedAttributes: (object) ->
      @get('data').setSavedAttributes(object)
      #_.extend(@savedData, object)

    unknownProperty: (key) ->
      #@getAttribute(key) if @get('dynamicFields')
      @get('data').get(key) if @get('dynamicFields')

    setUnknownProperty: (key, value) ->
      #@setAttribute(key, value) if @get('dynamicFields')
      @get('data').set(key, value) if @get('dynamicFields')

    getAttribute: (key) ->
      #@get('data').getAttribute(key)
      passedKey = key
      # @todo cleanup/optimize
      key = if key == '_id' then 'id' else key
      result = @_cid if key == '_cid'
      result = Ember.get(@get('attributes'), key) if result == undefined
      result = Ember.get(@savedData, key) if result == undefined
      # in the "public api" we want there to be no distinction between cid/id, that should be managed transparently.
      result = @_cid if passedKey == 'id' && result == undefined
      result

    # @todo Use this to set an attribute in a more optimized way
    setAttribute: (key, value, operation) ->
      if key == '_cid'
        if value?
          @_cid = value
        else
          delete @_cid
        @propertyDidChange('id')
        return value

      if Tower.Store.Modifiers.MAP.hasOwnProperty(key)
        @[key.replace('$', '')](value)
      else
        # @todo need a better way to do this...
        if !@get('isNew') && key == 'id'
          @get('attributes')[key] = value
          return value

        @_actualSet(key, value)

      @set('isDirty', _.isPresent(@get('changedAttributes')))

      value

    # @todo Use this to set multiple attributes in a more optimized way.
    setAttributes: (attributes) ->

    # @todo same as below, might want to redo api
    # setAttributeWithOperation: (operation, key, value) ->
      
    _assignAttributes: (attributes, options, operation) ->
      # such as with the datepicker, such as date(1) == month, date(2) == day, date(3) == year
      multiParameterAttributes  = []
      nestedParameterAttributes = []
      modifiedAttributes        = []

      # this recursion needs to be thought about again
      for k, v of attributes
        if k.indexOf('(') > -1
          multiParameterAttributes.push [ k, v ]
        else if k.charAt(0) == '$'
          @assignAttributes(v, options, k)
        else
          if _.isHash(v)
            nestedParameterAttributes.push [ k, v ]
          else
            @modifyAttribute(operation, k, v)

      # @assignMultiparameterAttributes(multiParameterAttributes)

      # assign any deferred nested attributes after the base attributes have been set
      for item in nestedParameterAttributes
        @modifyAttribute(operation, item[0], item[1])

for method in Tower.Store.Modifiers.SET
  do (method) ->
    Tower.Model.Attributes.InstanceMethods[method] = ->
      Ember.get(@, 'data')[method] arguments...

module.exports = Tower.Model.Attributes
