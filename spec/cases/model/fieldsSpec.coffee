require '../../config'

describe 'Tower.Model', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", type: "User"))

  describe 'fields', ->
    beforeEach ->
      User.deleteAll()
      @user = new User(firstName: 'Terminator', id: 1)
      
    it 'should track attribute changes', ->
      expect(@user.changes).toEqual {}
      
      @user.firstName = "T1000"
      
      expect(@user.changes).toEqual firstName: ["Terminator", "T1000"]
      
      @user.firstName = "Smith"
      
      expect(@user.changes).toEqual firstName: ["Terminator", "Smith"]
