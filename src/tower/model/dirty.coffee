# @mixin
Tower.Model.Dirty =
  InstanceMethods:
    # Check if the model has any attributes that have been changed.
    #
    # @return [Boolean]
    isDirty: ->
      _.isPresent(@changes)

    attributeChanged: (name) ->
      {before, after} = @changes
      return false if _.isBlank(before)
      before  = before[name]

      for key, value of after
        if value.hasOwnProperty(name)
          after = value
          break

      return false unless after
      before != after

    attributeChange: (name) ->
      change = @changes[name]
      return undefined unless change
      change[1]

    attributeWas: (name) ->
      change = @changes.before[name]
      return undefined if change == undefined
      change

    resetAttribute: (name) ->
      array = @changes[name]
      @set(name, array[0]) if array
      @

    toUpdates: ->
      result      = {}
      attributes  = @attributes
      
      # need to clean
      for key, array of @changes
        result[key] = attributes[key] unless key.match(/(before|after)/)
      
      result.updatedAt ||= new Date

      result

    # @private
    _attributeChange: (attribute, value) ->
      array       = @changes[attribute] ||= []
      beforeValue = array[0] ||= @attributes[attribute]
      array[1]    = value
      array       = null if array[0] == array[1]

      if array then @changes[attribute] = array else delete @changes[attribute]

      beforeValue

    # @private
    _resetChanges: ->
      @changes =
        before: {}
        after:  {}

module.exports = Tower.Model.Dirty
