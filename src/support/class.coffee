moduleKeywords = ['included', 'extended']

class Class
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
  
  instance_exec: ->
    arguments[0].apply(@, arguments[1..-1]...)
  
  instance_eval: (block) ->
    block.apply(@)

# add it to the function prototype!
for key, value of Class
  Function.prototype[key] = value

exports = module.exports = Class
global.Class = Class
