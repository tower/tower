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
    type      = options.type || Metro.Views.engine
    engine    = Metro.Compilers.find(type)
    if options.text
      body    = options.text
    else if options.json
      body    = if typeof(options.json) == "string" then options.json else JSON.stringify(options.json)
    else
      unless options.inline
        template = Metro.Views.lookup(options.template)
        template = Metro.Support.Path.read(template)
      
      body      = engine.compile(template, locals)
      
    if options.hasOwnProperty("layout") && options.layout == false
      layout = false
    else
      layout  = options.layout || @controller.layout()
      
    if layout
      layout  = Metro.Views.lookup("layouts/#{layout}")
      layout  = Metro.Support.Path.read(layout)
      locals.yield = body
      body    = engine.compile(layout, locals)
    body
  
  context: (options) ->
    controller = @controller
    locals = {}
    for key of controller
      locals[key] = controller[key] unless key == "constructor"
    locals  = require("underscore").extend(locals, @locals || {}, options.locals)
    
    locals.pretty = true if Metro.Views.pretty_print
    
    locals
  
module.exports = Rendering
