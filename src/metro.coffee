Metro =
  Asset:      require('../lib/asset').Asset
  Support:    require('../lib/support').Support
  
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
