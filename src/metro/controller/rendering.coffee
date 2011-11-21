Metro.Controller.Rendering =
  render: ->
    args = Metro.Support.Array.args(arguments)
    
    if args.length >= 2 && typeof(args[args.length - 1]) == "function"
      callback = args.pop()
    
    view    = new Metro.View(@)
    @headers["Content-Type"] ||= @contentType
    
    self = @
    
    args.push finish = (error, body) ->
      if error
        self.body = error.stack
      else
        self.body = body
      callback(error, body) if callback
      self.callback()
    
    view.render.apply(view, args)
    
  renderToBody: (options) ->
    @_processOptions(options)
    @_renderTemplate(options)
    
  renderToString: ->
    options = @_normalizeRender(arguments...)
    @renderToBody(options)
    
  # private
  _renderTemplate: (options) ->
    @template.render(viewContext, options)

module.exports = Metro.Controller.Rendering
