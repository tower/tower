(function() {

  Tower.Store.MongoDB.Configuration = {
    ClassMethods: {
      supports: {
        embed: true
      },
      config: {
        development: {
          name: "tower-development",
          port: 27017,
          host: "127.0.0.1"
        },
        test: {
          name: "tower-test",
          port: 27017,
          host: "127.0.0.1"
        },
        staging: {
          name: "tower-staging",
          port: 27017,
          host: "127.0.0.1"
        },
        production: {
          name: "tower-production",
          port: 27017,
          host: "127.0.0.1"
        }
      },
      configure: function(options) {
        return _.deepMerge(this.config, options);
      },
      env: function() {
        return this.config[Tower.env];
      },
      lib: function() {
        return require('mongodb');
      }
    }
  };

  module.exports = Tower.Store.MongoDB.Configuration;

}).call(this);
