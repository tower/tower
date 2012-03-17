# https://github.com/mranney/node_redis
# @todo
class Tower.Store.Redis extends Tower.Store
  @lib: ->
    require("redis")
  
  @client: ->
    @_client ?= @lib().createClient()
  
  find: (query, callback) ->  
    
  @alias "select", "find"
  
  first: (query, callback) ->
  
  last: (query, callback) ->
  
  all: (query, callback) ->

  length: (query, callback) ->
  
  @alias "count", "length"
  
  remove: (query, callback) ->
    
  clear: ->
    
  create: (record) ->
    
  update: (record) ->
    
  destroy: (record) ->
    
  sort: ->
    
module.exports = Tower.Store.Redis
