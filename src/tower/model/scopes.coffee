# @mixin
Tower.Model.Scopes =
  ClassMethods:
    # Define a named scope on the model class.
    # 
    # @example All users with firstName starting with the letter "a"
    #   class App.User extends Tower.Model
    #     @field "firstName"
    #     @scope "letterA", @where(firstName: /^a/)
    #   
    #   App.User.letterA().all()
    # 
    # @param [String] name
    # @param [Object] scope you can pass in conditions for the `where` method, or an actual scope instance.
    # 
    # @return [Tower.Model.Scope]
    scope: (name, scope) ->
      @[name] = if scope instanceof Tower.Model.Scope then scope else @where(scope)

    # Returns a {Tower.Model.Scope} with default criteria for the model class.
    # 
    # @return [Tower.Model.Scope]
    scoped: (options) ->
      new Tower.Model.Scope(@criteria(options))
    
    # Return a {Tower.Model.Criteria} to be used in building a query.
    # 
    # @return [Tower.Model.Criteria]
    criteria: (options = {}) ->
      options.model = @
      criteria = new Tower.Model.Criteria(options)
      criteria.where(type: @name) if @baseClass().name != @name
      criteria

    defaultSort: (object) ->
      @_defaultSort = object if object
      @_defaultSort ||= {name: "createdAt", direction: "desc"}

    defaultScope: ->

for key in Tower.Model.Scope.queryMethods
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

for key in Tower.Model.Scope.finderMethods
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

for key in Tower.Model.Scope.persistenceMethods
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

module.exports = Tower.Model.Scopes