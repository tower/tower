require './helper'

# You must either "extends X" or create a constructor: -> super
# so that coffeescript generates a callback to the parent class!
class global.User# extends Function
  constructor: -> super
  
  @include Metro.Model
  
  @key "first_name"
  
User.key "id"

describe 'Metro.Model', ->
  describe 'scopes', ->
    beforeEach ->
      @user = User.create(id: 1, first_name: "lance")
      
      User.create(id: 2, first_name: "dane")
      
    it 'should have a getter', ->
      expect(@user.first_name).toEqual "lance"
      
    it 'should have where scope', ->
      user = User.where(first_name: "lance").first()
      
      expect(user.first_name).toEqual "lance"
      
      users = User.where(first_name: "=~": "c").all()
      expect(users.length).toEqual 1
      expect(users[0].first_name).toEqual "lance"
      
      users = User.where(first_name: "=~": "a").order("first_name").all()
      expect(users.length).toEqual 2
      expect(users[0].first_name).toEqual "dane"
      
      users = User.where(first_name: "=~": "a").order(["first_name", "desc"]).all()
      expect(users.length).toEqual 2
      expect(users[0].first_name).toEqual "lance"