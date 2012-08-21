_ = Tower._

# @mixin
Tower.StoreMongodbDatabase =
  ClassMethods:
    info: (callback) ->

    addIndex: (callback) ->
      indexes = @_pendingIndexes ||= []
      indexes.push(callback)

    initialize: (callback) ->
      unless @initialized
        applyIndexes = (done) =>
          indexes = @_pendingIndexes
          applyIndex = (index, next) =>
            index(next)

          if indexes && indexes.length
            Tower.series indexes, applyIndex, done
          else
            done()

        @initialized = true
        
        mongo = @lib()
        env   = @parseEnv()

        new mongo.Db(env.name, new mongo.Server(env.host, env.port, {})).open (error, client) =>
          throw error if error
          if env.username && env.password
            client.authenticate env.username, env.password, (error) =>
              throw error if error
              @database = client
              applyIndexes =>
                callback() if callback
          else
            @database = client

            applyIndexes =>
              callback() if callback

        process.on 'exit', =>
          @database.close() if @database
      else
        callback() if callback

      @database

    # Remove all data from the database
    clean: (callback) ->
      unless @database
        callback.call(@) if callback
        return

      @database.collections (error, collections) =>
        remove = (collection, next) =>
          # console.log 'remove', collection.collectionName
          collection.remove(next)

        Tower.parallel collections, remove, callback

  InstanceMethods:
    addIndex: (name, callback) ->
      if @constructor.initialized
        @collection().ensureIndex(name, callback)
      else
        @constructor.addIndex (callback) =>
          @collection().ensureIndex(name, callback)

    removeIndex: (name, callback) ->
      @collection().dropIndex(name, callback)

    collection: ->
      unless @_collection
        lib = @constructor.lib()
        @_collection = new lib.Collection(@constructor.database, @name)

      @_collection

    transaction: (callback) ->
      @_transaction = true
      callback.call @
      @_transaction = false

module.exports = Tower.StoreMongodbDatabase
