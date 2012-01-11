Tower.Controller.Rendering =
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
    @_processOptions(options)
    @_renderTemplate(options)
    
  renderToString: ->
    options = @_normalizeRender(arguments...)
    @renderToBody(options)
    
  # private
  _renderTemplate: (options) ->
    @template.render(viewContext, options)

module.exports = Tower.Controller.Rendering
