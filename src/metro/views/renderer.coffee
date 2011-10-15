fs = require("fs")

class Renderer
  constructor: (lookup_context) ->
    @lookup_context = lookup_context
    
  render: (view, options) ->
    template = Metro.Template.engines()[options.type]
    template = new template
    template.compile("#{view}.#{options.type}")
    
exports = module.exports = Renderer
