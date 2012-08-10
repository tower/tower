Tower.ControllerScopes =
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
    #
    # This method is a mess
    scope: (name, scope) ->
      name ||= 'all'

      metadata = @metadata()

      unless scope
        if typeof name == 'string'
          chain = Tower.constant(metadata.resourceType)

          unless name == 'all'
            if Tower.isClient
              scope = Ember.computed(-> chain[name]().all().observable())
            else
              scope = chain[name]()
          else
            if Tower.isClient
              scope = Ember.computed(-> chain.all().observable())
            else
              scope = chain
        else
          scope = name # App.Post
          name  = 'all' # might try to make this 'content', so you can do `{{#each App.postsController}}`
      else
        if Tower.isClient && typeof scope == 'function'
          cursor = scope
          scope = Ember.computed(scope) # .observable()

      try
        # maybe we don't want to convert it to a cursor by this point...
        scope = scope.toCursor() if scope.toCursor

        metadata.scopes[name] = scope
        metadata.scopeNames.push(name) if Tower._.indexOf(metadata.scopeNames, name) == -1

        object = {}
        object[name] = scope

        @reopen(object)

        if Tower.isClient
          instance = @instance()
          instance.set(name, cursor()) unless instance.get(name)
      catch error
        console.log(error.stack || error)

  # need to break this up into client/server implementations
  resolveAgainstCursors: (action, records, matches, callback) ->
    cursors   = @constructor.metadata().scopes
    matches   ||= Ember.Map.create() unless Tower.isClient

    keys      = Tower._.keys(cursors)

    if Tower.isClient
      cursorMethod  = switch action
        when 'create', 'load' then 'mergeCreatedRecords'
        when 'update' then 'mergeUpdatedRecords'
        when 'destroy', 'unload' then 'mergeDeletedRecords'

    # still doesn't quite handle async in the controller
    iterator  = (name, next) =>      
      if Tower.isClient
        cursor = @get(name)
        cursor[cursorMethod](records)
        next()
      else
        cursor = @getCursor(cursors[name])
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

Tower.ControllerScopes.ClassMethods.collection = Tower.ControllerScopes.ClassMethods.scope

module.exports = Tower.ControllerScopes
