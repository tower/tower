view    = null
user    = null
store   = Tower.View.store()

describe "Tower.View", ->
  beforeEach ->
    Tower.View.engine = "coffee"
    view = new Tower.View
    
  afterEach ->
    Tower.View.engine = "coffee"
    
  describe 'path to files', ->
    test 'loadPaths', ->
      assert.deepEqual store.loadPaths, [ "#{Tower.relativeRoot}/app/views" ]
      
    test "findPath(path: 'custom/engine', ext: 'coffee')", ->
      path = store.findPath(path: 'custom/engine', ext: 'coffee')
      
      assert.equal path, "#{Tower.relativeRoot}/app/views/custom/engine.coffee"
      
      path = store.findPath(path: 'custom2/engine', ext: 'coffee')

      assert.equal path, "#{Tower.relativeRoot}/app/views/custom2/engine.coffee"
    
    test "findPath(path: 'engine', ext: 'coffee', prefixes: ['custom'])", ->
      path = store.findPath(path: 'engine', ext: 'coffee', prefixes: ['custom'])
      
      assert.equal path, "#{Tower.relativeRoot}/app/views/custom/engine.coffee"
      
      path = store.findPath(path: 'engine', ext: 'coffee', prefixes: ['custom2'])
      
      assert.equal path, "#{Tower.relativeRoot}/app/views/custom2/engine.coffee"
      
  describe 'config', ->
    test 'setting default engine', (done) ->
      Tower.View.engine = 'jade'
      
      engine = 'jade'
      
      view.render template: 'custom/engine', locals: ENGINE: engine, (error, body) ->
        assert.equal body.trim(), "<h1>I'm jade!</h1>"
        done()
      
    test 'specifying custom type different from default engine', (done) ->
      Tower.View.engine = 'jade'
      
      engine = 'coffee'
      
      view.render template: 'custom/engine', type: engine, locals: ENGINE: engine, (error, body) ->
        assert.equal body.trim(), "<h1>I'm coffee!</h1>"
        done()
        
  for engine in ['coffee', 'jade', 'ejs', 'eco', 'mustache']
    do (engine) ->
      describe "render view with #{engine}", ->
        test "findPath(path: 'engine', ext: '#{engine}', prefixes: ['custom'])", ->
          path = store.findPath(path: 'engine', ext: engine, prefixes: ['custom'])
      
          assert.equal path, "#{Tower.relativeRoot}/app/views/custom/engine.#{engine}"
        
        test "render(template: 'custom/engine.#{engine}')", (done) ->
          view.render template: "custom/engine.#{engine}", locals: ENGINE: engine, (error, body) ->
            assert.equal body.trim(), "<h1>I'm #{engine}!</h1>"
            done()
        
        test "render(template: 'custom/engine', type: '#{engine}')", (done) ->
          view.render template: 'custom/engine', type: engine, locals: ENGINE: engine, (error, body) ->
            assert.equal body.trim(), "<h1>I'm #{engine}!</h1>"
            done()
    
        test "render(template: 'engine', type: '#{engine}', prefixes: ['custom'])", (done) ->
          view.render template: 'engine', type: engine, prefixes: ['custom'], locals: ENGINE: engine, (error, body) ->
            assert.equal body.trim(), "<h1>I'm #{engine}!</h1>"
            done()
            
        test "render(template: 'custom/engine', type: '#{engine}', layout: 'application')", (done) ->
          view.render template: 'custom/engine', type: engine, layout: 'application', locals: ENGINE: engine, (error, body) ->
            assert.equal body.trim(), "<h1>I'm #{engine}!</h1>"
            done()
            
      describe "Tower.View.engine = '#{engine}' (default engine)", ->
        beforeEach ->
          Tower.View.engine = engine
        
        afterEach ->
          Tower.View.engine = "coffee"
        
        test "render(template: 'custom/engine')", (done) ->
          view.render template: 'custom/engine', locals: ENGINE: engine, (error, body) ->
            assert.equal body.trim(), "<h1>I'm #{engine}!</h1>"
            done()
