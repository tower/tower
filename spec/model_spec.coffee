require './helper'

# You must either "extends X" or create a constructor: -> super
# so that coffeescript generates a callback to the parent class!

class global.User# extends Function
  constructor: -> super
  
  @include Metro.Model
  
  @key "id"
  @key "firstName"
  
  @scope "bySanta", @where(firstName: "=~": "Santa")
  
  @hasMany "posts", className: "Page"
    
  @validates "firstName", presence: true
  
class global.Page extends Metro.Model
  @key "id"
  @key "title"

  @belongsTo "user", className: "User"

describe 'Metro.Model', ->
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
      User.create(id: 3, firstName: "Santa")
      
      expect(User.bySanta.first().firstName).toEqual "Santa"
      
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
      expect(@user.errors()).toEqual [
        { attribute : 'firstName', message : "firstName can't be blank" }
      ]
      
      @user.firstName = "Joe"
      
      expect(@user.validate()).toEqual true
      expect(@user.errors()).toEqual []
      
      @user.firstName = null
      
      expect(@user.validate()).toEqual false
      expect(@user.errors()).toEqual [
        { attribute : 'firstName', message : "firstName can't be blank" }
      ]
  
  describe 'serialization', ->
    beforeEach ->
      @user = new User(firstName: 'Terminator', id: 1)
      
    it 'should serialize to JSON', ->
      expect(@user.toJSON()).toEqual '{"firstName":"Terminator","id":1}'
      
    it 'should unmarshall from JSON', ->
      user = User.fromJSON('{"firstName":"Terminator","id":1}')[0]
      expect(user).toEqual(@user)
  
  describe 'attributes', ->    
    beforeEach ->
      @user = new User(firstName: 'Terminator', id: 1)
      
    it 'should track attribute changes', ->
      expect(@user.changes).toEqual {}
      
      @user.firstName = "T1000"
      
      expect(@user.changes).toEqual firstName: ["Terminator", "T1000"]
      
      @user.firstName = "Smith"
      
      expect(@user.changes).toEqual firstName: ["Terminator", "Smith"]
