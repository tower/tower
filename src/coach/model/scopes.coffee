Coach.Model.Scopes =
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
      @[name] = if scope instanceof Coach.Model.Scope then scope else @where(scope)
    
    scoped: ->
      scope = new Coach.Model.Scope(model: @)
      scope.where(type: @name) if @baseClass().name != @name
      scope

for key in Coach.Model.Scope.scopes
  ((_key)->
    Coach.Model.Scopes.ClassMethods[_key] = ->
      @scoped()[_key](arguments...)
  )(key)

for key in Coach.Model.Scope.finders
  ((_key)->
    Coach.Model.Scopes.ClassMethods[_key] = ->
      @scoped()[_key](arguments...)
  )(key)

module.exports = Coach.Model.Scopes
