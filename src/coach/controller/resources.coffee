Coach.Controller.Resources =
  ClassMethods:
    # resource name: "user", collectionName: "users", type: "User"
    resource: (options) ->
      @_resourceName    = options.name if options.hasOwnProperty("name")
      @_resourceType    = options.type if options.hasOwnProperty("type")
      @_collectionName  = options.collectionName if options.hasOwnProperty("collectionName")
      @
      
    resourceType: ->
      @_resourceType ||= Coach.Support.String.singularize(@name.replace(/(Controller)$/, ""))
      
    resourceName: ->
      @_resourceName ||= Coach.Support.String.camelize(@resourceType(), true)
      
    collectionName: ->
      @_collectionName ||= Coach.Support.String.pluralize(@resourceName())
    
    # belongsTo "project", finder: "findByTitle", param: "projectTitle", type: "Project"
    belongsTo: (key, options = {}) ->
      options.key = key
      options.type ||= Coach.Support.String.camelize(options.key)
      @_belongsTo = options
      
    # Defines wich actions to keep from the inherited controller.    
    actions: ->
      args = Coach.Support.Array.args(arguments)

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
    @_index arguments...

  new: ->
    @_new arguments...

  create: ->
    @_create arguments...

  show: ->
    @_show arguments...

  edit: ->
    @_edit arguments...

  update: ->
    @_update arguments...

  destroy: ->
    @_destroy arguments...

  # @on "update", format: "html", success: true, ->

  #update:
  #  success: ->
  #    @
  #  failure:

  _index: (callback) ->
    @respondWithScoped callback

  _new: (callback) ->
    @respondWithScoped callback

  _create: (callback) ->
    @buildResource (error, resource) =>
      return @failure(error) unless resource
      resource.save (error, success) =>
        @respondWithStatus success, callback

  _show: (callback) ->
    @respondWithScoped callback

  _update: (callback) ->
    @findResource (error, resource) =>
      return @failure(error) unless resource
      resource.updateAttribute @params[@resourceName], (error, success) =>
        @respondWithStatus success, callback

  _destroy: (callback) ->
    @findResource (error, resource) =>
      return @failure(error) unless resource
      resource.destroy (error, success) =>
        @respondWithStatus success, callback

  respondWithScoped: (callback) ->
    @scoped (error, resource) => 
      return @failure(error) if error
      @respondWith(resource, callback)

  respondWithStatus: (success, callback) ->
    format            = @params.format || "html"
    formats           = @constructor.respondTo().concat()

    switch callback.length
      when 0, 1
        responder = new Coach.Controller.Responder(formats)
        callback.call @, responder
        responder[format].call @
      else
        successResponder = new Coach.Controller.Responder(formats)
        failureResponder = new Coach.Controller.Responder(formats)

        callback.call @, successResponder, failureResponder

        if success
          successResponder[format].call @
        else
          failureResponder[format].call @, error

  buildResource: (callback) ->
    @scoped (scope) =>
      @[@resourceName]  = @resource = resource = scope.build(@params[@resourceName])
      callback.call @, null, resource if callback
      resource
    
  findResource: (callback) ->
    @scoped (scope) =>
      scope.find @params.id, (error, resource) =>
        @[@resourceName]  = @resource = resource
        callback.call @, error, resource
      
  findParent: (callback) ->
    association = @constructor._belongsTo
    if association
      param       = association.param || "#{association.key}Id"
      parentClass = Coach.constant(association.type)
      parentClass.find @params[param], (error, parent) =>
        @parent = @[association.key] = parent
    else
      callback.call @, null, false if callback
      false

  scoped: (callback) ->
    if @_scope
      callback.call @, @_scope if callback
      return @_scope
  
    if @hasParent
      @findParent (error, parent) =>
        callback.call @, error, @parent[@collectionName]
    else
      callback.call @, null, Coach.constant(@resourceType)

module.exports = Coach.Controller.Resources
