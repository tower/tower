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
      args    = _.args(arguments)
      options = _.extractOptions(arguments)

module.exports = Tower.Model.MassAssignment
