# @mixin
Tower.ControllerRendering =
  ClassMethods:
    # Add a render for a specific mime type.
    #
    # @example Add a json renderer
    #   Tower.Controller.addRenderer 'json', (json, options, callback) ->
    #     unless typeof(json) == 'string'
    #       if @params.prettify && @params.prettify.toString() == 'true'
    #         json = JSON.stringify(json, null, 2)
    #       else
    #         json = JSON.stringify(json)
    #     json = '#{options.callback}(#{json})' if options.callback
    #     @headers['Content-Type'] ||= require('mime').lookup('json')
    #     callback null, json if callback
    #     json
    #
    # @param [String] key key to be used in the controller's {#render} method.
    # @param [Function] block function to conver the data to appropriate format.
    #
    # @return [Function] Returns the block added.
    addRenderer: (key, block) ->
      @renderers()[key] = block

    # Add multiple renders at once.
    #
    # @see {#addRenderer}
    #
    # @example Add a json renderer
    #   Tower.Controller.addRenderer
    #     json: (json, options, callback) ->
    #       unless typeof(json) == 'string'
    #         if @params.prettify && @params.prettify.toString() == 'true'
    #           json = JSON.stringify(json, null, 2)
    #         else
    #           json = JSON.stringify(json)
    #       json = '#{options.callback}(#{json})' if options.callback
    #       @headers['Content-Type'] ||= require('mime').lookup('json')
    #       callback null, json if callback
    #       json
    #
    # @param [Object] renderers hash of `{format: function}` pairs.
    #
    # @return [Function] Returns the controller instance.
    addRenderers: (renderers = {}) ->
      @addRenderer(key, block) for key, block of renderers
      @

    # Set of renderers defined for this controller.
    #
    # @return [Object]
    renderers: ->
      @metadata().renderers

  InstanceMethods:
    # Render a view (a content-type) for the current controller action.
    #
    # @example Render HTML for the index action on the users controller.
    #   # full path
    #   @render 'users/index'
    #   # action
    #   @render 'index'
    #   # with variables for the template
    #   @render 'index', locals: {hello: 'world'}
    #
    # @example Render JSON
    #   @render json: user.toJSON()
    #
    # @example Custom status
    #   @render json: user.toJSON(), status: 404
    #
    # @return [void] Requires a callback.
    render: ->
      @renderToBody @_normalizeRender(arguments...)

    renderToBody: (options) ->
      @_processRenderOptions(options)
      @_renderTemplate(options)

    renderToString: ->
      @renderToBody @_normalizeRender(arguments...)

    # @todo implement
    sendFile: (path, options = {}) ->

    # @todo implement
    sendData: (data, options = {}) ->

    # @private
    _renderTemplate: (options) ->
      _callback = options.callback
      callback = (error, body) =>
        if error
          @status ||= 404
          @body   = error.stack
        else
          @status ||= 200
          @body     = body
        console.log @body if error
        _callback.apply @, arguments if _callback
        @callback() if @callback

      return if @_handleRenderers(options, callback)

      @headers['Content-Type'] ||= 'text/html'

      view    = new Tower.View(@)

      try
        view.render.call view, options, callback
      catch error
        callback error

    # @private
    _handleRenderers: (options, callback) ->
      for name, renderer of Tower.Controller.renderers()
        if options.hasOwnProperty(name)
          renderer.call @, options[name], options, callback
          return true
      false

    # @private
    _processRenderOptions: (options = {}) ->
      @status                   = options.status if options.status
      @headers['Content-Type']  = options.contentType if options.contentType
      @headers['Location']      = @urlFor(options.location) if options.location
      @

    # @private
    _normalizeRender: ->
      @_normalizeOptions @_normalizeArgs(arguments...)

    # @private
    _normalizeArgs: ->
      args = _.args(arguments)

      if typeof args[0] == 'string'
        action    = args.shift()
      if typeof args[0] == 'object'
        options   = args.shift()
      if typeof args[0] == 'function'
        callback  = args.shift()

      options         ||= {}

      if action
        key             = if !!action.match(/\//) then 'file' else 'action'
        options[key]    = action

      options.callback  = callback if callback

      options

    # @private
    _normalizeOptions: (options = {}) ->
      options.partial     = @action if options.partial == true
      options.prefixes  ||= []
      options.prefixes.push @collectionName
      options.template ||= (options.file || (options.action || @action))
      options

module.exports = Tower.ControllerRendering
