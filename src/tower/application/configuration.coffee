Tower.Support.Object.extend Tower, 
  env:        "development"
  port:       1597
  version:    "0.3.0"
  client:     typeof(window) != "undefined"
  root:       "/"
  publicPath: "/"
  namespace:  null
  logger:     if typeof(_console) != 'undefined' then _console else console
  stack: ->
    try
      throw new Error
    catch error
      return error.stack
  raise: ->
    throw new Error(Tower.t(arguments...))
  configure:  ->
  initialize: -> Tower.Application.initialize()
  t:          -> Tower.Support.I18n.t(arguments...)
  case:        "camelcase"
  #urlFor: ->
    #Tower.Route.urlFor(arguments...)
  stringify: ->
    string = Tower.Support.Array.args(arguments).join("_")
    switch Tower.case
      when "snakecase"
        Tower.Support.String.underscore(string)
      else
        Tower.Support.String.camelcase(string)
  namespace:  ->
    Tower.Application.instance().constructor.name
    
  accessors: true
  constant: (string) ->
    node  = global
    parts = string.split(".")
    
    try
      for part in parts
        node = node[part]
    catch error
      # try doing namespace version as last resort
      namespace = Tower.namespace()
      if namespace && parts[0] != namespace
        Tower.constant("#{namespace}.#{string}")
      else
        throw new Error("Constant '#{string}' wasn't found")
    node
    
  namespaced: (string) ->
    namespace = Tower.namespace()
    if namespace
      "#{namespace}.#{string}"
    else
      string
