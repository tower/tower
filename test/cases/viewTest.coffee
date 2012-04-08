require '../config'

view    = null
user    = null
store   = Tower.View.store()

describe 'Tower.View', ->
  beforeEach ->
    view = new Tower.View
  
  describe 'path to files', ->
    test 'loadPaths', ->
      assert.deepEqual store.loadPaths, [ 'test/test-app/app/views' ]
      
    test "findPath(path: 'custom/edit', ext: 'coffee')", ->
      path = store.findPath(path: 'custom/edit', ext: 'coffee')
      
      assert.equal path, 'test/test-app/app/views/custom/edit.coffee'
      
      path = store.findPath(path: 'custom2/edit', ext: 'coffee')

      assert.equal path, 'test/test-app/app/views/custom2/edit.coffee'
    
    test "findPath(path: 'edit', ext: 'coffee', prefixes: ['custom'])", ->
      path = store.findPath(path: 'edit', ext: 'coffee', prefixes: ['custom'])
      
      assert.equal path, 'test/test-app/app/views/custom/edit.coffee'
      
      path = store.findPath(path: 'edit', ext: 'coffee', prefixes: ['custom2'])
      
      assert.equal path, 'test/test-app/app/views/custom2/edit.coffee'
  
  for engine in ['jade', 'ejs', 'eco', 'mustache']
    do (engine) ->
      describe engine, ->
        test "findPath(path: 'edit', ext: '#{engine}', prefixes: ['custom'])", ->
          path = store.findPath(path: 'edit', ext: engine, prefixes: ['custom'])
      
          assert.equal path, "test/test-app/app/views/custom/edit.#{engine}"
        
        test "render(template: 'custom/edit.#{engine}')", (done) ->
          view.render template: "custom/edit.#{engine}", locals: ENGINE: engine, (error, body) ->
            assert.equal body, "<h1>I'm #{engine}!</h1>"
            done()
        
        test "render(template: 'custom/edit', type: '#{engine}')", (done) ->
          view.render template: 'custom/edit', type: engine, locals: ENGINE: engine, (error, body) ->
            assert.equal body, "<h1>I'm #{engine}!</h1>"
            done()
    
        test "render(template: 'edit', type: '#{engine}', prefixes: ['custom'])", (done) ->
          view.render template: 'edit', type: engine, prefixes: ['custom'], locals: ENGINE: engine, (error, body) ->
            assert.equal body, "<h1>I'm #{engine}!</h1>"
            done()
            
        test "render(template: 'custom/edit', type: '#{engine}', layout: 'application')", (done) ->
          view.render template: 'custom/edit', type: engine, layout: 'application', locals: ENGINE: engine, (error, body) ->
            assert.equal body, "<h1>I'm #{engine}!</h1>"
            done()