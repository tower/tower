Tower.Controller.Metadata =
  ClassMethods:
    baseClass: ->
      if @__super__ && @__super__.constructor.baseClass && @__super__.constructor != Tower.Controller
        @__super__.constructor.baseClass()
      else
        @

    metadata: ->
      className               = @className()
      metadata                = @metadata[className]
      return metadata if metadata
      baseClassName           = @baseClass().className()

      if baseClassName != className
        superMetadata = @baseClass().metadata()
      else
        superMetadata = {}

      resourceType            = _.singularize(className.replace(/(Controller)$/, ''))
      resourceName            = @_compileResourceName(resourceType)
      collectionName          = _.camelize(className.replace(/(Controller)$/, ''), true)
      params                  = _.copyObject(superMetadata.params)
      renderers               = _.copyObject(superMetadata.renderers)
      scopes                  = _.copyObject(superMetadata.scopes)
      scopeNames              = _.copyArray(superMetadata.scopeNames)
      mimes                   = if superMetadata.mimes then _.clone(superMetadata.mimes) else {json: {}, html: {}}
      helpers                 = _.copyArray(superMetadata.helpers)
      belongsTo               = _.copyArray(superMetadata.belongsTo)
      subscriptions           = _.copyArray(superMetadata.subscriptions)
      layout                  = superMetadata.layout
      
      callbacks               = {}

      if superMetadata.callbacks
        for action, callbackChain of superMetadata.callbacks
          callbacks[action] = callbackChain.clone()

      result = @metadata[className]    =
        className:            className
        resourceName:         resourceName
        resourceType:         resourceType
        collectionName:       collectionName
        params:               params
        renderers:            renderers
        mimes:                mimes
        callbacks:            callbacks
        helpers:              helpers
        belongsTo:            belongsTo
        subscriptions:        subscriptions
        layout:               layout
        scopes:               scopes
        scopeNames:           scopeNames

      result

    _compileResourceName: (type) ->
      parts                   = type.split('.')
      resourceName            = _.camelize(parts[parts.length - 1], true)

module.exports = Tower.Controller.Metadata
