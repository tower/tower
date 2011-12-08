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
        
      waits 500
      
      runs ->
        expect(@user.firstName).toEqual "Lance"
      
      runs ->
        console.log ""
        
    it 'should update a record', ->
      count = 0
      waits 500
      
      runs ->
        @user = User.create(firstName: "Lance")
        
      waits 500
      
      runs ->
        @user.updateAttributes firstName: "Dane"
          
      waits 500
      
      self = @
      
      runs ->
        User.count {}, (error, result) ->
          count = result
        User.all (error, result) ->
          self.user = result[0]
        
      waits 500
      
      runs ->
        expect(count).toEqual 1
        expect(@user.firstName).toEqual "Dane"
        console.log ""
      
    it 'should delete a record', ->
      count = 0
      waits 1000
      
      runs ->
        @user = User.create(firstName: "Lance")
        
      waits 500
      
      runs ->
        User.count {}, (error, result) ->
          count = result
          
      waits 500
      
      runs ->
        expect(count).toEqual 1
        
      runs ->
        @user.destroy()
        
      waits 500
      
      runs ->
        User.count {}, (error, result) ->
          count = result
        
      waits 500
      
      runs ->
        expect(count).toEqual 0
        console.log ""
        quit = true
###