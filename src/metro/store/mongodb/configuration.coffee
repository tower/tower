Metro.Store.MongoDB.Configuration =
  ClassMethods:
    config:
      development:
        name: "metro-development"
        port: 27017
        host: "127.0.0.1"
      test:
        name: "metro-test"
        port: 27017
        host: "127.0.0.1"
      staging:
        name: "metro-staging"
        port: 27017
        host: "127.0.0.1"
      production:
        name: "metro-production"
        port: 27017
        host: "127.0.0.1"
    
    configure: (options) ->
      Metro.Support.Object.mixin(@config, options)
    
    env: ->
      @config[Metro.env]
    
    lib: ->
      @_lib ||= require('mongodb')

module.exports = Metro.Store.MongoDB.Configuration
