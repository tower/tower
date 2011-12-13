Metro.Model.Dirty =
  isDirty: ->
    Metro.Support.Object.isPresent(@changes)

  _attributeChange: (attribute, value) ->
    array       = @changes[attribute] ||= []
    beforeValue = array[0] ||= @attributes[attribute]
    array[1]    = value
    array       = null if array[0] == array[1]
    
    if array then @changes[attribute] = array else delete @changes[attribute]
    
    beforeValue
    
module.exports = Metro.Model.Dirty
