Metro.Store.MongoDB.Serialization =  
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
              encoder
    else
      value
  
  encodeString: (value) ->
   
  decodeString: (value) ->
   
  encodeOrder: (value) ->
   
  decodeOrder: (value) ->
   
  encodeDate: (value) ->
   
  decodeDate: (value) ->

module.exports = Metro.Store.MongoDB.Serialization
