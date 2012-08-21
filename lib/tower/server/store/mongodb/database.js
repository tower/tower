
Tower.Store.MongoDB.Database = {
  ClassMethods: {
    info: function(callback) {},
    addIndex: function(callback) {
      var indexes;
      indexes = this._pendingIndexes || (this._pendingIndexes = []);
      return indexes.push(callback);
    },
    initialize: function(callback) {
      var applyIndexes, env, mongo, url,
        _this = this;
      if (!this.initialized) {
        applyIndexes = function(done) {
          var applyIndex, indexes;
          indexes = _this._pendingIndexes;
          applyIndex = function(index, next) {
            return index(next);
          };
          if (indexes && indexes.length) {
            return Tower.series(indexes, applyIndex, done);
          } else {
            return done();
          }
        };
        this.initialized = true;
        env = this.env();
        mongo = this.lib();
        if (env.url) {
          url = new Tower.HTTP.Url(env.url);
          env.name = url.segments[0] || url.user;
          env.host = url.hostname;
          env.port = url.port;
          env.username = url.user;
          env.password = url.password;
        }
        new mongo.Db(env.name, new mongo.Server(env.host, env.port, {})).open(function(error, client) {
          if (error) {
            throw error;
          }
          if (env.username && env.password) {
            return client.authenticate(env.username, env.password, function(error) {
              if (error) {
                throw error;
              }
              _this.database = client;
              return applyIndexes(function() {
                if (callback) {
                  return callback();
                }
              });
            });
          } else {
            _this.database = client;
            return applyIndexes(function() {
              if (callback) {
                return callback();
              }
            });
          }
        });
        process.on("exit", function() {
          if (_this.database) {
            return _this.database.close();
          }
        });
      } else {
        if (callback) {
          callback();
        }
      }
      return this.database;
    },
    clean: function(callback) {
      var _this = this;
      if (!this.database) {
        return callback.call(this);
      }
      return this.database.collections(function(error, collections) {
        var remove;
        remove = function(collection, next) {
          return collection.remove(next);
        };
        return Tower.parallel(collections, remove, callback);
      });
    }
  },
  InstanceMethods: {
    addIndex: function(name, callback) {
      var _this = this;
      if (this.constructor.initialized) {
        return this.collection().ensureIndex(name, callback);
      } else {
        return this.constructor.addIndex(function(callback) {
          return _this.collection().ensureIndex(name, callback);
        });
      }
    },
    removeIndex: function(name, callback) {
      return this.collection().dropIndex(name, callback);
    },
    collection: function() {
      var lib;
      if (!this._collection) {
        lib = this.constructor.lib();
        this._collection = new lib.Collection(this.constructor.database, this.name);
      }
      return this._collection;
    },
    transaction: function(callback) {
      this._transaction = true;
      callback.call(this);
      return this._transaction = false;
    }
  }
};

module.exports = Tower.Store.MongoDB.Database;
