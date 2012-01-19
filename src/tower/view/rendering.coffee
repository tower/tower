Tower.View.Rendering =
  render: (options, callback) ->
    options.type        ||= @constructor.engine
    options.layout      = @_context.layout() if !options.hasOwnProperty("layout") && @_context.layout
    options.locals      = @_renderingContext(options)
    
    self = @
    
    @_renderBody options, (error, body) ->
      return callback(error, body) if error
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
      layout  = @_readTemplate("layouts/#{options.layout}", options.type)
      options.locals.yield = body
      
      @_renderString(layout, options, callback)
    else
      callback(null, body)
      
  _renderString: (string, options = {}, callback) ->
    if !!options.type.match(/coffee/)
      e       = null
      result  = null
      try
        locals          = options.locals
        locals.cache    = Tower.env != "development"
        locals.format   = true
        locals.hardcode = _.extend {}, 
          Tower.View.ComponentHelper
          Tower.View.AssetHelper
          Tower.View.HeadHelper
        result = require('coffeekup').render string, locals
        
      catch error
        e = error
      
      callback e, result
    else if options.type
      engine = require("shift").engine(options.type)
      engine.render(string, options.locals, callback)
    else
      engine = require("shift")
      options.locals.string = string
      engine.render(options.locals, callback)
  
  _renderingContext: (options) ->
    locals  = @
    for key, value of @_context
      @[key] = value unless key.match(/^(render|constructor)/)
    locals        = Tower.Support.Object.extend(locals, options.locals)
    locals.pretty = true if @constructor.prettyPrint
    locals
    
  _readTemplate: (template, ext) ->
    return template unless typeof template == "string"
    result = @constructor.store().find(path: template, ext: ext)
    throw new Error("Template '#{template}' was not found.") unless result
    result
  
module.exports = Tower.View.Rendering
