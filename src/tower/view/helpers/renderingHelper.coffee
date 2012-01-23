Tower.View.RenderingHelper =
  partial: (path, options, callback) ->
    if typeof options == "function"
      callback  = options
      options   = {}
    options   ||= {}
    path        = path.split("/")
    path[path.length - 1] = "_#{path[path.length - 1]}"
    path        = path.join("/")
    prefixes    = options.prefixes
    prefixes  ||= [@_context.collectionName] if @_context
    template    = @_readTemplate(path, prefixes, options.type || Tower.View.engine)
    template    = @renderWithEngine(String(template))
    tmpl        = "(function() {#{String(template)}})"
    if options.collection
      name = options.as || Tower.Support.String.camelize(options.collection[0].constructor.name, true)
      for item in options.collection
        @[name] = item
        eval(tmpl).call(@)
        delete @[name]
    else
      eval(tmpl).call(@)
    null
    
  page: ->
    args          = Tower.Support.Array.args(arguments)
    options       = Tower.Support.Array.extractOptions(args)
    browserTitle  = args.shift() || options.title
    
    @contentFor "title", ->
      title browserTitle
    
  yields: (key) ->
    value = @[key]
    if typeof value == "function"
      eval("(#{String(value)})()")
    else
      #__ck.indent()
      ending = if value.match(/\n$/) then "\n" else ""
      text(value.replace(/\n$/, "").replace(/^(?!\s+$)/mg, __ck.repeat('  ', __ck.tabs)) + ending)
    null
  
  hasContentFor: (key) ->
    !!(@hasOwnProperty(key) && @[key] && @[key] != "")
    
  contentFor: (key, block) ->
    @[key] = block
    null