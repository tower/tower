# https://github.com/mranney/node_redis
# @todo
class Tower.Store.Redis extends Tower.Store
  @lib: ->
    require("redis")

  @client: ->
    @_client ?= @lib().createClient()

module.exports = Tower.Store.Redis
