(function() {
  var Metro;
  require('./metro/support');
  Metro = (function() {
    function Metro() {}
    Metro.autoload('Asset', './metro/asset');
    Metro.autoload('Application', './metro/application');
    Metro.autoload('Route', './metro/route');
    Metro.autoload('./metro/model');
    Metro.autoload('./metro/view');
    Metro.autoload('./metro/controller');
    Metro.autoload('./metro/presenter');
    Metro.autoload('./metro/middleware');
    Metro.autoload('./metro/command');
    Metro.autoload('./metro/generator');
    Metro.autoload('./metro/spec');
    Metro.configuration = null;
    Metro.logger = new (require("common-logger"))({
      colorized: true
    });
    Metro.root = process.cwd();
    Metro.public_path = process.cwd() + "/public";
    Metro.env = "test";
    Metro.port = 1597;
    Metro.cache = null;
    Metro.version = "0.2.0";
    Metro.locale = {
      en: {
        errors: {
          missing_callback: "You must pass a callback to %s.",
          not_found: "%s not found."
        }
      }
    };
    Metro.raise = function() {
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
    };
    Metro.application = function() {
      return Metro.Application.instance();
    };
    Metro.assets = function() {
      return Metro.Application.instance().assets();
    };
    Metro.configure = function(callback) {
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
    };
    Metro.eventEmitter = new process.EventEmitter;
    Metro.on = function(name, callback) {
      return this.eventEmitter.on(name, callback);
    };
    Metro.emit = function(name, dispatcher, options) {
      if (options == null) {
        options = {};
      }
      options.dispatcher = dispatcher;
      return this.eventEmitter.emit(name, options);
    };
    return Metro;
  })();
  module.exports = global.Metro = Metro;
}).call(this);
