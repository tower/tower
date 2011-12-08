Metro.View.Rendering =
  render: (options, callback) ->
    options.locals      = @_renderingContext(options)
    options.type        ||= @constructor.engine
    options.layout      = @context.layout() if !options.hasOwnProperty("layout") && @context.layout
    
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
        options.template = @_readTemplate(options.template, options.type)
      @_renderString(options.template, options, callback)
  
  _renderLayout: (body, options, callback) ->
    if options.layout
      layout  = @_readTemplate(options.layout, options.type)
      options.locals.yield = body
      
      @_renderString(layout, options, callback)
    else
      callback(null, body)
      
  _renderString: (string, options = {}, callback) ->
    if options.type
      engine = require("shift").engine(options.type)
      engine.render(string, options.locals, callback)
    else
      engine = require("shift")
      options.locals.string = string
      engine.render(options.locals, callback)
  
  _renderingContext: (options) ->
    context    = @context
    locals        = {}
    
    for key, value of context
      locals[key] = value unless key == "constructor"
    
    locals        = Metro.Support.Object.extend(locals, @locals || {}, options.locals)
    locals.pretty = true if @constructor.prettyPrint
    locals
    
  _readTemplate: (path, ext) ->
    template = @constructor.store().find(path: path, ext: ext)
    throw new Error("Template '#{path}' was not found.") unless template
    template
  
module.exports = Metro.View.Rendering
