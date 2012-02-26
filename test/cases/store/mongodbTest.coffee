###
require '../../config'

scope   = null
user    = null
quit    = false
ini     = false

describe 'Tower.Store.MongoDB', ->
  beforeEach ->
    User.store(new Tower.Store.MongoDB(name: "users", type: "User"))
    #User.store.database.close() if User.store.database
    #Tower.Store.MongoDB.initialize()
    
    scope   = User
    
  afterEach ->
    scope._store.constructor.database.close() if quit
    scope = null
  
  describe '#create', ->
    test 'with attributes', (done) ->
      spyOn scope._store, "create"
      scope.create name: "Lance"
      expect(scope._store.create).toHaveBeenCalledWith {name: "Lance"}, {}, undefined
        
    test '#serializeAttributesForCreate', (done) ->
      _attributes = name: "Joe"
      _options    = {}
      attributes  = scope._store.serializeAttributesForCreate(_attributes)
      options     = scope._store.serializeOptions(_options)
      
      expect(attributes).toEqual name: "Joe"
      
  describe '#update', ->
    test '#serializing', (done) ->
      updates         = scope._store.serializeAttributesForUpdate(name: "John", $pushAll: tags: ["a", "b"])
      query           = scope._store.serializeQuery(id: $in: [1, 2, 3])
      
      expect(updates).toEqual "$set": { name: "John" }, "$pushAll": { tags : [ 'a', 'b' ] }
      expect(query).toEqual _id: $in: [1, 2, 3]
      
      done()
  
    test '{ $push : { field : value }', (done) ->
      updates         = scope._store.serializeAttributesForUpdate($push: tags: ["a"])
      
      expect(updates).toEqual $push: tags: ["a"]
      
      done()
      
    test '{ $inc : { field : value } }'
    
    test '{ $set : { field : value } }'
    
    test '{ $unset : { field : 1} }'
    
    test '{ $push : { field : value } }'
    
    test '{ $pushAll : { field : valueArray } }'
    
    test '{ $addToSet : { field : value } }'
    
    test '{ $pop : { field : 1  } }'
    
    test '{ $pop : { field : -1  } }'
    
    test '{ $pull : { field : _value } }'
    
    test '{ $pullAll : { field : value_array } }'
    
###