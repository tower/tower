require '../../config'

scope     = null
criteria  = null
user      = null

describe 'Tower.Model.Validation', ->
  beforeEach ->
    App.User.store(new Tower.Store.Memory(name: "users", type: "App.User"))
    user = new App.User(id: 1)
  
  it 'should be invalid', ->
    assert.deepEqual user.validate(), false
    
    assert.deepEqual user.errors, { 'firstName' : ["firstName can't be blank"] }
    
    user.firstName = "Joe"
    
    assert.deepEqual user.validate(), true
    assert.deepEqual user.errors, []
    
    user.firstName = null
    
    assert.deepEqual user.validate(), false
    
    assert.deepEqual user.errors, { 'firstName' : ["firstName can't be blank"] }
  
  it 'should validate from attribute definition', ->
    page = new App.Page(title: "A App.Page")
    
    assert.deepEqual page.validate(), false
    assert.deepEqual page.errors, { 'rating': ['rating must be a minimum of 0', 'rating must be a maximum of 10' ] }
    
    page.rating = 10
    
    assert.deepEqual page.validate(), true
    assert.deepEqual page.errors, []

  describe 'length, min, max', ->