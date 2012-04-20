# @mixin
Tower.Controller.Resourceful =
  ClassMethods:
    # Set information about resource/model for this controller.
    #
    # @example Pass in a string
    #   class App.UsersController extends App.ApplicationController
    #     @resource "person"
    #
    # @example Pass in an object
    #   class App.UsersController extends App.ApplicationController
    #     @resource name: "person", type: "User", collectionName: "people"
    #
    # @return [Function] Return this controller.
    resource: (options) ->
      metadata = @metadata()

      if typeof options == "string"
        options                 =
          name: options
          type: Tower.Support.String.camelize(options)
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
    #     @belongsTo "post" # /posts/1/comments
    #
    # @example With options
    #   class App.CommentsController extends App.ApplicationController
    #     @belongsTo "article", type: "Post"
    #
    # @return [Array<Object>] Returns belongsTo array
    belongsTo: (key, options) ->
      belongsTo = @metadata().belongsTo

      return belongsTo unless key

      options ||= {}

      options.key = key
      options.type ||= Tower.Support.String.camelize(options.key)

      belongsTo.push(options)

    hasParent: ->
      belongsTo = @belongsTo()
      belongsTo.length > 0

    actions: ->
      args = _.args(arguments)

      if typeof args[args.length - 1] == "object"
        options = args.pop()
      else
        options = {}

      actions         = ["index", "new", "create", "show", "edit", "update", "destroy"]
      actionsToRemove = _.difference(actions, args, options.except || [])

      for action in actionsToRemove
        @[action] = null
        delete @[action]

      @

  # Default implementation for the "index" action.
  index: ->
    @_index (format) =>
      format.html => @render "index"
      format.json => @render json: @collection, status: 200

  # Default implementation for the "new" action.
  new: ->
    @_new (format) =>
      format.html => @render "new"
      format.json => @render json: @resource, status: 200

  # Default implementation for the "create" action.
  create: (callback) ->
    @_create (format) =>
      format.html => @redirectTo action: "show"
      format.json => @render json: @resource, status: 200

  # Default implementation for the "show" action.
  show: ->
    @_show (format) =>
      format.html => @render "show"
      format.json => @render json: @resource, status: 200

  # Default implementation for the "edit" action.
  edit: ->
    @_edit (format) =>
      format.html => @render "edit"
      format.json => @render json: @resource, status: 200

  # Default implementation for the "update" action.
  update: ->
    @_update (format) =>
      format.html => @redirectTo action: "show"
      format.json => @render json: @resource, status: 200

  # Default implementation for the "destroy" action.
  destroy: ->
    @_destroy (format) =>
      format.html => @redirectTo action: "index"
      format.json => @render json: @resource, status: 200

  # Helper method to give you the {Tower.Model.Scope} and a new record.
  #
  # @param [Function] callback
  #
  # @return [void] Requires a callback
  respondWithScoped: (callback) ->
    @scoped (error, scope) =>
      return @failure(error, callback) if error
      @respondWith scope.build(), callback

  respondWithStatus: (success, callback) ->
    options = records: (@resource || @collection)

    if callback && callback.length > 1
      successResponder = new Tower.Controller.Responder(@, options)
      failureResponder = new Tower.Controller.Responder(@, options)

      callback.call @, successResponder, failureResponder

      if success
        successResponder[format].call @
      else
        failureResponder[format].call @, error
    else
      Tower.Controller.Responder.respond(@, options, callback)

  # Returns a new record for the scope.
  #
  # @param [Function] callback
  #
  # @return [void] Requires a callback.
  buildResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      @[@resourceName] = @resource = resource = scope.build(@params[@resourceName])
      callback.call @, null, resource if callback
      resource

  createResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error

      resource = null
      
      scope.create @params[@resourceName], (error, record) =>
        @[@resourceName] = @resource = resource = record
        callback.call @, null, resource if callback

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
        @[@resourceName]  = @resource = resource
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
        @[@collectionName]  = @collection = collection
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
          @parent = @[relation.key] = parent
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
      callback.call @, error, scope.where(@criteria())

    if @hasParent
      @findParent (error, parent) =>
        if error || !parent
          callbackWithScope error, Tower.constant(@resourceType)
        else
          callbackWithScope(error, parent[@collectionName]())
    else
      callbackWithScope null, Tower.constant(@resourceType)

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

  # @private
  _index: (callback) ->
    @findCollection (error, collection) =>
      @respondWith collection, callback

  # @private
  _new: (callback) ->
    @buildResource (error, resource) =>
      return @failure(error) unless resource
      @respondWith(resource, callback)

  # @private
  _create: (callback) ->
    @createResource (error, resource) =>
      return @failure(error, callback) unless resource
      @respondWithStatus _.isBlank(resource.errors), callback

  # @private
  _show: (callback) ->
    @findResource (error, resource) =>
      @respondWith resource, callback

  # @private
  _edit: (callback) ->
    @findResource (error, resource) =>
      @respondWith resource, callback

  # @private
  _update: (callback) ->
    @findResource (error, resource) =>
      return @failure(error, callback) if error
      resource.updateAttributes @params[@resourceName], (error) =>
        @respondWithStatus !!!error && _.isBlank(resource.errors), callback

  # @private
  _destroy: (callback) ->
    @findResource (error, resource) =>
      return @failure(error, callback) if error
      resource.destroy (error) =>
        @respondWithStatus !!!error, callback

module.exports = Tower.Controller.Resourceful
