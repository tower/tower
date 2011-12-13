
  Metro.Store.MongoDB.Configuration = {
    ClassMethods: {
      config: {
        development: {
          name: "metro-development",
          port: 27017,
          host: "127.0.0.1"
        },
        test: {
          name: "metro-test",
          port: 27017,
          host: "127.0.0.1"
        },
        staging: {
          name: "metro-staging",
          port: 27017,
          host: "127.0.0.1"
        },
        production: {
          name: "metro-production",
          port: 27017,
          host: "127.0.0.1"
        }
      },
      configure: function(options) {
        return Metro.Support.Object.mixin(this.config, options);
      },
      env: function() {
        return this.config[Metro.env];
      },
      lib: function() {
        return this._lib || (this._lib = require('mongodb'));
      }
    }
  };

  module.exports = Metro.Store.MongoDB.Configuration;
