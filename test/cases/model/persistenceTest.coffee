require '../../config'

user      = null

describeWith = (store) ->
  describe "Tower.Model.Persistence (Tower.Store.#{store.name})", ->
    beforeEach (done) ->
      App.User.store(new store(name: "users", type: "App.User"))
      App.User.destroy(done)
      
    describe 'new', ->
      test '#isNew', ->
        user = new App.User
        assert.ok user.isNew()
    
    describe 'create', ->
      test 'with no attributes (missing required attributes)', (done) ->
        App.User.create (error, record) =>
          assert.deepEqual record.errors, { "firstName": ["firstName can't be blank"] }
          
          App.User.count (error, count) =>
            assert.equal count, 0
          
            done()
        
      test 'with valid attributes', (done) ->
        App.User.create firstName: "Lance", (error, record) =>
          assert.deepEqual record.errors, {}
          
          App.User.count (error, count) =>
            assert.equal count, 1
            
            done()
      
      test 'with multiple with valid attributes', (done) ->
        attributes = [{firstName: "Lance"}, {firstName: "Dane"}]
        
        App.User.create attributes, (error, records) =>
          assert.equal records.length, 2
          
          App.User.count (error, count) =>
            assert.equal count, 2
        
            done()
    
    describe '#save', ->
      test 'throw error if readOnly', (done) ->
        user = new App.User({}, readOnly: true)
        assert.throws(
          -> user.save()
          "Record is read only"
        )
        done()
          
    describe 'update', ->
      beforeEach (done) ->
        attributes = []
        attributes.push id: 1, firstName: "Lance"
        attributes.push id: 2, firstName: "Dane"
        App.User.create(attributes, done)
      
      test 'update string property', (done) ->
        App.User.update {firstName: "John"}, {instantiate: false}, (error) =>
          App.User.all (error, users) =>
            assert.equal users.length, 2
            for user in users
              assert.equal user.get("firstName"), "John"
            
            done()
      
      test 'update matching string property', (done) ->
        App.User.where(firstName: "Lance").update {firstName: "John"}, {instantiate: false}, (error) =>
          App.User.where(firstName: "John").count (error, count) =>
            assert.equal count, 1
            
            done()
    
    describe '#update', ->
      beforeEach (done) ->
        App.User.create id: 1, firstName: "Lance", (error, record) =>
          user = record
          App.User.create(id: 2, firstName: "Dane", done)
      
      test 'update string property with updateAttributes', (done) ->
        user.updateAttributes firstName: "John", (error) =>
          assert.equal user.get("firstName"), "John"
          assert.deepEqual user.changes, {}
          
          done()
      
      test 'update string property with save', (done) ->
        user.set "firstName", "John"
        user.save (error) =>
          assert.equal user.get("firstName"), "John"
          assert.deepEqual user.changes, {}
          
          done()
    
    describe 'destroy', ->
      beforeEach (done) ->
        App.User.create id: 1, firstName: "Lance!!!", (error, result) =>
          user = result
          App.User.create(id: 2, firstName: "Dane", done)
      
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

describeWith(Tower.Store.Memory)
describeWith(Tower.Store.MongoDB)