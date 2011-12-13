# https://github.com/christkv/node-mongodb-native
# http://mongoosejs.com/docs/embedded-documents.html
# https://github.com/1602/jugglingdb/blob/master/lib/adapters/mongoose.js
class Metro.Store.MongoDB extends Metro.Store
  class @Serializer
    
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
      
      if env.url
        url = new Metro.Net.Url(env.url)
        env.name      = url.segments[0] || url.user
        env.host      = url.hostname
        env.port      = url.port
        env.username  = url.user
        env.password  = url.password
      
      new mongo.Db(env.name, new mongo.Server(env.host, env.port, {})).open (error, client) ->
        throw error if error
        if env.username && env.password
          client.authenticate env.username, env.password, (error) ->
            throw error if error
            self.database = client
            callback() if callback
        else
          self.database = client
          callback() if callback
        
      process.on "exit", ->
        self.database.close() if self.database
        
    @database
    
  collection: ->
    unless @_collection
      lib = @constructor.lib()
      @_collection = new lib.Collection(@constructor.database, @name)
    
    @_collection
  
  length: (query, callback) ->
    @collection().count (error, result) ->
      callback.call @, error, result
    @
    
  @alias "count", "length"
    
  remove: (query, callback) ->
    
  removeAll: (callback) ->
    @collection().remove (error) ->
      callback.call(@, error) if callback
    
  @alias "clear", "removeAll"
  @alias "deleteAll", "deleteAll"
    
  update: (query, attributes, options, callback) ->
    if typeof options == 'function'
      callback = options
      options = {}
    else if !options
      options = {}
      
    options.safe    = false
    options.upsert  = false
    
    @collection().update @_translateQuery(query), "$set": attributes, options, (error, docs) ->
      throw error if error
      callback.call(@, error, docs) if callback
      
    @
    
  destroy: (query, callback) ->
    @collection().remove @_translateQuery(query), (error) ->
      callback.call(@, error) if callback
      
    @
    
  sort: ->
  
  # tags: [1, 2] == $set: tags: [1, 2]
  # createdAt: Date == $set: createdAt: mongodate
  _serializeAttributes: (attributes) ->
    set = {}
    
    for key, value of attributes
      if @_atomicOperator(key)
        attributes[key] = @_serializeAttributes(value)
      else
        set[key]        = @_serializeAttribute(key, value)
    
    attributes["$set"] = Metro.Support.Object.extend(attributes["$set"], set)
    
    attributes
        
  _serializeAttribute: (key, value) ->
    switch @owner.attributeType(key)
      when "string"
        value.toString()
      when "integer"
        parseInt(value)
      when "float"
        parseFloat(value)
      when "date", "time"
        value
      when "array"
        value
      when "id"
        @serializeId value
      else
        value
        
  _serializeAssociation: ->
      
  # to mongo
  serializeId: (value) ->
    @constructor.database.bson_serializer.ObjectID(value.toString())
  
  # from mongo
  deserializeId: (value) ->
    value.toString()
    
  serializeDate: (value) ->
    value
    
  deserializeDate: (value) ->
    value
    
  serializeArray: (value) ->
    
  deserializeArray: (value) ->
    
  # tags: $in: ["javascript"]
  # id: $in: ['1', '2']
  # id: 1
  serializeQueryAttributes: (query) ->
    result      = {}
    schema      = @schema()
    result[key] = @serializeQueryAttribute(key, value, schema) for key, value of query
    
    result
    
  serializeQueryAttribute: (key, value, schema) ->
    encoder   = @["encode#{schema[key].type}"] if schema[key]
    if encoder
      if typeof value == "object"
        for _key, _value of value
          if @arrayOperator(_key)
            for item in _value
              if encoder
    else
      value
  
  findOne: (query, options, callback) ->
    options.limit = 1
    @collection().findOne @_translateQuery(query), options,  (error, doc) ->
      doc = self.serializeAttributes(doc) unless error
      callback.call(@, error, doc)
    @
  
  # all()  
  # all(title: "Title")
  # all({title: "Title"}, {safe: true})
  # all({title: "Title"}, {safe: true}, (error, records) ->)
  # You can only do the last one!
  all: (query, options, callback) ->
    self    = @
    
    @collection().find(@_translateQuery(query), options).toArray (error, docs) ->
      unless error
        for doc in docs
          doc.id = doc["_id"]
          delete doc["_id"]
        docs = self.serialize(docs)
      
      callback.call(@, error, docs)
    
    @
  
  create: (attributes, query, options, callback) ->
    self    = @
    record  = @serializeAttributes(attributes)
    
    @collection().insert attributes, (error, docs) ->
      doc                   = docs[0]
      record.id  = doc["_id"]
      callback.call(@, error, record) if callback
    
    record.id = attributes["_id"]
    delete attributes["_id"]
    
    record
    
  update: (ids..., updates, query, options, callback) ->
    @store().update(ids..., updates, callback)
    
  updateAll: (updates, query, options, callback) ->
    @store().updateAll(updates, callback)

  delete: (ids..., query, options, callback)->
    @store().delete(ids..., callback)

  deleteAll: (query, options, callback) ->
    @store().deleteAll(ids..., callback)
    
  destroy: (ids..., query, options, callback) ->
    @store().destroy(ids..., callback)
    
  destroyAll: (query, options, callback) ->
    @store().destroy(ids..., callback)
    
  encodeString: (value) ->
   
  decodeString: (value) ->
   
  encodeOrder: (value) ->
   
  decodeOrder: (value) ->
   
  encodeDate: (value) ->
   
  decodeDate: (value) ->
    
module.exports = Metro.Store.MongoDB
