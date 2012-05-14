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
      collectionName          = Tower.Support.String.camelize(className.replace(/(Controller)$/, ''), true)
      params                  = _.copyObject(superMetadata.params)
      renderers               = _.copyObject(superMetadata.renderers)
      mimes                   = if superMetadata.mimes then _.clone(superMetadata.mimes) else {json: {}, html: {}}
      helpers                 = _.copyArray(superMetadata.helpers)
      belongsTo               = _.copyArray(superMetadata.belongsTo)
      subscriptions           = _.copyArray(superMetadata.subscriptions)
      
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

      result

    _compileResourceName: (type) ->
      parts                   = type.split('.')
      resourceName            = Tower.Support.String.camelize(parts[parts.length - 1], true)
      
module.exports = Tower.Controller.Metadata
