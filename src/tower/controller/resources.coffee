Tower.Controller.Resources =
  ClassMethods:
    resource: (options) ->
      @_resourceName    = options.name if options.hasOwnProperty("name")
      @_resourceType    = options.type if options.hasOwnProperty("type")
      @_collectionName  = options.collectionName if options.hasOwnProperty("collectionName")
      @
      
    resourceType: ->
      @_resourceType ||= Tower.Support.String.singularize(@name.replace(/(Controller)$/, ""))
      
    resourceName: ->
      @_resourceName ||= Tower.Support.String.camelize(@resourceType(), true)
      
    collectionName: ->
      @_collectionName ||= Tower.Support.String.camelize(@name.replace(/(Controller)$/, ""), true)
    
    belongsTo: (key, options = {}) ->
      options.key = key
      options.type ||= Tower.Support.String.camelize(options.key)
      @_belongsTo = options
    
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
    @findResource (error, resource) =>
      @respondWith resource, callback

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
        responder = new Tower.Controller.Responder(formats)
        callback.call @, responder
        responder[format].call @
      else
        successResponder = new Tower.Controller.Responder(formats)
        failureResponder = new Tower.Controller.Responder(formats)

        callback.call @, successResponder, failureResponder

        if success
          successResponder[format].call @
        else
          failureResponder[format].call @, error

  buildResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      @[@resourceName]  = @resource = resource = scope.build(@params[@resourceName])
      callback.call @, null, resource if callback
      resource
    
  findResource: (callback) ->
    @scoped (error, scope) =>
      return callback.call @, error, null if error
      scope.find @params.id, (error, resource) =>
        @[@resourceName]  = @resource = resource
        callback.call @, error, resource
      
  findParent: (callback) ->
    association = @constructor._belongsTo
    if association
      param       = association.param || "#{association.key}Id"
      parentClass = Tower.constant(association.type)
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
      callback.call @, null, Tower.constant(@resourceType)

module.exports = Tower.Controller.Resources
