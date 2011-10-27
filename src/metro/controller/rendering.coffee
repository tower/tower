class Rendering
  constructor: -> super
  
  render: ->
    view = new Metro.Views.Base(@)
    body = view.render(arguments...)
    if @response
      @headers["Content-Type"] ?= @content_type
      @response.writeHead(200, @headers)
      @response.write(body)
      @response.end()
      @response = null
      @request  = null
    body
    
  render_to_body: (options) ->
    @_process_options(options)
    @_render_template(options)
    
  render_to_string: ->
    options = @_normalize_render(arguments...)
    @render_to_body(options)
    
  # private
  _render_template: (options) ->
    @template.render(view_context, options)

module.exports = Rendering
    