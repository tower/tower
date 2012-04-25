# @mixin
Tower.Model.Attributes =
  ClassMethods:
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
    data: Ember.computed(->
      new Tower.Model.Data(@)
    ).cacheable()
    
    get: (key) ->
      _.getNestedAttribute @, key
    #  Ember.get(@, key) || Ember.get(@, 'data').get(key)
      
for method in Tower.Store.Modifiers.SET
  do (method) ->
    Tower.Model.Attributes.InstanceMethods[method] = ->
      Ember.get(@, 'data')[method] arguments...

module.exports = Tower.Model.Attributes
