class Dirty
  isDirty: ->
    changes = @changes()
    for change of changes
      return true
    return false
    
  changes: ->
    @_changes ?= {}
    
  _trackChangedAttribute: (attribute, value) ->
    array = @changes[attribute] ?= []
    beforeValue = array[0] ?= @attributes[attribute]
    array[1] = value
    array = null if array[0] == array[1]
    if array
      @changes[attribute] = array
    else
      delete @changes[attribute]

    beforeValue
    
module.exports = Dirty
