# https://github.com/christkv/node-mongodb-native
# http://mongoosejs.com/docs/embedded-documents.html
# https://github.com/1602/jugglingdb/blob/master/lib/adapters/mongoose.js
class Metro.Store.MongoDB extends Metro.Object
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
    Metro.Support.Object.mixin(@config, options)
    
  @env: ->
    @config[Metro.env]
    
  @lib: ->
    @_lib ||= require('mongodb')
    
  @initialize: (callback) ->
    self  = @
    
    unless @database
      env   = @env()
      mongo = @lib()
      
      new mongo.Db(env.name, new mongo.Server(env.host, env.port, {})).open (error, client) ->
        throw error if error
        self.database = client
        
        callback() if callback
        
      process.on "exit", ->
        self.database.close() if self.database
        
    @database
    
  constructor: (collectionName, options = {}) ->
    @collectionName = collectionName
    
  collection: ->
    unless @_collection
      lib = @constructor.lib()
      @_collection = new lib.Collection(@constructor.database, @collectionName)
    
    @_collection
  
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
    self = @
    
    @collection().insert record.attributes, (error, docs) ->
      throw error if error
      record["_id"] = docs[0]["_id"]
      callback.call(self, error, docs) if callback
    
    record
    
  update: (record) ->
    
  destroy: (record) ->
    
  sort: ->
    
  _translateQuery: (query) ->
    result = {}
    result["_id"] = query.id if query.id
    for key, value of query
      @
  
  matches: (record, query) ->
    self    = @
    success = true
    
    for key, value of query
      continue if !!Metro.Store.reservedOperators[key]
      recordValue = record[key]
      if typeof(value) == 'object'
        success = self._matchesOperators(record, recordValue, value)
      else
        value = value.call(record) if typeof(value) == "function"
        success = recordValue == value
      return false unless success
    
    true
  
  generateId: ->
    @lastId++
    
  _matchesOperators: (record, recordValue, operators) ->
    success = true
    self    = @
    
    for key, value of operators
      if operator = Metro.Store.queryOperators[key]
        value = value.call(record) if typeof(value) == "function"
        switch operator
          when "gt"
            success = self._isGreaterThan(recordValue, value)
          when "gte"
            success = self._isGreaterThanOrEqualTo(recordValue, value)
          when "lt"
            success = self._isLessThan(recordValue, value)
          when "lte"
            success = self._isLessThanOrEqualTo(recordValue, value)
          when "eq"
            success = self._isEqualTo(recordValue, value)
          when "neq"
            success = self._isNotEqualTo(recordValue, value)
          when "m"
            success = self._isMatchOf(recordValue, value)
          when "nm"
            success = self._isNotMatchOf(recordValue, value)
          when "any"
            success = self._anyIn(recordValue, value)
          when "all"
            success = self._allIn(recordValue, value)
        return false unless success
      else
        return recordValue == operators
    
    true
    
module.exports = Metro.Store.MongoDB
