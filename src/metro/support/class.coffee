moduleKeywords = ['included', 'extended', 'prototype']

class Class
  # Rename an instance method
  # 
  # ``` coffeescript
  # class User
  #   @alias "methods", "instance_methods"
  #   
  # ```
  @alias: (to, from) ->
    @::[to] = @::[from]
  
  @alias_method: (to, from) ->
    @::[to] = @::[from]
    
  @delegate: ->
    options = arguments.pop()
    to      = options.to
    self    = @
    for key in arguments
      self::[key] = to[key]
  
  @include: (obj) ->
    throw new Error('include(obj) requires obj') unless obj
    
    @extend(obj)
    
    for key, value of obj.prototype when key not in moduleKeywords
      @::[key] = value
    
    included = obj.included
    included.apply(this) if included
    @
  
  @extend: (obj) ->
    throw new Error('extend(obj) requires obj') unless obj
    for key, value of obj when key not in moduleKeywords
      @[key] = value
    
    extended = obj.extended
    extended.apply(this) if extended
    @
  
  @new: ->
    new @(arguments...)
    
  @instance_methods: ->
    result = []
    result.push(key) for key of @prototype
    result
    
  @class_methods: ->
    result = []
    result.push(key) for key of @
    result
  
  instance_exec: ->
    arguments[0].apply(@, arguments[1..-1]...)
  
  instance_eval: (block) ->
    block.apply(@)
    
  send: (method) ->
    if @[method]
      @[method].apply(arguments...)
    else
      @methodMissing(arguments...) if @methodMissing
  
  methodMissing: (method) ->
    
  
# add it to the function prototype!
for key, value of Class
  Function.prototype[key] = value  
  
exports = module.exports = Class
global.Class = Class
