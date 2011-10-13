(function() {
  var Metro, exports;
  Metro = {
    Asset: require('../lib/asset').Asset,
    Support: require('../lib/support').Support,
    Application: require('../lib/application'),
    Route: require('../lib/route').Route,
    Model: require('../lib/model'),
    Controller: require('../lib/controller'),
    configure: function(callback) {
      var asset_key, config, key, self, _results;
      self = this;
      config = {
        assets: {}
      };
      callback.apply(config);
      _results = [];
      for (key in config) {
        _results.push((function() {
          var _results2;
          switch (key) {
            case "assets":
              _results2 = [];
              for (asset_key in config[key]) {
                _results2.push(self.Asset.config[asset_key] = config[key][asset_key]);
              }
              return _results2;
          }
        })());
      }
      return _results;
    },
    configuration: null,
    logger: null,
    root: null,
    env: null,
    cache: null,
    version: "0.2.0",
    application: function() {
      return Metro.Application.instance();
    }
  };
  exports = module.exports = Metro;
  global.Metro = Metro;
}).call(this);
