Tower.Controller.Resourceful =
  ClassMethods:
    resource: (options) ->
      @_resourceName    = options.name if options.hasOwnProperty("name")
      @_resourceType    = options.type if options.hasOwnProperty("type")
      @_collectionName  = options.collectionName if options.hasOwnProperty("collectionName")
      @

    resourceType: ->
      @_resourceType ||= Tower.Support.String.singularize(@name.replace(/(Controller)$/, ""))

    resourceName: ->
      return @_resourceName if @_resourceName
      parts = @resourceType().split(".")
      @_resourceName = Tower.Support.String.camelize(parts[parts.length - 1], true)

    collectionName: ->
      @_collectionName ||= Tower.Support.String.camelize(@name.replace(/(Controller)$/, ""), true)

    belongsTo: (key, options = {}) ->
      if @_belongsTo
        @_belongsTo = @_belongsTo.concat()
      else
        @_belongsTo = []
        
      return @_belongsTo unless key
        
      options.key = key
      options.type ||= Tower.Support.String.camelize(options.key)
      @_belongsTo.push(options)
      
    hasParent: ->
      belongsTo = @belongsTo()
      belongsTo.length > 0

    actions: ->
      args = Tower.Support.Array.args(arguments)

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

  index: ->
    #@_index arguments...
    @_index (format) =>
      format.html => @render "index"
      format.json => @render json: @collection, status: 200

  new: ->
    @_new (format) =>
      format.html => @render "new"
      format.json => @render json: @resource, status: 200

  create: (callback) ->
    @_create (format) =>
      format.html => @redirectTo action: "show"
      format.json => @render json: @resource, status: 200

  show: ->
    @_show (format) =>
      format.html => @render "show"
      format.json => @render json: @resource, status: 200

  edit: ->
    @_edit (format) =>
      format.html => @render "edit"
      format.json => @render json: @resource, status: 200

  update: ->
    @_update (format) =>
      format.html => @redirectTo action: "show"
      format.json => @render json: @resource, status: 200

  destroy: ->
    @_destroy (format) =>
      format.html => @redirectTo action: "index"
      format.json => @render json: @resource, status: 200

  _index: (callback) ->
    @findCollection (error, collection) =>
      @respondWith collection, callback

  _new: (callback) ->
    @buildResource (error, resource) =>
      return @failure(error) unless resource
      @respondWith(resource, callback)

  _create: (callback) ->
    @buildResource (error, resource) =>
      return @failure(error, callback) unless resource
      resource.save (error) =>
        @respondWithStatus Tower.Support.Object.isBlank(resource.errors), callback

  _show: (callback) ->
    @findResource (error, resource) =>
      @respondWith resource, callback

  _edit: (callback) ->
    @findResource (error, resource) =>
      @respondWith resource, callback

  _update: (callback) ->
    @findResource (error, resource) =>
      return @failure(error, callback) if error
      resource.updateAttributes @params[@resourceName], (error) =>
        @respondWithStatus !!!error && Tower.Support.Object.isBlank(resource.errors), callback

  _destroy: (callback) ->
    @findResource (error, resource) =>
      return @failure(error, callback) if error
      resource.destroy (error) =>
        @respondWithStatus !!!error, callback

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

  buildResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      @[@resourceName] = @resource = resource = scope.build(@params[@resourceName])
      callback.call @, null, resource if callback
      resource

  findResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      scope.find @params.id, (error, resource) =>
        @[@resourceName]  = @resource = resource
        callback.call @, error, resource

  findCollection: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      scope.all (error, collection) =>
        @[@collectionName]  = @collection = collection
        callback.call @, error, collection if callback
  
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
          relation = Tower.Support.Object.extend({}, relation)
          relation.param = param
          return relation
      return null
    else
      null

  scoped: (callback) ->
    callbackWithScope = (error, scope) =>
      callback.call @, error, scope.where(@criteria())

    if @hasParent
      @findParent (error, parent) =>
        if error || !parent
          callback.call @, error || true if callback
        else
          callbackWithScope(error, parent[@collectionName]())
    else
      callbackWithScope null, Tower.constant(@resourceType)

  failure: (resource, callback) ->
    callback()

module.exports = Tower.Controller.Resourceful
