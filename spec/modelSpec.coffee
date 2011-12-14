require './helper'

describe 'Metro.Model', ->
  beforeEach ->
    User.store(new Metro.Store.Memory(name: "users", className: "MetroSpecApp.User"))
  
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
      
      users = User.where(firstName: "=~": "a").order(["firstName", "desc"]).all()
      expect(users.length).toEqual 2
      expect(users[0].firstName).toEqual "Lance"
    
    it 'should have named scopes', ->  
      User.create(id: 3, firstName: "Baldwin")
      
      expect(User.byBaldwin.first().firstName).toEqual "Baldwin"

  describe 'associations', ->
    beforeEach ->
      @user = User.create(id: 1, firstName: "Lance")
      @post = Page.create(id: 1, title: "First Post", userId: @user.id)
      
    afterEach ->
      User.deleteAll()
      Page.deleteAll()
      
    it 'should associate', ->
      posts = @user.posts.where(title: "=~": "First").all()
      expect(posts.length).toEqual 1
      
      posts = @user.posts.where(title: "=~": "first").all()
      expect(posts.length).toEqual 0
      
  describe 'validations', ->
    beforeEach ->
      @user = new User(id: 1)
    
    it 'should be invalid', ->
      expect(@user.validate()).toEqual false
      
      expect(@user.errors).toEqual [
        { attribute : 'firstName', message : "firstName can't be blank" }
      ]
      
      @user.firstName = "Joe"
      
      expect(@user.validate()).toEqual true
      expect(@user.errors).toEqual []
      
      @user.firstName = null
      
      expect(@user.validate()).toEqual false
      expect(@user.errors).toEqual [
        { attribute : 'firstName', message : "firstName can't be blank" }
      ]
    
    it 'should validate from attribute definition', ->
      page = new Page(title: "A Page")
      
      expect(page.validate()).toEqual false
      expect(page.errors).toEqual [
        { attribute : 'rating', message : 'rating must be a minimum of 0' }, 
        { attribute : 'rating', message : 'rating must be a maximum of 10' }
      ]
      
      page.rating = 10
      
      expect(page.validate()).toEqual true
      expect(page.errors).toEqual []

  describe 'serialization', ->
    beforeEach ->
      User.deleteAll()
      @user = new User(firstName: 'Terminator', id: 1)
      
    it 'should serialize to JSON', ->
      expected = '{"firstName":"Terminator","id":1,"createdAt":'
      expected += JSON.stringify(new Date)
      expected += ',"postIds":[]}'
      expect(@user.toJSON()).toEqual expected
      
    it 'should unmarshall from JSON', ->
      user = User.fromJSON('{"firstName":"Terminator","id":1}')[0]
      expect(user).toEqual(@user)

  describe 'attributes', ->
    beforeEach ->
      User.deleteAll()
      @user = new User(firstName: 'Terminator', id: 1)
      
    it 'should track attribute changes', ->
      expect(@user.changes).toEqual {}
      
      @user.firstName = "T1000"
      
      expect(@user.changes).toEqual firstName: ["Terminator", "T1000"]
      
      @user.firstName = "Smith"
      
      expect(@user.changes).toEqual firstName: ["Terminator", "Smith"]

  describe 'type', ->
    beforeEach ->
      User.deleteAll()
      User.create(firstName: 'Terminator', id: 1, createdAt: new Date())
      User.create(firstName: 'Terminator 2', id: 2, createdAt: require('moment')().subtract('days', 20))
      User.create(firstName: 'Terminator 3', id: 3, createdAt: new Date())
    
    it 'should have scoped by type', ->
      expect(User.thisWeek.all().length).toEqual 2
      
    it 'should have a default', ->
      expect((new User).createdAt).toEqual new Date

  describe 'creating associations', ->
    beforeEach ->
      User.deleteAll()
      @user = User.create(firstName: 'Terminator', id: 1)
      
    it 'should create a post from a user', ->
      post = @user.posts.create()
      expect(post.userId).toEqual 1
      expect(post.title).toBeFalsy()
      
      post = @user.posts.create(title: "A Post!")
      expect(post.userId).toEqual 1
      expect(post.title).toEqual "A Post!"
      
      expect(Page.count()).toEqual 2
      expect(@user.postIds).toEqual [0, 1]
      
      @user.updateAttributes "$pull": "postIds": [0]
      expect(@user.postIds).toEqual [1]
      
    it 'should build a post', ->
      post = @user.posts.build()
      expect(post.userId).toEqual 1
      expect(post.id).toBeFalsy()
      
    it 'should build a user from a post', ->
      post = Page.create(title: "Something")
      user = post.buildUser(firstName: "Santa")
      
      expect(user.firstName).toEqual "Santa"
      expect(user.postIds).toEqual [1]
      expect(user.id).toBeFalsy()
      
    it 'should create a user from a post', ->
      post = Page.create(title: "Something")
      user = post.createUser(firstName: "Santa")
      
      expect(user.firstName).toEqual "Santa"
      expect(user.postIds).toEqual [1]
      expect(user.id).toEqual 0
      
      expect(post.user).toEqual user