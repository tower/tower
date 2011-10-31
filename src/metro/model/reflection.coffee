class Metro.Model.Reflection
  constructor: (type, sourceClassName, name, options = {}) ->
    @type             = type
    @sourceClassName  = sourceClassName
    @targetClassName  = options.className || Metro.Support.String.camelize(Metro.Support.String.singularize(name))
    @foreignKey       = options.foreignKey
  
  targetClass: ->
    global[@targetClassName]
    
  association: (owner) ->
    new Metro.Model.Association(owner, @)

module.exports = Metro.Model.Reflection
