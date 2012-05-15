
Tower.Store.Mongodb.Configuration = {
  ClassMethods: {
    supports: {
      embed: true
    },
    config: {
      name: "development",
      port: 27017,
      host: "127.0.0.1"
    },
    configure: function(options) {
      return _.deepMerge(this.config, options);
    },
    env: function() {
      return this.config;
    },
    lib: function() {
      return require('mongodb');
    }
  }
};

module.exports = Tower.Store.Mongodb.Configuration;
