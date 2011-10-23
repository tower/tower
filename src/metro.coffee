module.exports = global.Metro = {}
  
api =
  Assets:       require('./metro/assets')
  Support:      require('./metro/support')
  Application:  require('./metro/application')
  Routes:       require('./metro/routes')
  Models:       require('./metro/models')
  Views:        require('./metro/views')
  Controllers:  require('./metro/controllers')
  Presenters:   require('./metro/presenters')
  Compilers:    require('./metro/compilers')
  Services:     require('./metro/services')
  Middleware:   require('./metro/middleware')
  Commands:     require('./metro/commands')
  Generators:   require('./metro/generators')
  Settings:     require('./metro/settings')
  Spec:         require('./metro/spec')

Metro[key] = value for key, value of api

api =
  configuration:  null
  logger:         new (require("common-logger"))(colorized: true)
  root:           process.cwd()
  public_path:    process.cwd() + "/public"
  env:            "test"
  port:           1597
  cache:          null
  version:        "0.2.0"
  
  locale:
    en:
      errors:
        missing_callback: "You must pass a callback to %s."
        not_found: "%s not found."
  
  raise: ->
    args    = Array.prototype.slice.call(arguments)
    path    = args.shift().split(".")
    message = Metro.locale.en
    message = message[node] for node in path
    i       = 0
    message = message.replace /%s/g, -> args[i++]
    throw new Error(message)
  
  application: ->
    Metro.Application.instance()
  
  assets: -> 
    Metro.Application.instance().assets()
  
  configure:  (callback) ->
    self   = @
    config = assets: {}
    callback.apply(config)
    for key of config
      switch key
        when "assets"
          for asset_key of config[key]
            self.Assets.config[asset_key] = config[key][asset_key]

Metro[key] = value for key, value of api