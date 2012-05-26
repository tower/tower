# @mixin
Tower.Model.Scopes =
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
    # @return [Tower.Model.Scope]
    scope: (name, scope) ->
      scope   = if scope instanceof Tower.Model.Scope then scope else @where(scope)
      @[name] = ->
        @scoped().where(scope.cursor)

    # Returns a {Tower.Model.Scope} with default cursor for the model class.
    #
    # @return [Tower.Model.Scope]
    scoped: (options) ->
      cursor        = @cursor(options)
      defaultScope  = @defaults().scope

      if defaultScope
        defaultScope.where(cursor)
      else
        new Tower.Model.Scope(cursor)

    # Return a {Tower.Model.Cursor} to be used in building a query.
    #
    # @return [Tower.Model.Cursor]
    cursor: (options = {}) ->
      options.model = @
      cursor = Tower.Model.Cursor.create()
      cursor.make(options)
      cursor.where(type: @className()) if @baseClass().className() != @className()
      cursor

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