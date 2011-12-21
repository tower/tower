Tower.Store.MongoDB.Configuration =
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
      Tower.Support.Object.mixin(@config, options)
    
    env: ->
      @config[Tower.env]
    
    lib: ->
      @_lib ||= require('mongodb')

module.exports = Tower.Store.MongoDB.Configuration
