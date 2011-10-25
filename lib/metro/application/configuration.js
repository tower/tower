(function() {
  var Configuration;
  Configuration = (function() {
    function Configuration() {}
    Configuration.prototype.env = function() {
      return process.env();
    };
    Configuration.bootstrap = function() {
      require("" + Metro.root + "/config/application");
      Metro.Routes.bootstrap();
      Metro.Models.bootstrap();
      Metro.Views.bootstrap();
      Metro.Controllers.bootstrap();
      return Metro.Application.instance();
    };
    Configuration.prototype.configure = function(callback) {
      return callback.apply(this);
    };
    Configuration.configuration = null;
    Configuration.logger = new (require("common-logger"))({
      colorized: true
    });
    Configuration.root = process.cwd();
    Configuration.public_path = process.cwd() + "/public";
    Configuration.env = "test";
    Configuration.port = 1597;
    Configuration.cache = null;
    Configuration.version = "0.2.0";
    Configuration.locale = {
      en: {
        errors: {
          missing_callback: "You must pass a callback to %s.",
          not_found: "%s not found."
        }
      }
    };
    Configuration.raise = function() {
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
    Configuration.application = function() {
      return Metro.Application.instance();
    };
    Configuration.assets = function() {
      return Metro.Application.instance().assets();
    };
    Configuration.configure = function(callback) {
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
    Configuration.eventEmitter = new process.EventEmitter;
    Configuration.on = function(name, callback) {
      return this.eventEmitter.on(name, callback);
    };
    Configuration.emit = function(name, dispatcher, options) {
      if (options == null) {
        options = {};
      }
      options.dispatcher = dispatcher;
      return this.eventEmitter.emit(name, options);
    };
    return Configuration;
  })();
  module.exports = Configuration;
}).call(this);
