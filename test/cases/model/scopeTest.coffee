require '../../config'

scope     = null
criteria  = null
user      = null

describe 'Tower.Model.Scope', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(firstName: "users", type: "User"))
    scope = User.scoped()
    user = User.create(id: 1, firstName: "Lance")
    User.create(id: 2, firstName: "Dane")
    
  afterEach ->
    scope = null
    
  test 'should have a getter', ->
    assert.deepEqual user.get('firstName'), "Lance"
    
  it 'should have where scope', ->
    user = User.where(firstName: "Lance").first()
    
    assert.deepEqual user.firstName, "Lance"
    users = User.where(firstName: "=~": "c").all()
    assert.deepEqual users.length, 1
    assert.deepEqual users[0].firstName, "Lance"
    
    users = User.where(firstName: "=~": "a").order("firstName").all()
    assert.deepEqual users.length, 2
    assert.deepEqual users[0].firstName, "Dane"
    
    users = User.where(firstName: "=~": "a").order("firstName", "desc").all()
    assert.deepEqual users.length, 2
    assert.deepEqual users[0].firstName, "Lance"
  
  it 'should have named scopes', ->  
    User.create(id: 3, firstName: "Baldwin")
    
    assert.deepEqual User.byBaldwin.first().firstName, "Baldwin"

  describe '#find', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "find"
      scope.find 1, 2, 3
      
      assert.deepEqual scope.store.find).toHaveBeenCalledWith {id: $in: [1, 2, 3]}, {  }, null
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "find"
      scope.find [1, 2, 3]
      
      assert.deepEqual scope.store.find).toHaveBeenCalledWith {id: $in: [1, 2, 3]}, {  }, null
      
    test '`[1, 2, 3], callback`', ->
      callback = ->
      
      spyOn scope.store, "find"
      scope.find [1, 2, 3], callback
      
      assert.deepEqual scope.store.find).toHaveBeenCalledWith {id: $in: [1, 2, 3]}, {  }, callback
      
    #test 'where(id: $in: [1, 2, 3]).find(1) should only pass id: $in: [1]', ->
    #  spyOn scope.store, "find"
    #  scope.where(id: $in: [1, 2, 3]).find(1)
    #  
    #  assert.deepEqual scope.store.find).toHaveBeenCalledWith {id: $in: [1]}, {  }, null
      
  describe '#update', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "update"
      scope.update 1, 2, 3, {firstName: "Lance"}, instantiate: false
      
      assert.deepEqual scope.store.update).toHaveBeenCalledWith { firstName : 'Lance' }, { id : { $in : [ 1, 2, 3 ] } }, {  }, null 
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "update"
      scope.update 1, 2, 3, {firstName: "Lance"}, instantiate: false

      assert.deepEqual scope.store.update).toHaveBeenCalledWith { firstName : 'Lance' }, { id : { $in : [ 1, 2, 3 ] } }, {  }, null 
      
  describe '#destroy', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "destroy"
      scope.destroy 1, 2, 3, instantiate: false
      
      assert.deepEqual scope.store.destroy).toHaveBeenCalledWith { id : { $in : [ 1, 2, 3 ] } }, {  }, null 
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "destroy"
      scope.destroy 1, 2, 3, instantiate: false
      
      assert.deepEqual scope.store.destroy).toHaveBeenCalledWith  { id : { $in : [ 1, 2, 3 ] } }, {  }, null 
      
    test 'query + ids', ->
      spyOn scope.store, "destroy"
      scope.where(firstName: "John").destroy 1, 2, 3, instantiate: false
      
      assert.deepEqual scope.store.destroy).toHaveBeenCalledWith  { firstName: "John", id : { $in : [ 1, 2, 3 ] } }, {  }, null
      
  describe '#create', ->
    test 'build(firstName: "Lance!")', ->
      spyOn scope, "build"
      
      scope.create(firstName: "Lance!")
      
      assert.deepEqual scope.build).toHaveBeenCalledWith(
        { firstName: "Lance!" }
      )
      
    test 'create(firstName: "Lantial")', ->
      spyOn scope.store, "create"
      
      scope.create(firstName: "Lantial")
      
      args = scope.store.create.argsForCall[0]
      
      assert.deepEqual args[0].attributes, { id: undefined, firstName : 'Lantial', createdAt : new Date, updatedAt : new Date, likes : 0, tags : [  ], postIds : [  ] }
      assert.deepEqual args[1], { instantiate: false }
      
    test 'create(firstName: "Lantial")', ->
      scope.create(firstName: "Lantial")
      
      assert.deepEqual User.count(), 3
      
  test '#clone', ->
    clone = scope.where(firstName: "Lance")
    clone2 = clone.where(email: "example@gmail.com")
    
    assert.deepEqual clone.criteria.conditions()).toNotEqual scope.criteria.query
    assert.deepEqual clone2.criteria.conditions(), firstName: "Lance", email: "example@gmail.com"
    assert.deepEqual clone.criteria.conditions(), firstName: "Lance"
    assert.deepEqual scope.criteria.conditions(), {}
