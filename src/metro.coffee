Metro =
  Asset:        require('./metro/asset').Asset
  Support:      require('./metro/support').Support
  Application:  require('./metro/application')
  Route:        require('./metro/route')
  Model:        require('./metro/model')
  View:         require('./metro/view')
  Controller:   require('./metro/controller')
  Presenter:    require('./metro/presenter')
  Template:     require('./metro/template')
  Services:     require('./metro/services')
            
  configuration:  null
  logger:         null
  root:           (process.cwd() + "/spec/spec-app")
  env:            "test"
  port:           1597
  cache:          null
  version:        "0.2.0"
  application: ->
    Metro.Application.instance()
  
  configure:  (callback) ->
    self   = @
    config = assets: {}
    callback.apply(config)
    for key of config
      switch key
        when "assets"
          for asset_key of config[key]
            self.Asset.config[asset_key] = config[key][asset_key]
  
exports = module.exports = Metro

global.Metro = Metro