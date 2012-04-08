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
      
    #test 'render', (done) ->
    #  view.render template: 'asdf', ->
    #    done()