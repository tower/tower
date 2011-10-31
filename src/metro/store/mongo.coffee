# https://github.com/christkv/node-mongodb-native
# http://mongoosejs.com/docs/embedded-documents.html
# https://github.com/1602/jugglingdb/blob/master/lib/adapters/mongoose.js
class Metro.Store.Mongo
  @config:
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
    
  @configure: (options) ->
    _.extend(@config, options)
    
  @env: ->
    @config[Metro.env]
    
  @lib: ->
    require('mongodb')
    
  @initialize: (callback) ->  
    #@collections
    self  = @
    
    unless @database
      env   = @env()
      mongo = @lib()
      new mongo.Db(env.name, new mongo.Server(env.host, env.port, {})).open (error, client) ->
        self.database = client
        
    @database
    
  constructor: (collectionName, options = {}) ->
    @collectionName = collectionName
    
  collection: ->
    @_collection ?= new @lib().Collection(@database, @collectionName)
  
  find: (query, callback) ->
    
  @alias "select", "find"
  
  first: (query, callback) ->
  
  last: (query, callback) ->
  
  all: (query, callback) ->
  
  length: (query, callback) ->
    
  @alias "count", "length"
    
  remove: (query, callback) ->
    
  clear: ->
    
  toArray: ->
    
  create: (record, callback) ->
    @collection().insert(record, callback)
    
  update: (record) ->
    
  destroy: (record) ->
    
  sort: ->
    
module.exports = Metro.Store.Mongo
