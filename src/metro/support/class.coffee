specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods']

class Metro.Class
  # Rename an instance method
  #
  # ``` coffeescript
  # class User
  #   @alias "methods", "instanceMethods"
  #
  # ```
  @alias: (to, from) ->
    Metro.Support.alias(@::, to, from)
  
  @accessor: (key, callback) ->
    Metro.Support.accessor(@::, key, callback)
    @
  
  @getter: (key, callback) ->
    Metro.Support.getter(@::, key, callback)
    @
  
  @setter: (key) ->
    Metro.Support.setter(@::, key)
    @
    
  @classAlias: (to, from) ->
    Metro.Support.alias(@, to, from)
    @
    
  @classAccessor: (key, callback) ->
    Metro.Support.accessor(@, key, callback)
    @
    
  @classGetter: (key, callback) ->
    Metro.Support.getter(@, key, callback)
    @
  
  @classSetter: (key) ->
    Metro.Support.setter(@, key)
    @

  @classEval: (block) ->
    block.call(@)

  @delegate: (key, options = {}) ->
    Metro.Support.delegate(@::, key, options)
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

  @instanceMethods: ->
    Metro.Support.methods(@::)
  
  @classMethods: ->
    Metro.Support.methods(@)
    
  @className: ->
    Metro.Support.functionName(@)
  
  className: ->
    @constructor.className()

module.exports = Metro.Class
