Tower.View.Rendering =
  render: (options, callback) ->
    options.type        ||= @constructor.engine
    options.layout      = @_context.layout() if !options.hasOwnProperty("layout") && @_context.layout
    options.locals      = @_renderingContext(options)
    
    self = @
    
    @_renderBody options, (error, body) ->
      return callback(error, body) if error
      self._renderLayout(body, options, callback)
  
  partial: (path, options, callback) ->
    if typeof options == "function"
      callback  = options
      options   = {}
    options ||= {}
    prefixes = options.prefixes
    prefixes ||= [@_context.collectionName] if @_context
    template = @_readTemplate(path, prefixes, options.type || Tower.View.engine)
    @_renderString(template, options, callback)
    
  _renderBody: (options, callback) ->
    if options.text
      callback(null, options.text)
    else if options.json
      callback(null, if typeof(options.json) == "string" then options.json else JSON.stringify(options.json))
    else
      unless options.inline
        options.template = @_readTemplate(options.template, options.prefixes, options.type)
      @_renderString(options.template, options, callback)
  
  _renderLayout: (body, options, callback) ->
    if options.layout
      layout  = @_readTemplate("layouts/#{options.layout}", [], options.type)
      options.locals.body = body
      @_renderString(layout, options, callback)
    else
      callback(null, body)
      
  _renderString: (string, options = {}, callback) ->
    if !!options.type.match(/coffee/)
      e       = null
      result  = null
      try
        locals          = options.locals
        locals.renderWithEngine = @renderWithEngine
        locals.cache    = Tower.env != "development"
        locals.format   = true
        locals.hardcode = _.extend {}, 
          Tower.View.ComponentHelper
          Tower.View.AssetHelper
          Tower.View.HeadHelper
          Tower.View.RenderingHelper
          Tower.View.StringHelper
          tags: require('coffeekup').tags
        locals._ = _
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
      @[key] = value unless key.match(/^(constructor)/)
    locals        = Tower.Support.Object.extend(locals, options.locals)
    locals.pretty = true if @constructor.prettyPrint
    locals
    
  _readTemplate: (template, prefixes, ext) ->
    return template unless typeof template == "string"
    result = @constructor.store().find(path: template, ext: ext, prefixes: prefixes)
    throw new Error("Template '#{template}' was not found.") unless result
    result
    
  renderWithEngine: (template, engine) ->
    require("shift").engine(engine || "coffee").render(template)
  
module.exports = Tower.View.Rendering
