class Association
  constructor: (owner, reflection) ->
    @owner      = owner
    @reflection = reflection
  
  targetClass: ->
    global[@reflection.targetClassName]
    
  scoped: ->
    (new Metro.Model.Scope(@reflection.targetClassName)).where(@conditions())
    
  conditions: ->
    result = {}
    result[@reflection.foreignKey] = @owner.id if @owner.id && @reflection.foreignKey
    result
    
  @delegates "where", "find", "all", "first", "last", "store", to: "scoped"
  
module.exports = Association
