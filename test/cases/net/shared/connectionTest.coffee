describe 'Tower.NetConnection', ->
  connection = null

  beforeEach ->
    connection = Tower.createConnection()

  test 'constructor', ->
    assert.isTrue !!(connection instanceof Tower.NetConnection)

  if Tower.isServer
    test 'lazily instantiates controllers', ->
      assert.isTrue !(connection.postsController instanceof App.PostsController)
      assert.isTrue !!(connection.get('postsController') instanceof App.PostsController)

  test 'scopes', ->
    scope = connection.get('postsController.all')
    assert.isTrue scope.isCursor, 'scope instanceof Tower.ModelCursor'

  test 'resolve', ->
    post = App.Post.build(id: 5, rating: 8)
    assert.deepEqual connection.resolve('create', [post])[0], post
