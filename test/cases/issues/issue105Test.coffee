describeWith = (store) ->
  describe "Issue105", ->
    post = null

    beforeEach (done) ->
      Tower.start ->
        App.BaseModel.store(store)
        App.Post.store(store)

        post = App.Post.build(rating: 4)
        post.save(done)

    afterEach ->
      Tower.stop()

    test 'user created', (done) ->
      App.Post.find post.get("id"), (err, resource) ->
        assert.ok resource.get("id")
        assert.equal post.get("id").toString(), resource.get("id").toString()
        done()

    test 'handle request with unknown format', (done) ->
      options =
        format: "form"
      _.destroy "/posts/" + post.get("id"), options, (response) ->

        App.Post.find post.get("id"), (err, resource) ->
          assert.equal resource, undefined
          done()

describeWith(Tower.Store.MongoDB) unless Tower.client