Metro.Support.Object.extend Metro, 
  env:        "development"
  port:       1597
  version:    "0.2.6"
  client:     typeof(window) != "undefined"
  root:       "/"
  publicPath: "/"
  namespace:  null
  logger:     if typeof(_console) != 'undefined' then _console else console
  raise: ->
    throw new Error(Metro.t(arguments...))
  configure:  ->
  initialize: -> Metro.Application.initialize()
  t:          -> Metro.Support.I18n.t(arguments...)
  case:        "camelcase"
  stringify: ->
    string = Metro.Support.Array.args(arguments).join("_")
    switch Metro.case
      when "snakecase"
        Metro.Support.String.underscore(string)
      else
        Metro.Support.String.camelcase(string)
  namespace:  ->
    Metro.Application.instance().constructor.name
    
  accessors: true
  constant: (string) ->
    node  = global
    
    try
      parts = string.split(".")
      for part in parts
        node = node[part]
    catch error
      throw new Error("Constant '#{string}' wasn't found")
    node
    
  namespaced: (string) ->
    namespace = Metro.namespace()
    if namespace
      "#{namespace}.#{string}"
    else
      string
