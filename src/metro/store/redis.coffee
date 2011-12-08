# https://github.com/mranney/node_redis
class Metro.Store.Redis extends Metro.Object
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
    
module.exports = Metro.Store.Redis
