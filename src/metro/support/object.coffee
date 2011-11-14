Metro.Support.Object =
  isA: (object, isa) ->
    
  isHash: ->
    object = arguments[0] || @
    _.isObject(object) && !(_.isFunction(object) || _.isArray(object))
  
  isPresent: (object) ->
    for key, value of object
      return true
    return false
  
  isBlank: (object) ->
    for key, value of object
      return false
    return true
  
module.exports = Metro.Support.Object
