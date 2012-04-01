Tower.Store.MongoDB.Configuration =
  ClassMethods:
    supports:
      embed: true

    config:
      development:
        name: "tower-development"
        port: 27017
        host: "127.0.0.1"
      test:
        name: "tower-test"
        port: 27017
        host: "127.0.0.1"
      staging:
        name: "tower-staging"
        port: 27017
        host: "127.0.0.1"
      production:
        name: "tower-production"
        port: 27017
        host: "127.0.0.1"

    configure: (options) ->
      _.deepMerge(@config, options)

    env: ->
      @config[Tower.env]

    lib: ->
      require 'mongodb'

module.exports = Tower.Store.MongoDB.Configuration
