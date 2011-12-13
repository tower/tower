Metro.Model.Scopes =
  ClassMethods:
    # Create named scope class method finders for a model.
    #
    # @example Add scope to a User model
    # 
    #     class User
    #       @scope "active",      @where(active: true)
    #       @scope "recent",      @where(createdAt: ">=": 2.days().ago()).order("createdAt", "desc").order("email", "asc")
    #       @scope "developers",  @where(tags: _anyIn: ["ruby", "javascript"])
    # 
    scope: (name, scope) ->
      @[name] = if scope instanceof Metro.Model.Scope then scope else @where(scope)
    
    scoped: ->
      new Metro.Model.Scope(Metro.namespaced(@name))

for key in Metro.Model.Scope.scopes
  Metro.Model.Scopes.ClassMethods[key] ->
    @scoped()[key](arguments...)
    @
    
for key in Metro.Model.Scope.finders
  Metro.Model.Scopes.ClassMethods[key] ->
    @scoped()[key](arguments...)
    
module.exports = Metro.Model.Scopes
