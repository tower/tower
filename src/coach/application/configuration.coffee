Coach.Support.Object.extend Coach, 
  env:        "development"
  port:       1597
  version:    "0.3.6"
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
    throw new Error(Coach.t(arguments...))
  configure:  ->
  initialize: -> Coach.Application.initialize()
  t:          -> Coach.Support.I18n.t(arguments...)
  case:        "camelcase"
  urlFor: ->
    Coach.Route.urlFor(arguments...)
  stringify: ->
    string = Coach.Support.Array.args(arguments).join("_")
    switch Coach.case
      when "snakecase"
        Coach.Support.String.underscore(string)
      else
        Coach.Support.String.camelcase(string)
  namespace:  ->
    Coach.Application.instance().constructor.name
    
  accessors: true
  constant: (string) ->
    node  = global
    
    try
      parts = string.split(".")
      for part in parts
        node = node[part]
    catch error
      # try doing namespace version as last resort
      namespace = Coach.namespace()
      if namespace && parts[0] != namespace
        Coach.constant("#{namespace}.#{string}")
      else
        throw new Error("Constant '#{string}' wasn't found")
    node
    
  namespaced: (string) ->
    namespace = Coach.namespace()
    if namespace
      "#{namespace}.#{string}"
    else
      string
