Tower.Model.Scopes =
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
      @[name] = if scope instanceof Tower.Model.Scope then scope else @where(scope)
    
    scoped: ->
      scope = new Tower.Model.Scope(model: @)
      scope.where(type: @name) if @baseClass().name != @name
      scope

for key in Tower.Model.Scope.scopes
  ((_key)->
    Tower.Model.Scopes.ClassMethods[_key] = ->
      @scoped()[_key](arguments...)
  )(key)

for key in Tower.Model.Scope.finders
  ((_key)->
    Tower.Model.Scopes.ClassMethods[_key] = ->
      @scoped()[_key](arguments...)
  )(key)

module.exports = Tower.Model.Scopes
