fs = require("fs")
_ = require("underscore")

class Base
  constructor: (controller) ->
    @controller = controller || (new Metro.Controllers.Base)
    
  render: (path, options) ->
    options  ?= {}
    type      = options.type || Metro.Views.engine
    engine    = Metro.Views.engines()[type]
    engine    = new engine
    template  = Metro.Views.lookup(path)
    locals    = @context(options)
    body      = engine.compile(template, locals)
    layout    = options.layout || @controller.layout()
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
