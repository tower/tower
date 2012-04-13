controller  = null
user        = null
router      = null

describeWith = (store) ->
  describe "Tower.Controller.Resourceful (Tower.Store.#{store.name})", ->
    beforeEach (done) ->
      App.User.store(store)
      App.User.destroy =>
        App.User.create id: 1, firstName: "Lance", done
    
    describe 'format: "json"', ->
      describe "success", ->
        test '#index', (done) ->
          Tower.get "index", format: "json", ->
            resources = JSON.parse(@body)
            assert.isArray resources
            assert.isArray @collection
            assert.equal typeof(@resource), "undefined"
            assert.equal resources.length, 1
            assert.equal resources[0].firstName, "Lance"
            assert.equal @headers["Content-Type"], "application/json"
            
            App.User.count (error, count) =>
              assert.equal count, 1
              done()
            
        test '#new', (done) ->
          Tower.get 'new', format: "json", ->
            resource = JSON.parse(@body)
            assert.equal typeof(@collection), "undefined"
            assert.equal typeof(@resource), "object"
            assert.equal resource.firstName, undefined
            assert.equal @headers["Content-Type"], "application/json"
          
            App.User.count (error, count) =>
              assert.equal count, 1
              done()
        
        test '#create', (done) ->
          Tower.post 'create', format: "json", user: firstName: "Lance", ->
            resource = JSON.parse(@body)
            assert.equal resource.firstName, "Lance"
            assert.equal @headers["Content-Type"], "application/json"
          
            App.User.count (error, count) =>
              assert.equal count, 2
              done()
        
        test '#show', (done) ->
          Tower.get 'show', id: 1, format: "json", ->
            resource = JSON.parse(@body)
            assert.equal resource.firstName, "Lance"
            assert.equal resource.id, 1
            assert.equal @headers["Content-Type"], "application/json"
          
            App.User.count (error, count) =>
              assert.equal count, 1
              done()
    
        test '#edit', (done) ->
          Tower.get 'edit', id: 1, format: "json", ->
            resource = JSON.parse(@body)
            assert.equal resource.firstName, "Lance"
            assert.equal resource.id, 1
            assert.equal @headers["Content-Type"], "application/json"
          
            App.User.count (error, count) =>
              assert.equal count, 1
              done()
        
        test '#update', (done) ->
          Tower.put 'update', id: 1, format: "json", user: firstName: "Dane", ->
            resource = JSON.parse(@body)
            assert.equal resource.firstName, "Dane"
            assert.equal resource.id, 1
            assert.equal @headers["Content-Type"], "application/json"
          
            App.User.find 1, (error, user) =>
              assert.equal user.get("firstName"), "Dane"
            
              App.User.count (error, count) =>
                assert.equal count, 1
                done()
              
        test '#destroy', (done) ->
          Tower.destroy 'destroy', id: 1, format: "json", ->
            resource = JSON.parse(@body)
            assert.equal resource.firstName, "Lance"
            assert.equal resource.id, undefined
            assert.equal @headers["Content-Type"], "application/json"
          
            App.User.count (error, count) =>
              assert.equal count, 0
              done()
      
      describe "failure", ->
        test '#create'
        
        test '#update'
              
        test '#destroy'
    
    describe 'format: "html"', ->
      describe 'success', ->
        test '#index', (done) ->
          Tower.get 'index', ->
            assert.equal @body, '<h1>Hello World</h1>\n'
            assert.equal @headers["Content-Type"], "text/html"
        
            App.User.count (error, count) =>
              assert.equal count, 1
              done()
        
        test '#new', (done) ->
          Tower.get 'new', ->
            assert.equal @body, '<h1>New User</h1>\n'
            assert.equal @headers["Content-Type"], "text/html"
        
            App.User.count (error, count) =>
              assert.equal count, 1
              done()
        
        test '#create', (done) ->
          Tower.post 'create', user: firstName: "Lance", ->
            assert.equal @body, "<h1>Hello Lance</h1>\n"
            assert.equal @headers["Content-Type"], "text/html"
            
            App.User.count (error, count) =>
              assert.equal count, 2
              done()
            
        test '#show', (done) ->
          Tower.get 'show', id: 1, ->
            assert.equal @body, "<h1>Hello Lance</h1>\n"
            assert.equal @headers["Content-Type"], "text/html"
            
            App.User.count (error, count) =>
              assert.equal count, 1
              done()
        
        test '#edit', (done) ->
          Tower.get 'edit', ->
            assert.equal @body, '<h1>Editing User</h1>\n'
            assert.equal @headers["Content-Type"], "text/html"
        
            App.User.count (error, count) =>
              assert.equal count, 1
              done()
            
        test '#update', (done) ->
          Tower.put 'update', id: 1, user: firstName: "Dane", ->
            assert.equal @body, '<h1>Hello Dane</h1>\n'
            assert.equal @headers["Content-Type"], "text/html"
            
            App.User.find 1, (error, user) =>
              assert.equal user.get("firstName"), "Dane"
        
              App.User.count (error, count) =>
                assert.equal count, 1
                done()
        
        test '#destroy', (done) ->
          Tower.destroy 'destroy', id: 1, ->
            assert.equal @body, '<h1>Hello World</h1>\n'
            assert.equal @headers["Content-Type"], "text/html"
        
            App.User.count (error, count) =>
              assert.equal count, 0
              done()
              
describeWith(Tower.Store.Memory)
#describeWith(Tower.Store.MongoDB)
