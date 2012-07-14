# @mixin
Tower.Model.Attributes =
  Serialization: {}

  ClassMethods:
    dynamicFields: true
    primaryKey: 'id'

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

    # attributeNames: Ember.computed ->

  InstanceMethods:
    dynamicFields: true

    # Want to get rid of this, don't like.
    data: Ember.computed((key, value) ->
      # sets the value or uses defaults
      value || new Tower.Model.Data(@)
    ).cacheable()

    attributes: Ember.computed(->
      if arguments.length == 2
        @assignAttributes(arguments[1]) if _.isHash(arguments[1])
      # @todo remove
      @get('data').attributes
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

    setSavedAttributes: (object) ->
      @get('data').setSavedAttributes(object)

    unknownProperty: (key) ->
      @get('data').get(key) if @get('dynamicFields')

    setUnknownProperty: (key, value) ->
      @get('data').set(key, value) if @get('dynamicFields')

    getAttribute: (key) ->
      @get('data').getAttribute(key)

    # @todo Use this to set an attribute in a more optimized way
    setAttribute: (key, value, operation) ->

    # @todo Use this to set multiple attributes in a more optimized way.
    setAttributes: (attributes) ->

    # @todo same as below, might want to redo api
    # setAttributeWithOperation: (operation, key, value) ->

for method in Tower.Store.Modifiers.SET
  do (method) ->
    Tower.Model.Attributes.InstanceMethods[method] = ->
      Ember.get(@, 'data')[method] arguments...

module.exports = Tower.Model.Attributes
