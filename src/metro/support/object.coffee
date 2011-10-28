_ = require('underscore')

class Object
  @isA: (object, isa) ->
    
  @isHash: ->
    object = arguments[0] || @
    _.isObject(object) && !(_.isFunction(object) || _.isArray(object))
  
module.exports = Object
