specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods']

Tower.Class = Ember.Object.extend()

Tower.Class.reopenClass
  mixin: (self, object) ->
    for key, value of object when key not in specialProperties
      self[key] = value

    object

  extend: (object) ->
    extended = object.extended
    delete object.extended
    
    #@mixin(@, object)
    @reopenClass object
    
    extended.apply(object) if extended

    object

  #self: @extend

  include: (object) ->
    included = object.included
    delete object.included

    @extend(object.ClassMethods) if object.hasOwnProperty("ClassMethods")
    @include(object.InstanceMethods) if object.hasOwnProperty("InstanceMethods")

    @mixin(@::, object)
    #@reopen object

    included.apply(object) if included

    object

  className: ->
    _.functionName(@)
    
module.exports = Tower.Class
