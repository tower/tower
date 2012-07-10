# @mixin
Tower.Model.MassAssignment =
  ClassMethods:
    # Attributes named in this macro are protected from mass-assignment
    # whenever attributes are sanitized before assignment.
    #
    # A role for the attributes is optional,
    # if no role is provided then `default` is used.
    # A role can be defined by using the :as option.
    #
    # Mass-assignment to these attributes will simply be ignored,
    # to assign to them you can use direct writer methods.
    # This is meant to protect sensitive attributes from
    # being overwritten by malicious users tampering with URLs or forms.
    protected: ->
      @_attributeAssignment('protected', arguments...)

    protectedAttributes: Ember.computed(->
      blacklist = {}
      blacklist._deny = (key) -> _.include(@, key)
      blacklist
    ).cacheable()

    accessibleAttributes: Ember.computed(->
      whitelist = {}
      whitelist._deny = (key) -> !_.include(@, key)
      whitelist
    ).cacheable()

    activeAuthorizer: Ember.computed(->
      Ember.get(@, 'protectedAttributes')
    ).cacheable()

    #attributesProtectedByDefault: Ember.computed(->
    #  ['id']
    #).cacheable()

    # Specifies a white list of model attributes that can be set via mass-assignment.
    #
    # Like `protected`, a role for the attributes is optional,
    # if no role is provided then `default` is used.
    # A role can be defined by using the `as` option.
    #
    # This is the opposite of the `protected` macro:
    # Mass-assignment will only set attributes in this list,
    # to assign to the rest of attributes you can use direct writer methods.
    # This is meant to protect sensitive attributes from
    # being overwritten by malicious users tampering with URLs or forms.
    # If you’d rather start from an all-open default and restrict attributes as needed,
    # have a look at {Tower.Model.MassAssigment.protected Tower.Model.protected}.
    accessible: ->
      @_attributeAssignment('accessible', arguments...)

    _attributeAssignment: (type) ->
      args    = _.args(arguments, 1)
      options = _.extractOptions(args)
      roles   = _.castArray(options.as || 'default')

      assignments = Ember.get(@, "#{type}Attributes")

      for role in roles
        attributes = assignments[role]
        
        if attributes
          attributes = attributes.concat(args)
        else
          attributes = args

        attributes.deny = assignments._deny # tmp hack

        assignments[role] = attributes

      Ember.set(@, 'activeAuthorizer', assignments)

      @

  _sanitizeForMassAssignment: (attributes, role = 'default') ->
    rejected            = []
    authorizer          = Ember.get(@constructor, 'activeAuthorizer')[role]
    sanitizedAttributes = {}

    # @todo impl hash.reject in underscore.js
    for key in _.keys(attributes)
      if authorizer.deny(key)
        rejected.push(key)
      else
        sanitizedAttributes[key] = attributes[key]

    # This should be refactored later into a LoggerSanitizer class if there's not a simpler way
    @_processRemovedAttributes(rejected) unless _.isEmpty(rejected)

    sanitizedAttributes

  _processRemovedAttributes: (keys) ->
    # console.warn "Can't mass-assign protected attributes: #{keys.join(', ')}"

module.exports = Tower.Model.MassAssignment
