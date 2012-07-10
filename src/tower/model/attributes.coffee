# @mixin
Tower.Model.Attributes =
  Serialization: {}

  ClassMethods:
    dynamicFields: true

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

    changes: Ember.computed(->
      Ember.get(@get('data'), 'unsavedData')
    ).volatile()

    # @todo this is going to replace the above `changes` method
    changesHash: Ember.computed(->
      @get('data').changes()
    ).volatile()

    # @todo assign_attributes, assign_attributes, multiParameterAttributes
    attributes: Ember.computed(->
      if arguments.length == 2
        @assignAttributes(arguments[1]) if _.isHash(arguments[1])
      @get('data').copyAttributes()
    )

    assignAttributes: (attributes, options) ->
      return unless _.isHash(attributes)
      options ||= {}

      # like with the datepicker, such as date(1) == month, date(2) == day, date(3) == year
      multiParameterAttributes  = []
      nestedParameterAttributes = []

      unless options.withoutProtection
        role = options.as || 'default'
        attributes = @_sanitizeForMassAssignment(attributes, role)

      for k, v of attributes
        if k.indexOf("(") > -1
          multiParameterAttributes.push [ k, v ]
        else
          if _.isHash(v)
            nestedParameterAttributes.push [ k, v ]
          else
            @set(k, v)

      # assign any deferred nested attributes after the base attributes have been set
      for item in nestedParameterAttributes
        @set(item[0], item[1])

      # @assignMultiparameterAttributes(multiParameterAttributes)

    setSavedAttributes: (object) ->
      @get('data').setSavedAttributes(object)

    unknownProperty: (key) ->
      @get('data').get(key) if @get('dynamicFields')

    setUnknownProperty: (key, value) ->
      @get('data').set(key, value) if @get('dynamicFields')

for method in Tower.Store.Modifiers.SET
  do (method) ->
    Tower.Model.Attributes.InstanceMethods[method] = ->
      Ember.get(@, 'data')[method] arguments...

module.exports = Tower.Model.Attributes
