Tower.Controller.Scopes =
  ClassMethods:
    # @example
    #   class App.PostsController extends Tower.Controller
    #     @scope 'recent', App.Post.recent() # if no arguments are passed it will try that automatically
    #     @scope 'admin', -> App.Post.by(@get('currentUser'))
    #     @scope App.Post
    scope: (name, scope) ->
      unless scope
        if typeof name == 'string'
          scope = @resourceType[name]()
        else
          scope = name # App.Post
          name  = 'all' # might try to make this 'content', so you can do `{{#each App.postsController}}`

      scope = scope.toCursor() if scope.toCursor

      @metadata().scopes[name] = scope

      object = {}
      object[name] = scope

      @reopen(object)

    matchAgainstCursors: (records, matches, callback) ->
      cursors = @metadata().scopes

      for name, cursor of cursors
        if Tower.isClient
          cursor.pushMatching(records)
        else
          matches = cursor.test(records)

      callback()

      matches

  matchAgainstCursors: (records, matches, callback) ->
    @constructor.matchAgainstCursors(records, matches, callback)

Tower.Controller.Scopes.ClassMethods.collection = Tower.Controller.Scopes.ClassMethods.scope

module.exports = Tower.Controller.Scopes
