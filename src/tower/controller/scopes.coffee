Tower.Controller.Scopes =
  ClassMethods:
    # @example
    #   class App.PostsController extends Tower.Controller
    #     @scope 'recent', App.Post.recent() # if no arguments are passed it will try that automatically
    #     @scope 'admin', -> App.Post.by(@get('currentUser'))
    scope: (name, scope) ->
      scope ||= @resourceType[name]()

      @metadata().scopes[name] = scope

      object = {}
      object[name] = scope

      @reopen(object)

    matchAgainstCursors: (records, matches) ->
      cursors = @metadata().scopes

      for name, cursor of cursors
        if Tower.isClient
          cursor.pushMatching(records)
        else
          matches = cursor.test(records)

      matches

Tower.Controller.Scopes.ClassMethods.collection = Tower.Controller.Scopes.ClassMethods.scope

module.exports = Tower.Controller.Scopes
