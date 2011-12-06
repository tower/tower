require './helper'
###
Metro.Store.MongoDB.initialize()

describe 'Metro.Store', ->
  describe 'mongo', ->
    beforeEach ->
      User.store(new Metro.Store.MongoDB("users"))
      
    afterEach ->
      User.deleteAll()
      User.store(new Metro.Store.Memory)
      
    it 'should have a getter', ->  
      waits 1000
      
      runs ->
        @user = User.create(id: 1, firstName: "Lance")
        User.create(id: 2, firstName: "Dane")
        
      waits 500
      
      runs ->
        expect(@user.firstName).toEqual "Lance"
      
      runs ->
        console.log ""
        process.exit()
        
###