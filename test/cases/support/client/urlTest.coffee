describe 'Tower.SupportUrl', ->
  describe 'Tower.StoreTransportAjax', ->
    transport = undefined
    post      = undefined
    urlFor = Tower.urlFor

    beforeEach ->
      # require(Tower.srcRoot + '/packages/tower-store/client/transport/ajax')
      transport = Tower.StoreTransportAjax

      post = App.Post.build()
      post.set('id', 1)

    afterEach ->
      Tower.defaultURLOptions = undefined

    test 'urlForCreate', ->
      assert.equal transport.urlForCreate(post), '/posts'
      Tower.defaultURLOptions = host: 'example.com'
      assert.equal transport.urlForCreate(post), 'http://example.com/posts'

    test 'urlForUpdate', ->
      post.set('isNew', false)
      assert.equal transport.urlForUpdate(post), '/posts/1'
      Tower.defaultURLOptions = host: 'example.com'
      assert.equal transport.urlForUpdate(post), 'http://example.com/posts/1'

    test 'urlForDestroy', ->
      post.set('isNew', false)
      assert.equal transport.urlForDestroy(post), '/posts/1'
      Tower.defaultURLOptions = host: 'example.com'
      assert.equal transport.urlForDestroy(post), 'http://example.com/posts/1'

    test 'urlForIndex', ->
      assert.equal transport.urlForIndex(App.Post), '/posts'
      Tower.defaultURLOptions = host: 'example.com'
      assert.equal transport.urlForIndex(App.Post), 'http://example.com/posts'

    test 'urlForShow', ->
      assert.equal transport.urlForShow(App.Post, 1), '/posts/1'
      Tower.defaultURLOptions = host: 'example.com'
      assert.equal transport.urlForShow(App.Post, 1), 'http://example.com/posts/1'
