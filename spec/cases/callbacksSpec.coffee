require '../config'

scope  = null

describe 'Tower.Model.Callbacks', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", type: "User"))
    scope = User.scoped()
    
  afterEach ->
    scope = null
    
  describe '#before', ->
    test 'existence', ->
      expect(User.callbacks().create.before[0].method).toEqual 'setCreatedAt'
    
    test 'called', ->
      user = User.create(firstName: "Lance")
      expect(user.get('createdAt')).toEqual new Date
      