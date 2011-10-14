Metro =
  Asset:        require('../lib/asset').Asset
  Support:      require('../lib/support').Support
  Application:  require('../lib/application')
  Route:        require('../lib/route').Route
  Model:        require('../lib/model')
  View:         require('../lib/view')
  Controller:   require('../lib/controller')
  Template:     require('../lib/template')
  
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