(function() {
  var Metro, exports;
  Metro = {
    Asset: require('./metro/asset').Asset,
    Support: require('./metro/support').Support,
    Application: require('./metro/application'),
    Route: require('./metro/route').Route,
    Model: require('./metro/model'),
    View: require('./metro/view'),
    Controller: require('./metro/controller'),
    Presenter: require('./metro/presenter'),
    Template: require('./metro/template'),
    Services: require('./metro/services'),
    configuration: null,
    logger: null,
    root: ".",
    env: null,
    cache: null,
    version: "0.2.0",
    application: function() {
      return Metro.Application.instance();
    },
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
    }
  };
  exports = module.exports = Metro;
  global.Metro = Metro;
}).call(this);
