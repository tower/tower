Tower.Controller.Rendering =
  ClassMethods:
    addRenderer: (key, block) ->
      @renderers()[key] = block
      
    addRenderers: (renderers = {}) ->
      @addRenderer for key, block of renderers
      @
      
    renderers: ->
      @_renderers ||= {}
      
  render: ->
    args = Tower.Support.Array.args(arguments)
    
    if args.length >= 2 && typeof(args[args.length - 1]) == "function"
      callback = args.pop()
    else
      callback = null
      
    if args.length > 1 && typeof(args[args.length - 1]) == "object"
      options = args.pop()
    
    if typeof args[0] == "object"
      options = args[0]
    else
      options ||= {}
      options.template = args[0]
      
    if options.template
      if typeof options.template == "string" && !!!options.template.match(/\//)
        options.template = "#{@collectionName}/#{options.template}"
    else if options.action
      options.template = "#{@collectionName}/#{options.action}"
      
    view    = new Tower.View(@)
    @headers["Content-Type"] ||= @contentType
    
    self    = @
    
    view.render.call view, options, (error, body) ->
      if error
        self.body = error.stack
      else
        self.body = body
      callback(error, body) if callback
      self.callback() if self.callback
    
  renderToBody: (options) ->
    @_processRenderOptions(options)
    @_renderTemplate(options)
    
  renderToString: ->
    @renderToBody @_normalizeRender(arguments...)
    
  sendFile: (path, options = {}) ->
  
  sendData: (data, options = {}) ->
  
  _renderTemplate: (options) ->
    @template.render(viewContext, options)
    
  _processRenderOptions: (options = {}) ->
    @status               = options.status if options.status
    @contentType          = options.contentType if options.contentType
    @headers["Location"]  = @urlFor(options.location) if options.location
    @
    
  _normalizeRender: ->
    @_normalizeOptions @_normalizeArgs(arguments...)
  
  _normalizeArgs: (action, options = {}) ->
    switch typeof(action)
      when "undefined", "object"
        options = action || {}
      when "string"
        key = if !!action.match(/\//) then "file" else "action"
        options[key] = action
      else
        options.partial = action
    
    options

  _normalizeOptions: (options = {}) ->
    options.partial = @action if options.partial == true
    options.template ||= (options.action || @action)
    options

module.exports = Tower.Controller.Rendering
