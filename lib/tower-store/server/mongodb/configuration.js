var _;

_ = Tower._;

Tower.StoreMongodbConfiguration = {
  ClassMethods: {
    supports: {
      embed: true
    },
    config: {
      name: 'development',
      port: 27017,
      host: '127.0.0.1'
    },
    configure: function(options) {
      return _.deepMerge(this.config, options);
    },
    parseEnv: function() {
      var env, url;
      env = this.config;
      if (env.url) {
        url = new Tower.NetUrl(env.url);
        env.name = url.segments[0];
        env.host = url.hostname;
        env.port = url.port;
        env.username = url.user;
        env.password = url.password;
      }
      return env;
    },
    lib: function() {
      return require('mongodb');
    }
  }
};

module.exports = Tower.StoreMongodbConfiguration;
