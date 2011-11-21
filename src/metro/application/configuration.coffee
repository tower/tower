Metro.Support.Object.mixin Metro, 
  env:        "development"
  port:       1597
  version:    "0.2.6"
  client:     typeof(window) != "undefined"
  root:       "/"
  publicPath: "/"
  namespace:  null
  logger:     if typeof(_console) != 'undefined' then _console else console
  raise: ->
    throw new Error(Metro.translate(arguments...))
  configure:  ->
  initialize: -> Metro.Application.initialize()
  translate:  -> Metro.Support.I18n.t(arguments...)
