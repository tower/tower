_ = Tower._

# @mixin
Tower.ModelScopes =
  ClassMethods:
    # Define a named scope on the model class.
    #
    # @example All users with firstName starting with the letter 'a'
    #   class App.User extends Tower.Model
    #     @field 'firstName'
    #     @scope 'letterA', @where(firstName: /^a/)
    #
    #   App.User.letterA().all()
    #
    # @param [String] name
    # @param [Object] scope you can pass in conditions for the `where` method, or an actual scope instance.
    #
    # @return [Tower.ModelScope]
    scope: (name, scope) ->
      scope   = if scope instanceof Tower.ModelScope then scope else @where(scope)
      @[name] = ->
        @scoped().where(scope.cursor)

    # Returns a {Tower.ModelScope} with default cursor for the model class.
    #
    # @return [Tower.ModelScope]
    scoped: (options = {}) ->
      cursor        = @cursor(options)
      # default scopes aren't 100% yet
      defaultScope  = @defaults().scope unless options.noDefault

      if defaultScope
        defaultScope.where(cursor)
      else
        new Tower.ModelScope(cursor)

    # Return a {Tower.ModelCursor} to be used in building a query.
    #
    # @return [Tower.ModelCursor]
    cursor: (options = {}) ->
      options.model = @
      cursor = Tower.ModelCursor.make()
      cursor.make(options)
      cursor.where(type: @className()) if @baseClass().className() != @className()
      cursor

    # Removes default scope, but still allows you to use chainable scopes
    unscoped: ->
      @scoped(noDefault: true)

    toCursor: ->
      @cursor(arguments...)

for key in Tower.ModelScope.queryMethods
  do (key) ->
    Tower.ModelScopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

for key in Tower.ModelScope.finderMethods
  do (key) ->
    Tower.ModelScopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

for key in Tower.ModelScope.persistenceMethods
  do (key) ->
    Tower.ModelScopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

module.exports = Tower.ModelScopes