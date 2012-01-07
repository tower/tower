require '../config'

scope   = null
user    = null

describe 'Tower.Model.Relation.Scope', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", type: "User"))
    user    = new User(id: 10)
    scope   = user.posts()
    
  afterEach ->
    scope = null
  
  describe '#find', ->
    test '`1, 2, 3`', ->
      spyOn scope.store, "find"
      scope.find 1, 2, 3
      
      expect(scope.store.find).toHaveBeenCalledWith {userId: 10, id: $in: [1, 2, 3]}, {}, undefined
      
    test '`[1, 2, 3]`', ->
      spyOn scope.store, "find"
      scope.find [1, 2, 3]
      
      expect(scope.store.find).toHaveBeenCalledWith {userId: 10, id: $in: [1, 2, 3]}, {}, undefined