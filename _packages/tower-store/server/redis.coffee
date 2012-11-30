# https://github.com/mranney/node_redis
# @todo
class Tower.StoreRedis extends Tower.Store
  @reopenClass
    lib: ->
      require("redis")

    client: ->
      @_client ?= @lib().createClient()

module.exports = Tower.StoreRedis
