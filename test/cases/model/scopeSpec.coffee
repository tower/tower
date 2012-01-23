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
    expect(user.get('firstName')).toEqual "Lance"
    
  it 'should have where scope', ->
    user = User.where(firstName: "Lance").first()
    
    expect(user.firstName).toEqual "Lance"
    users = User.where(firstName: "=~": "c").all()
    expect(users.length).toEqual 1
    expect(users[0].firstName).toEqual "Lance"
    
    users = User.where(firstName: "=~": "a").order("firstName").all()
    expect(users.length).toEqual 2
    expect(users[0].firstName).toEqual "Dane"
    
    users = User.where(firstName: "=~": "a").order("firstName", "desc").all()
    expect(users.length).toEqual 2
    expect(users[0].firstName).toEqual "Lance"
  
  it 'should have named scopes', ->  
    User.create(id: 3, firstName: "Baldwin")
    
    expect(User.byBaldwin.first().firstName).toEqual "Baldwin"

  describe '#find', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "find"
      scope.find 1, 2, 3
      
      expect(scope.store.find).toHaveBeenCalledWith {id: $in: [1, 2, 3]}, {  }, undefined
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "find"
      scope.find [1, 2, 3]
      
      expect(scope.store.find).toHaveBeenCalledWith {id: $in: [1, 2, 3]}, {  }, undefined
      
    test '`[1, 2, 3], callback`', ->
      callback = ->
      
      spyOn scope.store, "find"
      scope.find [1, 2, 3], callback
      
      expect(scope.store.find).toHaveBeenCalledWith {id: $in: [1, 2, 3]}, {  }, callback
      
    #test 'where(id: $in: [1, 2, 3]).find(1) should only pass id: $in: [1]', ->
    #  spyOn scope.store, "find"
    #  scope.where(id: $in: [1, 2, 3]).find(1)
    #  
    #  expect(scope.store.find).toHaveBeenCalledWith {id: $in: [1]}, {  }, undefined
      
  describe '#update', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "update"
      scope.update 1, 2, 3, {firstName: "Lance"}, instantiate: false
      
      expect(scope.store.update).toHaveBeenCalledWith { firstName : 'Lance' }, { id : { $in : [ 1, 2, 3 ] } }, {  }, undefined 
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "update"
      scope.update 1, 2, 3, {firstName: "Lance"}, instantiate: false

      expect(scope.store.update).toHaveBeenCalledWith { firstName : 'Lance' }, { id : { $in : [ 1, 2, 3 ] } }, {  }, undefined 
      
  describe '#destroy', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "destroy"
      scope.destroy 1, 2, 3, instantiate: false
      
      expect(scope.store.destroy).toHaveBeenCalledWith { id : { $in : [ 1, 2, 3 ] } }, {  }, undefined 
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "destroy"
      scope.destroy 1, 2, 3, instantiate: false
      
      expect(scope.store.destroy).toHaveBeenCalledWith  { id : { $in : [ 1, 2, 3 ] } }, {  }, undefined 
      
    test 'query + ids', ->
      spyOn scope.store, "destroy"
      scope.where(firstName: "John").destroy 1, 2, 3, instantiate: false
      
      expect(scope.store.destroy).toHaveBeenCalledWith  { firstName: "John", id : { $in : [ 1, 2, 3 ] } }, {  }, undefined
      
  describe '#create', ->
    test 'create(firstName: "Lance!")', ->
      spyOn scope.store, "create"
      scope.create(firstName: "Lance!")
      
      expect(scope.store.create).toHaveBeenCalledWith { firstName: "Lance!" }, {  }, undefined
      
    test 'where(firstName: "Lance").create()', ->
      spyOn scope.store, "create"
      scope.where(firstName: "Lance").create()
      
      expect(scope.store.create).toHaveBeenCalledWith { firstName: "Lance" }, {  }, undefined
      
    test 'create with an `id`', ->
      spyOn scope.store, "create"
      scope.create id: "something"

      expect(scope.store.create).toHaveBeenCalledWith { id: "something" }, {  }, undefined
      
  test '#clone', ->
    clone = scope.where(firstName: "Lance")
    clone2 = clone.where(email: "example@gmail.com")
    
    expect(clone.criteria.query).toNotEqual scope.criteria.query
    expect(clone2.criteria.query).toEqual firstName: "Lance", email: "example@gmail.com"
    expect(clone.criteria.query).toEqual firstName: "Lance"
    expect(scope.criteria.query).toEqual {}
