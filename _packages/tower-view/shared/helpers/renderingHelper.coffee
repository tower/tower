# @mixin
Tower.ViewRenderingHelper =
  partial: (path, options, callback) ->
    try
      if typeof options == "function"
        callback  = options
        options   = {}
      options   ||= {}
      options.locals ||= {}
      locals      = options.locals
      path        = path.split("/")
      path[path.length - 1] = "_#{path[path.length - 1]}"
      path        = path.join("/")
      prefixes    = options.prefixes
      prefixes  ||= [@_context.collectionName] if @_context
      template    = @_readTemplate(path, prefixes, options.type || Tower.View.engine)
      template    = @renderWithEngine(String(template))
      if options.collection
        name      = options.as || _.camelize(options.collection[0].constructor.name, true)
        tmpl      = eval "(function(data) { with(data) { this.#{name} = #{name}; #{String(template)} } })"
        for item in options.collection
          locals[name] = item
          tmpl.call(@, locals)
          delete @[name]
      else
        tmpl      = "(function(data) { with(data) { #{String(template)} } })"
        eval(tmpl).call(@, locals)
    catch error
      console.log error.stack || error

    null

  page: ->
    args          = _.args(arguments)
    options       = _.extractOptions(args)
    browserTitle  = args.shift() || options.title

    @contentFor "title", ->
      title browserTitle

  urlFor: ->
    Tower.urlFor(arguments...)

  yields: (key) ->
    value = @[key]
    if typeof value == "function"
      eval("(#{String(value)})()")
    else
      #__cc.indent()
      ending = if value.match(/\n$/) then "\n" else ""
      text(value.replace(/\n$/, "").replace(/^(?!\s+$)/mg, __cc.repeat('  ', __cc.tabs)) + ending)
    null

  hasContentFor: (key) ->
    !!(@hasOwnProperty(key) && @[key] && @[key] != "")

  has: (key) ->
    !!(@hasOwnProperty(key) && @[key] && @[key] != "")

  contentFor: (key, block) ->
    @[key] = block
    null