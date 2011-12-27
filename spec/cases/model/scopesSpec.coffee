require '../../config'

describe 'Tower.Model', ->
  beforeEach ->
    User.store(new Tower.Store.Memory(name: "users", className: "TowerSpecApp.User"))
  
  describe 'scopes', ->
    afterEach ->
      User.deleteAll()
      
    beforeEach ->
      @user = User.create(id: 1, firstName: "Lance")
      User.create(id: 2, firstName: "Dane")

    it 'should have a getter', ->
      expect(@user.firstName).toEqual "Lance"
      
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
