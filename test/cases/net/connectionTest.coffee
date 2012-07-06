describe 'Tower.Net.Connection', ->
  connection = null

  beforeEach ->
    connection = Tower.createConnection()

  test 'constructor', ->
    assert.ok connection instanceof Tower.Net.Connection

  if Tower.isServer
    test 'lazily instantiates controllers', ->
      assert.ok !(connection.postsController instanceof App.PostsController)
      assert.ok connection.get('postsController') instanceof App.PostsController

  test 'scopes', ->
    scope = connection.getPath('postsController.all')
    assert.isTrue scope.isCursor, 'scope instanceof Tower.Model.Cursor'
  
  test 'notify -> matchAgainstCursors', (done) ->
    # spyon connection.created
    App.Post.create rating: 8, (error, post) =>
      
      done()

  test 'resolve', ->
    post = App.Post.build(id: 5, rating: 8)
    
    assert.deepEqual connection.resolve('create', [post])[0], post
