_ = Tower._

# @mixin
# @todo Most of this stuff is only really relevant for the server,
# so consider moving it to the server folder.  The only reason you'd want
# this on the client is to demo what the server can do from the client
# (think in-browser console or something).  In that case we need to figure
# out how to include specific files in the browser manually.
Tower.ControllerResourceful =
  ClassMethods:
    # Set information about resource/model for this controller.
    #
    # @example Pass in a string
    #   class App.UsersController extends App.ApplicationController
    #     @resource 'person'
    #
    # @example Pass in an object
    #   class App.UsersController extends App.ApplicationController
    #     @resource name: 'person', type: 'User', collectionName: 'people'
    #
    # @return [Function] Return this controller.
    resource: (options) ->
      metadata = @metadata()

      if typeof options == 'string'
        options                 =
          name: options
          type: _.camelize(options)
          collectionName: _.pluralize(options)

      metadata.resourceName     = options.name if options.name

      if options.type
        metadata.resourceType   = options.type
        metadata.resourceName   = @_compileResourceName(options.type) unless options.name

      metadata.collectionName   = options.collectionName if options.collectionName

      @

    # Specify the parent model for this resourceful controller,
    # corresponding to a nested path.
    #
    # @example
    #   class App.CommentsController extends App.ApplicationController
    #     @belongsTo 'post' # /posts/1/comments
    #
    # @example With options
    #   class App.CommentsController extends App.ApplicationController
    #     @belongsTo 'article', type: 'Post'
    #
    # @return [Array<Object>] Returns belongsTo array
    belongsTo: (key, options) ->
      belongsTo = @metadata().belongsTo

      return belongsTo unless key

      options ||= {}

      options.key = key
      options.type ||= _.camelize(options.key)

      # @todo needs better support for `hasMany through`
      @param "#{key}Id", exact: true, type: 'Id'

      belongsTo.push(options)

    hasParent: ->
      belongsTo = @belongsTo()
      belongsTo.length > 0

    actions: ->
      args    = _.flatten(_.args(arguments))
      options = _.extractOptions(args)

      actions         = ['index', 'new', 'create', 'show', 'edit', 'update', 'destroy']
      actionsToRemove = _.difference(actions, args, options.except || [])

      for action in actionsToRemove
        @[action] = null
        delete @[action]

      @

  # Helper method to give you the {Tower.ModelScope} and a new record.
  #
  # @param [Function] callback
  #
  # @return [void] Requires a callback
  respondWithScoped: (callback) ->
    @scoped (error, scope) =>
      return @failure(error, callback) if error
      @respondWith scope.build(), callback

  # @todo make this default
  respondWithStatus: (success, callback) ->
    options = records: (@resource || @collection)

    if callback && callback.length > 1
      successResponder = new Tower.ControllerResponder(@, options)
      failureResponder = new Tower.ControllerResponder(@, options)

      callback.call @, successResponder, failureResponder

      if success
        successResponder._respond()
      else
        failureResponder._respond()

      # format = @get('format')
      # 
      # if success
      #   successResponder[format].call @, callback
      # else
      #   failureResponder[format].call @, callback
    else
      Tower.ControllerResponder.respond(@, options, callback)

  # Returns a new record for the scope.
  #
  # @param [Function] callback
  #
  # @return [void] Requires a callback.
  buildResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      resource = scope.build(@params[@resourceName])
      @set 'resource', resource
      @set @resourceName, resource
      # @[@resourceName] = @resource = scope.build(@params[@resourceName])
      callback.call @, null, resource if callback
      resource

  createResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error

      resource = null

      scope.insert @params[@resourceName], (error, resource) =>
        @set 'resource', resource
        @set @resourceName, resource
        # @[@resourceName] = @resource = resource
        callback.call(@, null, resource) if callback

      resource

  # Returns the single record for the scope.
  #
  # @param [Function] callback
  #
  # @return [void] Requires a callback.
  findResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      scope.find @params.id, (error, resource) =>
        @set 'resource', resource
        @set @resourceName, resource
        #@[@resourceName]  = @resource = resource
        callback.call @, error, resource

  # Returns the set of records for the scope.
  #
  # @param [Function] callback
  #
  # @return [void] Requires a callback.
  findCollection: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      scope.all (error, collection) =>
        @set 'collection', collection
        @set @collectionName, collection
        #@[@collectionName]  = @collection = collection
        callback.call @, error, collection if callback

  # Finds the parent if `belongsTo` was defined for this controller.
  #
  # It does this by looking through the parameters for keys defined
  # by the relations in `belongsTo`.
  #
  # @param [Function] callback
  findParent: (callback) ->
    relation = @findParentRelation()
    if relation
      parentClass = Tower.constant(relation.type)
      parentClass.find @params[relation.param], (error, parent) =>
        throw error if error && !callback
        unless error
          @set 'parent', parent
          @set relation.key, parent
          #@parent = @[relation.key] = parent
        callback.call @, error, parent if callback
    else
      callback.call @, null, false if callback
      false

  findParentRelation: ->
    belongsTo = @constructor.belongsTo()
    params    = @params

    if belongsTo.length > 0
      for relation in belongsTo
        param         = relation.param || "#{relation.key}Id"
        if params.hasOwnProperty(param)
          relation = _.extend({}, relation)
          relation.param = param
          return relation
      return null
    else
      null

  # Builds the scope for the current action, based on the resource defined for this controller.
  #
  # @param [Function] callback
  #
  # @return [void] Requires a callback.
  scoped: (callback) ->
    callbackWithScope = (error, scope) =>
      callback.call @, error, scope.where(@cursor())

    if @hasParent
      @findParent (error, parent) =>
        if error || !parent
          callbackWithScope error, Tower.constantNew(@resourceType)
        else
          callbackWithScope(error, parent.get(@collectionName))
    else
      callbackWithScope null, Tower.constantNew(@resourceType)

    undefined

  resourceKlass: ->
    Tower.constant(Tower.namespaced(@resourceType))

  # @todo Default failure implemtation for create, update, and destory.
  #
  # @param [Tower.Model] resource
  # @param [Function] callback
  #
  # @return [void] Requires a callback.
  failure: (resource, callback) ->
    callback()

    undefined
