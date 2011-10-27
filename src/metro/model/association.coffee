class Association
  constructor: (sourceClassName, name, options = {}) ->
    @sourceClassName  = sourceClassName
    @targetClassName  = options.className || name
    @foreignKey       = options.foreignKey
  
  targetClass: ->
    global[@targetClassName]
    
  scoped: (id) ->
    (new Metro.Model.Scope(@targetClassName)).where(@conditions(id))
  
  conditions: (id) ->
    result = {}
    result[@foreignKey] = id if id && @foreignKey
    result

module.exports = Association
