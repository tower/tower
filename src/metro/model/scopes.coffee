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
      new Metro.Model.Scope(model: @)


for key in Metro.Model.Scope.scopes
  ((_key)->
    Metro.Model.Scopes.ClassMethods[_key] = ->
      @scoped()[_key](arguments...)
  )(key)

for key in Metro.Model.Scope.finders
  ((_key)->
    Metro.Model.Scopes.ClassMethods[_key] = ->
      @scoped()[_key](arguments...)
  )(key)

module.exports = Metro.Model.Scopes
