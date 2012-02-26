require '../../config'

controller  = null
user        = null
router      = null

describeWith = (store) ->
  describe "Tower.Controller.Resourceful (Tower.Store.#{store.name})", ->
    beforeEach (done) ->
      App.User.store(store)
      App.User.destroy(done)
    
    test '#index', (done) ->
      Tower.get 'index', ->
        assert.equal @body, '<h1>Hello World</h1>\n'
        assert.equal @headers["Content-Type"], "text/html"
        
        done()
      
    test '#new', (done) ->
      Tower.get 'new', ->
        assert.equal @body, '<h1>New User</h1>\n'
        assert.equal @headers["Content-Type"], "text/html"
        
        done()
  
    test '#create', (done) ->
      Tower.post 'create', format: "json", user: firstName: "Lance", ->
        resource = JSON.parse(@body)
        assert.equal resource.firstName, "Lance"
        
        done()
  
    test '#show', (done) ->
      App.User.create id: 1, firstName: "Lance", =>
        Tower.get 'show', id: 1, format: "json", ->
          resource = JSON.parse(@body)
          assert.equal resource.firstName, "Lance"
          assert.equal resource.id, 1
          assert.equal @headers["Content-Type"], "application/json"
          
          done()
  
    test '#edit', (done) ->
      Tower.get 'edit', ->
        assert.equal @body, '<h1>Editing User</h1>\n'
        assert.equal @headers["Content-Type"], "text/html"
        
        done()
      
    test '#update', (done) ->
      App.User.create id: 1, firstName: "Lance", =>
        Tower.put 'update', id: 1, user: firstName: "Dane", =>
          assert.equal @body, '<h1>Show User</h1>\n'
          assert.equal @headers["Content-Type"], "text/html"
          
          App.User.find 1, (error, user) =>
            assert.equal user.get("firstName"), "Dane"
            
            done()
  
    test '#destroy', (done) ->
      Tower.destroy 'destroy', ->
        assert.equal @body, '<h1>New User</h1>\n'
        assert.equal @headers["Content-Type"], "text/html"
        
        done()

describeWith(Tower.Store.Memory)
# describeWith(Tower.Store.MongoDB)
