fs = require("fs")
_ = require("underscore")

class Base
  constructor: (controller) ->
    @controller = controller || (new Metro.Controllers.Base)
    
  render: (options) ->  
    if arguments.length == 1
      if typeof(arguments[0]) == "string"
        options = template: arguments[0]
      else
        options = arguments[0]
    else
      options = arguments[1]
      options.template = arguments[0]
    
    options  ?= {}  
    locals    = @context(options)
    type      = options.type || Metro.Views.engine
    engine    = Metro.Views.engines()[type]
    engine    = new engine
    if options.text
      body    = options.text
    else if options.json
      body    = if typeof(options.json) == "string" then options.json else JSON.stringify(options.json)
    else
      template  = Metro.Views.lookup(options.template)
      body      = engine.compile(template, locals)
      
    if options.hasOwnProperty("layout") && options.layout == false
      layout = false
    else
      layout  = options.layout || @controller.layout()
      
    if layout
      layout  = Metro.Views.lookup("layouts/#{layout}")
      locals.yield = body
      body    = engine.compile(layout, locals)
    body
  
  context: (options) ->
    controller = @controller
    locals = {}
    for key of controller
      locals[key] = controller[key] unless key == "constructor"
    locals  = _.extend(locals, @locals || {}, options.locals)
    
    locals.pretty = true if Metro.Views.pretty_print
    
    locals
  
module.exports = Base
