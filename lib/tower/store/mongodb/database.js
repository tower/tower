
Tower.Store.MongoDB.Database = {
  ClassMethods: {
    initialize: function(callback) {
      var env, mongo, url;
      var _this = this;
      if (!this.database) {
        try {
          this.configure(Tower.config.databases.mongodb);
        } catch (_error) {}
        env = this.env();
        mongo = this.lib();
        if (env.url) {
          url = new Tower.Dispatch.Url(env.url);
          env.name = url.segments[0] || url.user;
          env.host = url.hostname;
          env.port = url.port;
          env.username = url.user;
          env.password = url.password;
        }
        new mongo.Db(env.name, new mongo.Server(env.host, env.port, {})).open(function(error, client) {
          if (error) throw error;
          if (env.username && env.password) {
            return client.authenticate(env.username, env.password, function(error) {
              if (error) throw error;
              _this.database = client;
              if (callback) return callback();
            });
          } else {
            _this.database = client;
            if (callback) return callback();
          }
        });
        process.on("exit", function() {
          if (_this.database) return _this.database.close();
        });
      }
      return this.database;
    }
  },
  collection: function() {
    var lib;
    if (!this._collection) {
      lib = this.constructor.lib();
      this._collection = new lib.Collection(this.constructor.database, this.name);
    }
    return this._collection;
  }
};

module.exports = Tower.Store.MongoDB.Database;
