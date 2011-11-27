Metro.View.Rendering =
  render: (options, callback) ->
    options.locals      = @_renderingContext(options)
    options.layout      = @controller.layout() unless options.hasOwnProperty("layout")
    
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
        options.template = @store().find(path: options.template)
      @_renderString(options.template, options, callback)
  
  _renderLayout: (body, options, callback) ->
    if options.layout
      layout  = @store().find(path: layout)
      options.locals.yield = body
      
      @_renderString(layout, options.locals, callback)
    else
      callback(null, body)
      
  _renderString: (string, options = {}, callback) ->
    if options.type
      engine = require("shift").engine(type)
    else
      engine = require("shift")
      
    engine.render(string, options.locals, callback)
  
  _renderingContext: (options) ->
    controller    = @controller
    locals        = {}
    
    for key, value of controller
      locals[key] = value unless key == "constructor"
    
    locals        = Metro.Support.Object.extend(locals, @locals || {}, options.locals)
    locals.pretty = true if @constructor.prettyPrint
    locals
  
module.exports = Metro.View.Rendering
