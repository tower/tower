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
      name ||= 'all'

      metadata = @metadata()

      unless scope
        if typeof name == 'string'
          scope = Tower.constant(metadata.resourceType)

          unless name == 'all'
            scope = scope[name]()
        else
          scope = name # App.Post
          name  = 'all' # might try to make this 'content', so you can do `{{#each App.postsController}}`

      try
        # maybe we don't want to convert it to a cursor by this point...
        scope = scope.toCursor() if scope.toCursor

        metadata.scopes[name] = scope
        metadata.scopeNames.push(name) if _.indexOf(metadata.scopeNames, name) == -1

        object = {}
        object[name] = scope

        @reopen(object)
      catch error
        console.log(error.stack || error)

  # need to break this up into client/server implementations
  resolveAgainstCursors: (action, records, matches, callback) ->
    cursors   = @constructor.metadata().scopes
    matches   ||= Ember.Map.create() unless Tower.isClient

    keys      = _.keys(cursors)

    if Tower.isClient
      cursorMethod  = switch action
        when 'create', 'load' then 'mergeCreatedRecords'
        when 'update' then 'mergeUpdatedRecords'
        when 'delete' then 'mergeDeletedRecords'

    # still doesn't quite handle async in the controller
    iterator  = (name, next) =>
      cursor = @getCursor(cursors[name])

      if Tower.isClient
        cursor[cursorMethod](records)
        next()
      else
        cursor.testEach records, (success, record) =>
          matches.set(record.get('id'), record) if success

        next()

    Tower.parallel(keys, iterator, callback)

    matches

  getCursor: (object, callback) ->
    object = switch typeof object
      when 'object'
        object
      when 'string'
        @constructor.metadata().scopes[object]

    if typeof object == 'function'
      switch object.length
        when 1
          object.call @, (error, result) =>
            object = result
            callback.call(@, object) if callback
        else
          object = object.call(@)

    object = object.toCursor() if object && object.toCursor
    
    object

Tower.Controller.Scopes.ClassMethods.collection = Tower.Controller.Scopes.ClassMethods.scope

module.exports = Tower.Controller.Scopes
