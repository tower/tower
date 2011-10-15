(function() {
  var Metro, exports;
  Metro = {
    Assets: require('./metro/assets'),
    Support: require('./metro/support'),
    Application: require('./metro/application'),
    Routes: require('./metro/routes'),
    Models: require('./metro/models'),
    Views: require('./metro/views'),
    Controllers: require('./metro/controllers'),
    Presenters: require('./metro/presenters'),
    Templates: require('./metro/templates'),
    Services: require('./metro/services'),
    Middleware: require('./metro/middleware'),
    Commands: require('./metro/commands'),
    Generators: require('./metro/generators'),
    configuration: null,
    logger: null,
    root: process.cwd() + "/spec/spec-app",
    env: "test",
    port: 1597,
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
                _results2.push(self.Assets.config[asset_key] = config[key][asset_key]);
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
