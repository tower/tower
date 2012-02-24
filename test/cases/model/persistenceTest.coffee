require '../../config'

user      = null

describeWith = (store) ->
  describe "Tower.Model.Persistence (Tower.Store.#{store.constructor.name})", ->
    beforeEach (done) ->
      App.User.store(store)
    
      done()
    
    describe 'create', ->
      test 'create with no attributes (missing required attributes)', (done) ->
        App.User.create (error, record) =>
          assert.deepEqual record.errors, { "firstName": ["firstName can't be blank"] }
          
          App.User.count (error, count) =>
            assert.equal count, 0
          
            done()
        
      test 'create with valid attributes', (done) ->
        App.User.create firstName: "Lance", (error, record) =>
          assert.deepEqual record.errors, {}
          
          App.User.create (error, count) =>
            assert.equal count, 1
            
            done()
      
      test 'create multiple with valid attributes', (done) ->
        attributes = [{firstName: "Lance"}, {firstName: "Dane"}]
        
        App.User.create attributes, (error, records) =>
          assert.equal records.length, 2
          
          App.User.count (error, count) =>
            assert.equal count, 2
        
            done()
    
    describe 'update', ->
      beforeEach (done) ->
        user = App.User.create(id: 1, firstName: "Lance")
        App.User.create(id: 2, firstName: "Dane")
      
        done()
      
      test 'update string property', (done) ->
        App.User.update firstName: "John", instantiate: false, (error) =>
          App.User.all (error, users) =>
            assert.equal users.length, 2
            for user in users
              assert.equal user.get("firstName"), "John"
            
            done()
      
      test 'update matching string property', (done) ->
        App.User.where(firstName: "Lance").update firstName: "John", instantiate: false, (error) =>
          App.User.where(firstName: "John").count (error, count) =>
            assert.equal count, 1
            
            done()
        
    describe '#update', ->
      beforeEach (done) ->
        user = App.User.create(id: 1, firstName: "Lance")
        App.User.create(id: 2, firstName: "Dane")
      
        done()
      
      test 'update string property with updateAttributes', (done) ->
        user.updateAttributes firstName: "John", (error) =>
          assert.equal user.get("firstName"), "John"
          assert.equal user.changes, {}
        
          done()
    
      test 'update string property with save', (done) ->
        user.set "firstName", "John"
        user.save (error) =>
          assert.equal user.get("firstName"), "John"
          assert.equal user.changes, {}
          
          done()
    
    describe 'destroy', ->
      beforeEach (done) ->
        user = App.User.create(id: 1, firstName: "Lance!!!")
        App.User.create(id: 2, firstName: "Dane")
      
        done()
      
      test 'destroy all', (done) ->
        App.User.count (error, count) =>
          assert.equal count, 2
        
          App.User.destroy (error) =>
            App.User.count (error, count) =>
              assert.equal count, 0
            
              done()
      
      test 'destroy matching', (done) ->
        App.User.count (error, count) =>
          assert.equal count, 2

          App.User.where(firstName: "Dane").destroy (error) =>
            App.User.count (error, count) =>
              assert.equal count, 1

              done()

describeWith(new Tower.Store.Memory(name: "users", type: "App.User"))