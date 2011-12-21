Tower.Model.Dirty =
  isDirty: ->
    Tower.Support.Object.isPresent(@changes)

  _attributeChange: (attribute, value) ->
    array       = @changes[attribute] ||= []
    beforeValue = array[0] ||= @attributes[attribute]
    array[1]    = value
    array       = null if array[0] == array[1]
    
    if array then @changes[attribute] = array else delete @changes[attribute]
    
    beforeValue
    
  toUpdates: ->
    result      = {}
    attributes  = @attributes
    
    for key, array of @changes
      result[key] = attributes[key]
    
    result
    
module.exports = Tower.Model.Dirty
