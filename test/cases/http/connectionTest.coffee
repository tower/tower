describe 'Tower.Net.Connection', ->
  connection = null

  beforeEach ->
    connection = Tower.createConnection()

  test 'constructor', ->
    assert.ok connection instanceof Tower.Net.Connection

  test 'lazily instantiates controllers', ->
    assert.ok !(connection.postsController instanceof App.PostsController)
    assert.ok connection.get('postsController') instanceof App.PostsController

  test 'scopes', ->
    scope = connection.getPath('postsController.all')
    assert.ok scope instanceof Tower.Model.Cursor
  
  test 'notify -> matchAgainstCursors', (done) ->
    # spyon connection.created
    App.Post.create rating: 8, (error, post) =>
      
      done()