moduleKeywords = ['included', 'extended', 'prototype']

class Class
  # Rename an instance method
  # 
  # ``` coffeescript
  # class User
  #   @alias "methods", "instanceMethods"
  #   
  # ```
  @alias: (to, from) ->
    @::[to] = @::[from]
  
  @aliasMethod: (to, from) ->
    @::[to] = @::[from]
  
  @accessor: (key, self, callback) ->
    @_accessors ?= []
    @_accessors.push(key)
    @getter(key, self, callback)
    @setter(key, self)
    @
  
  @getter: (key, self, callback) ->
    self    ?= @prototype
    
    unless self.hasOwnProperty("_getAttribute")
      Object.defineProperty self, "_getAttribute", enumerable: false, configurable: true, value: (key) -> @["_#{key}"]
    
    @_getters ?= []
    @_getters.push(key)
    Object.defineProperty self, "_#{key}", enumerable: false, configurable: true
    Object.defineProperty self, key, enumerable: true, configurable: true, 
      get: ->
        @["_getAttribute"](key) || (@["_#{key}"] = callback.apply(@) if callback)
    
    @
  
  @setter: (key, self) ->
    self    ?= @prototype
    
    unless self.hasOwnProperty("_setAttribute")
      Object.defineProperty self, method, enumerable: false, configurable: true, value: (key, value) -> @["_#{key}"] = value
    
    @_setters ?= []
    @_setters.push(key)
    Object.defineProperty self, "_#{key}", enumerable: false, configurable: true
    Object.defineProperty self, key, enumerable: true, configurable: true, set: (value) -> @["_setAttribute"](key, value)
    
    @
    
  @classEval: (block) ->
    block.call(@)
    
  @delegate: ->
    options = arguments.pop()
    to      = options.to
    self    = @
    for key in arguments
      self::[key] = to[key]
  
  @include: (obj) ->
    throw new Error('include(obj) requires obj') unless obj
    
    @extend(obj)
    
    #for key, value of obj.prototype when key not in moduleKeywords
    #  @::[key] = value
    
    c = @
    child = @
    parent = obj
    
