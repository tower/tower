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

  InstanceMethods:
    dynamicFields: true

    data: Ember.computed(->
      new Tower.Model.Data(@)
    ).cacheable()

    changes: Ember.computed(->
      Ember.get(@get('data'), 'unsavedData')
    )

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
