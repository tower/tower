class Rendering
  render: ->
    throw("Double Render Error") if @response_body
    super
    @content_type ?= mime(@formats)
    response_body
    
  render_to_body: (options) ->
    @_process_options(options)
    @_render_template(options)
    
  render_to_string: ->
    options = @_normalize_render(arguments...)
    @render_to_body(options)
    
  # private
  _render_template: (options) ->
    @template.render(view_context, options)