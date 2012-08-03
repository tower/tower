# @mixin
Tower.Model.Attributes =
  Serialization: {}

  ClassMethods:
    # @todo there are no tests for this yet.
    dynamicFields: true

    # @todo this is not being used yet.
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
    # @private
    # 
    # @return [Object]
    _defaultAttributes: (record) ->
      attributes = {}

      for name, field of @fields()
        attributes[name] = field.defaultValue(record)

      attributes.type ||= @className() if @isSubClass()

      attributes

    initializeAttributes: (record, attributes) ->
      _.defaults(attributes, @_defaultAttributes(record))

    # attributeNames: Ember.computed ->

  InstanceMethods:
    dynamicFields: true

    attributes: Ember.computed(->
      throw new Error('Cannot set attributes hash directly') if arguments.length == 2

      {}
    ).cacheable()

    # Performs an operation on an attribute value.
    # 
    # You don't need to use this directly in most cases, instead use the helper methods
    # such as `push`, `set`, etc.
    modifyAttribute: (operation, key, value) ->
      operation = Tower.Store.Modifiers.MAP[operation]
      operation = if operation then operation.replace(/^\$/, '') else 'set'

      @[operation](key, value)

    atomicallySetAttribute: ->
      @modifyAttribute(arguments...)

    # This takes in a params hash, usually straight from a request in a controller,
    # and makes sure you don't set any insecure/protected attributes unintentionally.
    assignAttributes: (attributes, options, operation) ->
      return unless _.isHash(attributes)
      options ||= {}

      unless options.withoutProtection
        options.as ||= 'default'
        attributes = @_sanitizeForMassAssignment(attributes, options.as)

      Ember.beginPropertyChanges()

      @_assignAttributes(attributes, options, operation)

      Ember.endPropertyChanges()

    unknownProperty: (key) ->
      @getAttribute(key) if @get('dynamicFields')

    setUnknownProperty: (key, value) ->
      @setAttribute(key, value) if @get('dynamicFields')

    getAttribute: (key) ->
      #@get('data').getAttribute(key)
      passedKey = key
      # @todo cleanup/optimize
      key = if key == '_id' then 'id' else key
      result = @_cid if key == '_cid'
      result = Ember.get(@get('attributes'), key) if result == undefined
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
        key = key.replace('$', '')
        if key == 'set'
          @assignAttributes(value)
        else
          @[key](value)
      else
        # @todo need a better way to do this...
        if !@get('isNew') && key == 'id'
          @get('attributes')[key] = value
          return value

        @_actualSet(key, value)

      @set('isDirty', _.isPresent(@get('changedAttributes')))

      value

    _actualSet: (key, value, dispatch) ->
      @_updateChangedAttribute(key, value)

      @get('attributes')[key] = value# unless @record.constructor.relations().hasOwnProperty(key)

      # @todo refactor.
      #   Basically, if you do atomic operations on attributes there needs to be some
      #   way to tell ember to update bindings.
      @propertyDidChange(key) if dispatch

      value

    # @todo Use this to set multiple attributes in a more optimized way.
    setAttributes: (attributes) ->

    # @todo same as below, might want to redo api
    # setAttributeWithOperation: (operation, key, value) ->

    # @todo handle multi-parameter attributes, such as the datepicker.
    # 
    # @private
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

#for method in Tower.Store.Modifiers.SET
#  do (method) ->
#    Tower.Model.Attributes.InstanceMethods[method] = ->
#      Ember.get(@, 'data')[method] arguments...

module.exports = Tower.Model.Attributes
