# @mixin
Tower.Model.Dirty =
  InstanceMethods:
    # Check if the model has any attributes that have been changed.
    #
    # @return [Boolean]
    #isDirty: ->

    attributeChanged: (name) ->

    attributeChange: (name) ->

    attributeWas: (name) ->

    resetAttribute: (name) ->

module.exports = Tower.Model.Dirty
