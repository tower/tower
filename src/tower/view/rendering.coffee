# @module
Tower.View.Rendering =
  render: (options, callback) ->
    options.type        ||= @constructor.engine
    options.layout      = @_context.layout() if !options.hasOwnProperty("layout") && @_context.layout
    options.locals      = @_renderingContext(options)

    @_renderBody options, (error, body) =>
      return callback(error, body) if error
      @_renderLayout(body, options, callback)

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
    if Tower.client
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
      e       = null
      result  = null
      # tmp hack
      coffeekup = if Tower.client then global.CoffeeKup else require("coffeekup")
      try
        locals          = options.locals
        locals.renderWithEngine = @renderWithEngine
        locals._readTemplate = @_readTemplate
        locals.cache    = Tower.env != "development"
        locals.format   = true
        hardcode        = {}
        for helper in Tower.View.helpers
          hardcode      = _.extend(hardcode, helper)
        hardcode        = _.extend(hardcode, tags: coffeekup.tags)
        locals.hardcode = hardcode
        locals._ = _
        result = coffeekup.render string, locals
      catch error
        e = error

      callback e, result
    else if options.type
      mint = require "mint"
      engine = require("mint").engine(options.type)
      mint[engine](string, options.locals, callback)
    else
      mint = require "mint"
      engine = require("mint")
      options.locals.string = string
      engine.render(options.locals, callback)

  # @private
  _renderingContext: (options) ->
    locals  = this
    _ref    = @_context
    for key of _ref
      value = _ref[key]
      locals[key] = value  unless key.match(/^(constructor|head)/)
    #newlocals = {}
    #newlocals.locals = locals
    #locals = newlocals
    locals = Tower.Support.Object.extend(locals, options.locals)
    locals.pretty = true  if @constructor.prettyPrint
    locals

  # @private
  _readTemplate: (template, prefixes, ext) ->
    return template unless typeof template == "string"
    # tmp
    result = @constructor.cache["app/views/#{template}"] ||= @constructor.store().find(path: template, ext: ext, prefixes: prefixes)
    throw new Error("Template '#{template}' was not found.") unless result
    result

module.exports = Tower.View.Rendering
