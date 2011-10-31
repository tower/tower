class Metro.View.Rendering    
  render: ->  
    args = Array.prototype.slice.call(arguments, 0, arguments.length)
    
    unless args.length >= 2 && typeof(args[args.length - 1]) == "function"
      throw new Error("You must pass a callback to the render method")
    
    callback = args.pop()
    
    if args.length == 1
      if typeof(args[0]) == "string"
        options = template: args[0]
      else
        options = args[0]
    else
      template  = args[0]
      options   = args[1]
      options.template = template
    
    options  ?= {}
    options.locals = @context(options)
    options.type ?= Metro.View.engine
    options.engine = Metro.engine(options.type)
    if options.hasOwnProperty("layout") && options.layout == false
      options.layout = false
    else
      options.layout = options.layout || @controller.layout()
      
    self = @
    
    @_renderBody options, (error, body) ->
      self._renderLayout(body, options, callback)
    
  _renderBody: (options, callback) ->
    if options.text
      callback(null, options.text)
    else if options.json
      callback(null, if typeof(options.json) == "string" then options.json else JSON.stringify(options.json))
    else
      unless options.inline
        template = Metro.View.lookup(options.template)
        template = Metro.Support.Path.read(template)
      options.engine.render(template, options.locals, callback)
  
  _renderLayout: (body, options, callback) ->
    if options.layout
      layout  = Metro.View.lookup("layouts/#{options.layout}")
      layout  = Metro.Support.Path.read(layout)
      options.locals.yield = body
      
      options.engine.render(layout, options.locals, callback)
    else
      callback(null, body)
  
  context: (options) ->
    controller = @controller
    locals = {}
    for key of controller
      locals[key] = controller[key] unless key == "constructor"
    locals  = require("underscore").extend(locals, @locals || {}, options.locals)
    
    locals.pretty = true if Metro.View.prettyPrint
    
    locals
  
module.exports = Metro.View.Rendering
