Tower.Controller.Rendering =
  ClassMethods:
    addRenderer: (key, block) ->
      @renderers()[key] = block
      
    addRenderers: (renderers = {}) ->
      @addRenderer(key, block) for key, block of renderers
      @
      
    renderers: ->
      @_renderers ||= {}
      
  render: ->
    @renderToBody @_normalizeRender(arguments...)
    
  renderToBody: (options) ->
    @_processRenderOptions(options)
    @_renderTemplate(options)
    
  renderToString: ->
    @renderToBody @_normalizeRender(arguments...)
    
  sendFile: (path, options = {}) ->
  
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
      _callback.apply @, arguments if _callback
      @callback() if @callback
      
    return if @_handleRenderers(options, callback)
    
    @headers["Content-Type"] ||= "text/html"
    
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
    @headers["Content-Type"]  = options.contentType if options.contentType
    @headers["Location"]      = @urlFor(options.location) if options.location
    @
  
  # @private
  _normalizeRender: ->
    @_normalizeOptions @_normalizeArgs(arguments...)
  
  # @private
  _normalizeArgs: ->
    args = Tower.Support.Array.args(arguments)
    if typeof args[0] == "string"
      action    = args.shift()
    if typeof args[0] == "object"
      options   = args.shift()
    if typeof args[0] == "function"
      callback  = args.shift()
    
    options         ||= {}
    
    if action
      key             = if !!action.match(/\//) then "file" else "action"
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

module.exports = Tower.Controller.Rendering
