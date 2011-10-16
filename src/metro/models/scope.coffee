class Scope
  # Create named scope class method finders for a model.
  #
  # ``` coffeescript
  # class User
  #   @scope "active", where: {active: true}
  # ```
  @scope: (name, options) ->
    
  @where: ->
    
    
exports = module.exports = Scope
