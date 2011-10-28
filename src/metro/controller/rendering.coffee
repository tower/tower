class Rendering
  constructor: -> super
  
  render: ->
    view = new Metro.Views.Base(@)
    body = view.render(arguments...)
    if @response
      @headers["Content-Type"] ?= @contentType
      @response.writeHead(200, @headers)
      @response.write(body)
      @response.end()
      @response = null
      @request  = null
    body
    
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
    
