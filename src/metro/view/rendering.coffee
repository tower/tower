class Rendering    
  render: (options) ->  
    if arguments.length == 1
      if typeof(arguments[0]) == "string"
        options = template: arguments[0]
      else
        options = arguments[0]
    else
      template = arguments[0]
      options = arguments[1]
      options.template = template
    
    options  ?= {}
    locals    = @context(options)
    type      = options.type || Metro.View.engine
    engine    = Metro.engine(type)
    if options.text
      body    = options.text
    else if options.json
      body    = if typeof(options.json) == "string" then options.json else JSON.stringify(options.json)
    else
      unless options.inline
        template = Metro.View.lookup(options.template)
        template = Metro.Support.Path.read(template)
      
      body      = engine.render(template, locals)
      
    if options.hasOwnProperty("layout") && options.layout == false
      layout = false
    else
      layout  = options.layout || @controller.layout()
      
    if layout
      layout  = Metro.View.lookup("layouts/#{layout}")
      layout  = Metro.Support.Path.read(layout)
      locals.yield = body
      body    = engine.render(layout, locals)
    body
  
  context: (options) ->
    controller = @controller
    locals = {}
    for key of controller
      locals[key] = controller[key] unless key == "constructor"
    locals  = require("underscore").extend(locals, @locals || {}, options.locals)
    
    locals.pretty = true if Metro.View.prettyPrint
    
    locals
  
module.exports = Rendering
