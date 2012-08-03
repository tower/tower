Tower.StoreMongodbConfiguration =
  ClassMethods:
    supports:
      embed: true

    # Provide some defaults
    # hosts: [ ['127.0.0.1', 27017], ['localhost', 27017] ]
    # hosts: [{host: '127.0.0.1', port: 27017}]
    # read_secondary (if you want to send reads to slaves)
    # @todo
    # You can configure Mongoid to do traditional master/slave replication, where reads get round-robined to the slave databases. All is handled through the mongoid.yml once again.
    # defaults:
    #   host: 'localhost'
    #   slaves: [
    #     {host: 'localhost', port: 27018}
    #     {host: 'localhost', port: 27019}
    #   ]
    config:
      name: 'development'
      port: 27017
      host: '127.0.0.1'

    configure: (options) ->
      _.deepMerge(@config, options)

    parseEnv: ->
      env = @config

      if env.url
        url           = new Tower.NetUrl(env.url)
        env.name      = url.segments[0]
        env.host      = url.hostname
        env.port      = url.port
        env.username  = url.user
        env.password  = url.password

      env

    lib: ->
      require 'mongodb'

module.exports = Tower.StoreMongodbConfiguration
