Metro =
  Asset:        require('./metro/asset').Asset
  Support:      require('./metro/support').Support
  Application:  require('./metro/application')
  Route:        require('./metro/route').Route
  Model:        require('./metro/model')
  View:         require('./metro/view')
  Controller:   require('./metro/controller')
  Presenter:    require('./metro/presenter')
  Template:     require('./metro/template')
  Services:     require('./metro/services')
  
  configure:  (callback) ->
    self   = @
    config = assets: {}
    callback.apply(config)
    for key of config
      switch key
        when "assets"
          for asset_key of config[key]
            self.Asset.config[asset_key] = config[key][asset_key]
            
  configuration:  null
  logger:         null
  root:           "."
  env:            null
  cache:          null
  version:        "0.2.0"
  application: ->
    Metro.Application.instance()
  
exports = module.exports = Metro

global.Metro = Metro