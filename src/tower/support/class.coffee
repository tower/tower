specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods']

class Tower.Class
  # Rename an instance method
  #
  # ``` coffeescript
  # class User
  #   @alias "methods", "instanceMethods"
  #
  # ```
  @alias: (to, from) ->
    Tower.Support.Object.alias(@::, to, from)
  
  @accessor: (key, callback) ->
    Tower.Support.Object.accessor(@::, key, callback)
    @
  
  @getter: (key, callback) ->
    Tower.Support.Object.getter(@::, key, callback)
    @
  
  @setter: (key) ->
    Tower.Support.Object.setter(@::, key)
    @
    
  @classAlias: (to, from) ->
    Tower.Support.Object.alias(@, to, from)
    @
    
  @classAccessor: (key, callback) ->
    Tower.Support.Object.accessor(@, key, callback)
    @
    
  @classGetter: (key, callback) ->
    Tower.Support.Object.getter(@, key, callback)
    @
  
  @classSetter: (key) ->
    Tower.Support.Object.setter(@, key)
    @

  @classEval: (block) ->
    block.call(@)

  @delegate: (key, options = {}) ->
    Tower.Support.Object.delegate(@::, key, options)
    @
  
  @mixin: (self, object) ->
    for key, value of object when key not in specialProperties
      self[key] = value
    
    object
  
  @extend: (object) ->
    @mixin(@, object)
    
    extended = object.extended
    extended.apply(object) if extended
    
    object
  
  @include: (object) ->
    @extend(object.ClassMethods) if object.hasOwnProperty("ClassMethods")
    @include(object.InstanceMethods) if object.hasOwnProperty("InstanceMethods")
    
    @mixin(@::, object)
    
    included = object.included
    included.apply(object) if included
    
    object
    
  @className: ->
    Tower.Support.Object.functionName(@)
  
  className: ->
    @constructor.className()
  
  constructor: ->
    @initialize()
    
  initialize: ->
    
module.exports = Tower.Class
