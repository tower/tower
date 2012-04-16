
Tower.Store.MongoDB.Configuration = {
  ClassMethods: {
    supports: {
      embed: true
    },
    config: {},
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
