# @mixin
Tower.ViewRendering =
  # The core method for rendering a view on the client or server.
  # 
  # It is never called directly, but passed a more normalized options hash from the controller.
  # 
  # @param [Object] options
  # @param [Function] callback
  # @option options [String] type Can be `json`, `coffee`, `ejs`, `html`, etc. 
  #   (i.e. anything in mint.js or with custom handlers defined).
  #   You can also skip this parameter and use it as a key.
  # @option options [Object] json Can pass `json: {some: 'json'}` (and any other "format")
  # @option options [String] text Raw text to write to the request.
  # @option options [String] template the path to the template relative to the app root (including file extension).
  #   If no template is given, it will try to compute the path from the type or default engine.
  #   This is the main (and most important) thing that gets computed in the render method,
  #   as it's the path to the actual file.
  # @option options [Boolean] inline whether or not the template is an inline function (rare)
  # @option options [String|Boolean] layout if false it won't render a layout,
  #   otherwise if a string it will grab the layout from `app/layouts/<layout>`.
  # @option options [Object] locals data accessible as variables in the template itself (the template context)
  # @option options [Array] prefixes Array of folders to look for the templates in.
  render: (options, callback) ->
    @_normalizeRenderOptions(options)
    
    @_renderBody options, (error, body) =>
      return callback.call(@, error, body) if error
      @_renderLayout(body, options, callback)

  _normalizeRenderOptions: (options) ->
    if !options.type && options.template && typeof(options.template) == 'string' && !options.inline
      type  = options.template.split('/')
      type  = type[type.length - 1].split(".")
      type  = type[1..-1].join()
      options.type  = if type != '' then type else @constructor.engine

    options.type        ||= @constructor.engine
    options.layout      = @_context.layout() if !options.hasOwnProperty("layout") && @_context.layout
    options.locals      = @_renderingContext(options)
    options

  partial: (path, options, callback) ->
    if typeof options == "function"
      callback  = options
      options   = {}
    options ||= {}
    prefixes = options.prefixes
    prefixes ||= [@_context.collectionName] if @_context
    template = @_readTemplate(path, prefixes, options.type || Tower.View.engine)
    @_renderString(template, options, callback)

  renderWithEngine: (template, engine) ->
    if Tower.isClient
      "(#{template}).call(this);"
    else
      mint = require("mint")
      mint[mint.engine(engine || "coffee")] template, {}, (error, result) ->
        console.log error if error

  # @private
  _renderBody: (options, callback) ->
    if options.text
      callback(null, options.text)
    else if options.json
      callback(null, if typeof(options.json) == "string" then options.json else JSON.stringify(options.json))
    else
      unless options.inline
        options.template = @_readTemplate(options.template, options.prefixes, options.type)
      @_renderString(options.template, options, callback)

  # @private
  _renderLayout: (body, options, callback) ->
    if options.layout
      layout  = @_readTemplate("layouts/#{options.layout}", [], options.type)
      options.locals.body = body
      @_renderString(layout, options, callback)
    else
      callback(null, body)

  # @private
  _renderString: (string, options = {}, callback) ->
    if !!options.type.match(/coffee/)
      @_renderCoffeecupString(string, options, callback)
    else if options.type
      mint = require("mint")
      string = string() if typeof string == 'function'
      engine = mint.engine(options.type)
      # need to fix this on mint.js repo
      if engine.match(/(eco|mustache)/)
        mint[engine] string, options, callback
      else
        mint[engine](string, options.locals, callback)
    else
      engine = require("mint")
      options.locals.string = string
      engine.render(options.locals, callback)

  _renderCoffeecupString: (string, options, callback) ->
    e       = null
    result  = null
    # tmp hack
    coffeecup = Tower.modules.coffeecup
    try
      locals          = options.locals || {}
      locals.renderWithEngine = @renderWithEngine
      locals._readTemplate = @_readTemplate
      locals.cache    = Tower.env != "development"
      locals.format   = true
      hardcode        = Tower.View.helpers
      hardcode        = _.extend(hardcode, tags: Tower.View.coffeecupTags)#_.inject(tags, ((hash, i) -> hash[i] = true; hash), {}))
      locals.hardcode = hardcode
      locals._ = _

      result = coffeecup.render string, locals
    catch error
      e = error
      console.log e.stack

    callback(e, result)

  # @private
  _renderingContext: (options) ->
    locals  = @
    context = @_context
    for key, value of context
      locals[key] = value unless key.match(/^(constructor|head)/)
    locals = Tower._.modules(locals, options.locals)
    locals.pretty = true  if @constructor.prettyPrint
    locals

  # @private
  _readTemplate: (template, prefixes, ext) ->
    # can be a string or function
    return template unless typeof template == "string"
    options   = {path: template, ext: ext, prefixes: prefixes}
    store     = @constructor.store()
    # tmp
    if typeof store.findPath != 'undefined'
      path      = store.findPath(options)
      path    ||= store.defaultPath(options)
    else
      path      = template
    #cachePath = path.replace(/\.\w+$/, "")
    cachePath = path
    if Tower.isClient
      cachePath = 'app/views/' + cachePath
      
    result    = @constructor.cache[cachePath] || require('fs').readFileSync(path, 'utf-8').toString()
    throw new Error("Template '#{template}' was not found.") unless result
    result

module.exports = Tower.ViewRendering
