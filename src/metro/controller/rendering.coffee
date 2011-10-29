class Rendering
  constructor: -> super
  
  render: ->
    args = Array.prototype.slice.call(arguments, 0, arguments.length)
    
    if args.length >= 2 && typeof(args[args.length - 1]) == "function"
      callback = args.pop()
    
    view    = new Metro.View(@)
    @headers["Content-Type"] ?= @contentType
    
    self = @
    
    args.push finish = (error, body) ->
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

module.exports = Rendering
    
