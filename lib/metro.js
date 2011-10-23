(function() {
  var api, key, value;
  module.exports = global.Metro = {};
  api = {
    Assets: require('./metro/assets'),
    Support: require('./metro/support'),
    Application: require('./metro/application'),
    Routes: require('./metro/routes'),
    Models: require('./metro/models'),
    Views: require('./metro/views'),
    Controllers: require('./metro/controllers'),
    Presenters: require('./metro/presenters'),
    Compilers: require('./metro/compilers'),
    Services: require('./metro/services'),
    Middleware: require('./metro/middleware'),
    Commands: require('./metro/commands'),
    Generators: require('./metro/generators'),
    Settings: require('./metro/settings'),
    Spec: require('./metro/spec')
  };
  for (key in api) {
    value = api[key];
    Metro[key] = value;
  }
  api = {
    configuration: null,
    logger: new (require("common-logger"))({
      colorized: true
    }),
    root: process.cwd(),
    public_path: process.cwd() + "/public",
    env: "test",
    port: 1597,
    cache: null,
    version: "0.2.0",
    locale: {
      en: {
        errors: {
          missing_callback: "You must pass a callback to %s.",
          not_found: "%s not found."
        }
      }
    },
    raise: function() {
      var args, i, message, node, path, _i, _len;
      args = Array.prototype.slice.call(arguments);
      path = args.shift().split(".");
      message = Metro.locale.en;
      for (_i = 0, _len = path.length; _i < _len; _i++) {
        node = path[_i];
        message = message[node];
      }
      i = 0;
      message = message.replace(/%s/g, function() {
        return args[i++];
      });
      throw new Error(message);
    },
    application: function() {
      return Metro.Application.instance();
    },
    assets: function() {
      return Metro.Application.instance().assets();
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
  for (key in api) {
    value = api[key];
    Metro[key] = value;
  }
}).call(this);
