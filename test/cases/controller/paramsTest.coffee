# make sure params as strings get properly serialized (integration test)

unless Tower.isClient
  describeWith = (store) ->
    describe "Tower.Controller.Params (Tower.Store.#{store.className()})", ->
      beforeEach (done) ->
        App.Post.store(store)

        App.Post.create title: 'First Post', rating: 8, =>
          App.Post.create title: 'Second Post', rating: 7, done

      beforeEach (done) ->
        Tower.start(done)

      afterEach ->
        Tower.stop()

      describe '#index', ->
        test 'POST', (done) ->
          params = {}
          
          _.post '/posts', params: params, (response) ->
            posts = response.controller.get('posts')
            assert.equal 2, posts.length
            assert.deepEqual ['First Post', 'Second Post'], _.map posts, (i) -> i.get('title')
            done()

        test 'rating: 8', (done) ->
          params = rating: 8
          
          _.post '/posts', params: params, (response) ->
            posts = response.controller.get('posts')
            assert.equal 1, posts.length
            done()

        test 'rating: >=: 7', (done) ->
          params = rating: '>=': 7
          
          _.post '/posts', params: params, (response) ->
            posts = response.controller.get('posts')
            assert.equal 2, posts.length
            done()

        test 'sort: ["title", "DESC"]', (done) ->
          params = sort: ["title", "DESC"]
          
          _.post '/posts', params: params, (response) ->
            posts = response.controller.get('posts')
            assert.equal 2, posts.length
            assert.deepEqual ['Second Post', 'First Post'], _.map posts, (i) -> i.get('title')
            done()

        # test 'limit: 1', (done) ->
        #   params = limit: 1
        #   
        #   _.post '/posts', params: params, (response) ->
        #     posts = response.controller.get('posts')
        #     assert.equal 1, posts.length
        #     done()

      test 'date string is serialized to database'
        # params = user: birthdate: _(26).years().ago().toDate()

  describeWith(Tower.Store.Memory)