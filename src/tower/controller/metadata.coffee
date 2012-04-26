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
      params                  = if superMetadata.params then _.clone(superMetadata.params) else {}
      renderers               = if superMetadata.renderers then _.clone(superMetadata.renderers) else {}
      mimes                   = if superMetadata.mimes then _.clone(superMetadata.mimes) else {json: {}, html: {}}
      helpers                 = if superMetadata.helpers then superMetadata.helpers.concat() else []
      belongsTo               = if superMetadata.belongsTo then superMetadata.belongsTo.concat() else []
      
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

      result

    _compileResourceName: (type) ->
      parts                   = type.split('.')
      resourceName            = Tower.Support.String.camelize(parts[parts.length - 1], true)
      
module.exports = Tower.Controller.Metadata
