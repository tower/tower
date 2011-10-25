class Association
  constructor: (sourceClassName, name, options = {}) ->
    @sourceClassName = sourceClassName
    @targetClassName = options.className || name
  
  targetClass: ->
    global[@targetClassName]
    
  scoped: ->
    (new Metro.Model.Scope()).where(conditions())
  
  conditions: ->
    @_conditions ?= {}

module.exports = Association
