describe "Tower.HTTP.Route", ->
  beforeEach ->
    Tower.Route.clear()
    
  test 'path', ->
    route = new Tower.Route(path: '/')
    
    assert.equal route.path, '/'
    assert.equal route.name, undefined
    assert.equal route.controller, undefined
    assert.equal route.ip, undefined
    assert.equal route.id, '/'
    assert.deepEqual route.methods, ['GET']
    assert.deepEqual route.keys, []
    
  test 'name', ->
    route = new Tower.Route(path: '/', name: 'home')
    
    assert.equal route.path, '/'
    assert.equal route.name, 'home'
    assert.equal route.controller, undefined
    assert.equal route.ip, undefined
    assert.equal route.id, '/'
    assert.deepEqual route.methods, ['GET']
    assert.deepEqual route.keys, []
    
  test 'methods', ->
    route = new Tower.Route(path: '/', method: ['GET', 'POST'])
    
    assert.equal route.path, '/'
    assert.equal route.name, undefined
    assert.equal route.controller, undefined
    assert.equal route.ip, undefined
    assert.equal route.id, '/'
    assert.deepEqual route.methods, ['GET', 'POST']
    assert.deepEqual route.keys, []
  
  test 'defaults', ->
    route = new Tower.Route(path: '/', defaults: foo: 'bar')
    
    assert.equal route.path, '/'
    assert.equal route.name, undefined
    assert.equal route.controller, undefined
    assert.equal route.ip, undefined
    assert.equal route.id, '/'
    assert.deepEqual route.methods, ['GET']
    assert.deepEqual route.keys, []
    assert.deepEqual route.defaults, foo: 'bar'
  
  describe 'defaults', ->
    
    
  describe 'pattern', ->
    