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
  logger:         new Metro.Support.Logger
  root:           process.cwd()
  public_path:    process.cwd() + "/public"
  env:            "test"
  port:           1597
  cache:          null
  version:        "0.2.0"
  
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