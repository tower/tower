Tower.Store.Mongodb.Configuration =
  ClassMethods:
    supports:
      embed: true

    # Provide some defaults
    config:
      name: "development"
      port: 27017
      host: "127.0.0.1"

    configure: (options) ->
      _.deepMerge(@config, options)

    env: ->
      @config

    lib: ->
      require 'mongodb'


module.exports = Tower.Store.Mongodb.Configuration
