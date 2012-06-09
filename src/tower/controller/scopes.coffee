Tower.Controller.Scopes =
  ClassMethods:
    # @example
    #   class App.PostsController extends Tower.Controller
    #     @scope 'recent', App.Post.recent() # if no arguments are passed it will try that automatically
    #     @scope 'admin', -> App.Post.by(@get('currentUser'))
    #     @scope 'admin', (callback) ->
    #       @setCurrentUser =>
    #         callback(null, App.Post.by(@get('currentUser')))
    #     @scope App.Post
    # 
    #     # todo (wrap any method with callbacks):
    #     @beforeScope 'setCurrentUser'
    # 
    # @example You can also use the `collection` method instead of `scope`
    #   class App.PostsController extends Tower.Controller
    #     @collection 'recent', App.Post.recent()
    scope: (name, scope) ->
      unless scope
        if typeof name == 'string'
          scope = @resourceType[name]()
        else
          scope = name # App.Post
          name  = 'all' # might try to make this 'content', so you can do `{{#each App.postsController}}`

      try
        scope = scope.toCursor() if scope.toCursor

        @metadata().scopes[name] = scope

        object = {}
        object[name] = scope

        @reopen(object)
      catch error
        console.log(error)

  resolveAgainstCursors: (action, records, matches, callback) ->
    cursors   = @constructor.metadata().scopes

    keys      = _.keys(cursors)

    cursorMethod  = switch action
      when 'create' then 'mergeCreatedRecords'
      when 'update' then 'mergeUpdatedRecords'
      when 'delete' then 'mergeDeletedRecords'

    # still doesn't quite handle async in the controller
    iterator  = (name, next) =>
      cursor = cursors[name]

      cursor = cursor.call(@) if typeof cursor == 'function'

      if Tower.isClient
        cursor[cursorMethod](records)
        next()
      else
        matches = cursor.test(records)
        next()

    Tower.parallel(keys, iterator, callback)

    matches

Tower.Controller.Scopes.ClassMethods.collection = Tower.Controller.Scopes.ClassMethods.scope

module.exports = Tower.Controller.Scopes
