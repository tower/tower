# @mixin
Tower.View.Rendering =
  render: (options, callback) ->
    if !options.type && options.template && !options.inline
      type  = options.template.split('/')
      type  = type[type.length - 1].split(".")
      type  = type[1..-1].join()
      options.type  = if type != '' then type else @constructor.engine
      
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
      engine = mint.engine(options.type)
      # need to fix this on mint.js repo
      if engine.match(/(eco|mustache)/)
        mint[engine] string, options, callback
      else
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
    locals = _.modules(locals, options.locals)
    locals.pretty = true  if @constructor.prettyPrint
    locals

  # @private
  _readTemplate: (template, prefixes, ext) ->
    return template unless typeof template == "string"
    path      = @constructor.store().findPath(path: template, ext: ext, prefixes: prefixes)
    path    ||= "#{@constructor.store().loadPaths[0]}/#{template}"
    #cachePath = path.replace(/\.\w+$/, "")
    cachePath = path
    result    = @constructor.cache[cachePath] || require('fs').readFileSync(path, 'utf-8').toString()
    throw new Error("Template '#{template}' was not found.") unless result
    result

module.exports = Tower.View.Rendering
