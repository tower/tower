require '../../config'

user      = null

describe 'Tower.Model.Persistence', ->
  beforeEach ->
    App.User.store(new Tower.Store.Memory(name: "users", type: "App.User"))

  describe 'create', ->
    beforeEach ->
    
    test 'create with no attributes (missing required attributes)', ->
      App.User.create (error, record) ->
        assert.deepEqual record.errors, { "firstName": ["firstName can't be blank"] }
        
        assert.equal App.User.count(), 0
        
    test 'create with valid attributes', ->
      App.User.create firstName: "Lance", (error, record) ->
        assert.deepEqual record.errors, {}

        assert.equal App.User.count(), 1
        
    test 'create multiple with valid attributes', ->
      attributes = [{firstName: "Lance"}, {firstName: "Dane"}]
      App.User.create attributes, (error, records) ->
        assert.equal records.length, 2
        assert.equal App.User.count(), 2
    
  describe 'update', ->
    beforeEach ->
      user = App.User.create(id: 1, firstName: "Lance")
      App.User.create(id: 2, firstName: "Dane")
      
    test 'update string property', ->
      App.User.update firstName: "John", instantiate: false, (error) =>
        App.User.all (error, users) =>
          assert.equal users.length, 2
          for user in users
            assert.equal user.get("firstName"), "John"
      
    test 'update matching string property', ->
      App.User.where(firstName: "Lance").update firstName: "John", instantiate: false, (error) =>
        assert.equal App.User.where(firstName: "John").count(), 1
        
  describe '#update', ->
    beforeEach ->
      user = App.User.create(id: 1, firstName: "Lance")
      App.User.create(id: 2, firstName: "Dane")
      
    test 'update string property with updateAttributes', ->
      user.updateAttributes firstName: "John", (error) =>
        assert.equal user.get("firstName"), "John"
        assert.equal user.changes, {}
    
    test 'update string property with save', ->
      user.set "firstName", "John"
      user.save (error) =>
        assert.equal user.get("firstName"), "John"
        assert.equal user.changes, {}
  
  describe 'destroy', ->
    beforeEach ->
      user = App.User.create(id: 1, firstName: "Lance!!!")
      App.User.create(id: 2, firstName: "Dane")
      
    test 'destroy all', ->
      assert.equal App.User.count(), 2
      
      App.User.destroy()
      
      assert.equal App.User.count(), 0
      
    test 'destroy matching', ->
      assert.equal App.User.count(), 2
      
      App.User.where(firstName: "Dane").destroy()
      
      assert.equal App.User.count(), 1