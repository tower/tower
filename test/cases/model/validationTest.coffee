require '../../config'

scope     = null
criteria  = null
user      = null

describeWith = (store) ->
  describe "Tower.Model.Validation (Tower.Store.#{store.constructor.name})", ->
    beforeEach (done) ->
      App.User.store(store)
      user = new App.User(id: 1)
      
      done()
    
    it 'should be invalid', ->
      assert.deepEqual user.validate(), false
      
      assert.deepEqual user.errors, { 'firstName' : ["firstName can't be blank"] }
    
      user.set "firstName", "Joe"
    
      assert.deepEqual user.validate(), true
      assert.deepEqual user.errors, []
      
      user.set "firstName", null
    
      assert.deepEqual user.validate(), false
    
      assert.deepEqual user.errors, { 'firstName' : ["firstName can't be blank"] }
  
    it 'should validate from attribute definition', ->
      page = new App.Page(title: "A App.Page")
      
      assert.deepEqual page.validate(), false
      assert.deepEqual page.errors, { 'rating': ['rating must be a minimum of 0', 'rating must be a maximum of 10' ] }
    
      page.set "rating", 10
    
      assert.deepEqual page.validate(), true
      assert.deepEqual page.errors, []

    describe 'length, min, max', ->
    
describeWith(new Tower.Store.Memory(name: "users", type: "App.User"))
#describeWith(new Tower.Store.MongoDB(name: "users", type: "App.User"))