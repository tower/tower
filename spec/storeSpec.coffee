require './helper'
###
Metro.Store.MongoDB.initialize()
quit = false

describe 'Metro.Store', ->
  beforeEach ->
    User.store(new Metro.Store.MongoDB(name: "users", className: "User"))
  
  afterEach ->
    User.store(new Metro.Store.Memory(name: "users", className: "User"))

  describe 'mongo', ->
    afterEach ->
      User.deleteAll()
      #process.exit() if quit
      Metro.Store.MongoDB.database.close() if quit
      
    it 'should have a getter', ->  
      waits 1000
      
      runs ->
        @user = User.create(firstName: "Lance")
        User.create(firstName: "Dane")
        
      waits 200
      
      runs ->
        expect(@user.firstName).toEqual "Lance"
      
      runs ->
        console.log ""
        
    #it 'should update a record', ->
    #  count = 0
    #  waits 200
    #  
    #  runs ->
    #    @user = User.create(firstName: "Lance")
    #    
    #  waits 200
    #  
    #  runs ->
    #    @user.updateAttributes firstName: "Dane"
    #      
    #  waits 200
    #  
    #  self = @
    #  
    #  runs ->
    #    User.count (error, result) ->
    #      count = result
    #    User.all (error, result) ->
    #      self.user = result[0]
    #    
    #  waits 200
    #  
    #  runs ->
    #    expect(count).toEqual 1
    #    expect(@user.firstName).toEqual "Dane"
    #    console.log ""
      
    it 'should delete a record', ->
      count = 0
      waits 1000
      
      runs ->
        @user = User.create(firstName: "Lance")
        
      waits 200
      
      runs ->
        User.count (error, result) ->
          count = result
          
      waits 200
      
      runs ->
        expect(count).toEqual 1
        
      runs ->
        @user.destroy()
        
      waits 200
      
      runs ->
        User.count (error, result) ->
          count = result
        
      waits 200
      
      runs ->
        expect(count).toEqual 0

    it 'should find records', ->
      user  = null
      users = null
      
      runs ->
        User.create(firstName: "Lance", likes: 10)
        User.create(firstName: "Dane", likes: 20)
        
      waits 300
      
      runs ->
        User.where(firstName: "=~": /D/).where(likes: ">=": 20).limit(2).all (error, records) ->
          users = records
        User.where(firstName: "=~": "L").last (error, record) ->
          user = record
          
      waits 300
      
      runs ->
        expect(user.firstName).toEqual "Lance"
      
    it 'should update records', ->
      user  = null
      
      runs ->
        User.create(firstName: "Lance", likes: 10)
        Post.create(title: "A Post!")
        
      waits 300
      
      runs ->
        User.where(firstName: "=~": "L").last (error, record) ->
          user = record
          user.firstName  = "John"
          user.tags       = ["one"]
          user.save()
          user = null
          
        Post.where(title: /Post/).first (error, record) ->
          post = record
          
      waits 400
      
      runs ->
        User.where(firstName: "=~": "J").last (error, record) ->
          user = record
      
      waits 300
      
      runs ->
        expect(user.firstName).toEqual "John"
        expect(user.tags).toEqual ["one"]
        console.log ""
        quit = true
###