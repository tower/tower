# @mixin
Tower.Controller.Instrumentation =
  ClassMethods:
    baseClass: ->
      if @__super__ && @__super__.constructor.baseClass && @__super__.constructor != Tower.Controller
        @__super__.constructor.baseClass()
      else
        @

    metadata: ->
      className               = @name
      metadata                = @metadata[className]
      return metadata if metadata
      baseClassName           = @baseClass().name

      if baseClassName != className
        superMetadata = @baseClass().metadata()
      else
        superMetadata = {}

      resourceType            = _.singularize(@name.replace(/(Controller)$/, ""))
      resourceName            = @_compileResourceName(resourceType)
      collectionName          = Tower.Support.String.camelize(@name.replace(/(Controller)$/, ""), true)
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
      parts                   = type.split(".")
      resourceName            = Tower.Support.String.camelize(parts[parts.length - 1], true)

  InstanceMethods:
    # Called when the route for this controller is found.
    call: (request, response, next) ->
      @request  = request
      @response = response
      @params   = @request.params   || {}
      @cookies  = @request.cookies  || {}
      @query    = @request.query    || {}
      @session  = @request.session  || {}
      
      unless @params.format
        try @params.format = require('mime').extension(@request.header("content-type"))
        @params.format ||= "html"
        
      @format   = @params.format
      @action   = @params.action
      @headers  = {}
      @callback = next
      @process()

    process: ->
      @processQuery()

      # hacking in logging for now
      unless Tower.env.match(/(test|production)/)
        console.log "  Processing by #{@constructor.name}##{@action} as #{@format.toUpperCase()}"
        console.log "  Parameters:"
        console.log @params

      @runCallbacks "action", name: @action, (callback) =>
        @[@action].call @, callback

    processQuery: ->

    clear: ->
      @request  = null
      @response = null
      #@headers  = null

    metadata: ->
      @constructor.metadata()

module.exports = Tower.Controller.Instrumentation
