_ = require('underscore')

class Object
  @is_a: (object, isa) ->
    
  @is_hash: ->
    object = arguments[0] || @
    _.isObject(object) && !(_.isFunction(object) || _.isArray(object))
  
module.exports = Object
