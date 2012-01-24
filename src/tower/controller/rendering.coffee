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
  
  _renderTemplate: (options) ->
    callback = (error, body) =>
      if error
        @status ||= 404
        @body   = error.stack
      else
        @status ||= 200
        @body     = body
      @callback() if @callback
      
    return if @_handleRenderers(options, callback)
    
    @headers["Content-Type"] ||= "text/html"
    
    view    = new Tower.View(@)
    
    try
      view.render.call view, options, callback
    catch error
      callback error
    
  _handleRenderers: (options, callback) ->
    for name, renderer of Tower.Controller.renderers()
      if options.hasOwnProperty(name)
        renderer.call @, options[name], options, callback
        return true
    false
    
  _processRenderOptions: (options = {}) ->
    @status                   = options.status if options.status
    @headers["Content-Type"]  = options.contentType if options.contentType
    @headers["Location"]      = @urlFor(options.location) if options.location
    @
    
  _normalizeRender: ->
    @_normalizeOptions @_normalizeArgs(arguments...)
  
  _normalizeArgs: (action, options = {}) ->
    switch typeof(action)
      when "undefined", "object"
        options   = action || {}
      when "string"
        key = if !!action.match(/\//) then "file" else "action"
        options[key] = action
      else
        options.partial = action
    
    options
  
  _normalizeOptions: (options = {}) ->
    options.partial     = @action if options.partial == true
    options.prefixes  ||= [] 
    options.prefixes.push @collectionName
    options.template ||= (options.file || (options.action || @action))
    options

module.exports = Tower.Controller.Rendering
