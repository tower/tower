Tower.Model.Dirty =
  isDirty: ->
    Tower.Support.Object.isPresent(@changes)
    
  attributeChanged: (name) ->
    change = @changes[name]
    return false unless change
    change[0] != change[1]
    
  attributeChange: (name) ->
    change = @changes[name]
    return undefined unless change
    change[1]
    
  attributeWas: (name) ->
    change = @changes[name]
    return undefined unless change
    change[0]
    
  resetAttribute: (name) ->
    
  toUpdates: ->
    result      = {}
    attributes  = @attributes
    
    for key, array of @changes
      result[key] = attributes[key]
    
    result.updatedAt ||= new Date
    
    result

  _attributeChange: (attribute, value) ->
    array       = @changes[attribute] ||= []
    beforeValue = array[0] ||= @attributes[attribute]
    array[1]    = value
    array       = null if array[0] == array[1]
    
    if array then @changes[attribute] = array else delete @changes[attribute]
    
    beforeValue
    
module.exports = Tower.Model.Dirty
