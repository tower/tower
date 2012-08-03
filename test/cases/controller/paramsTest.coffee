# make sure params as strings get properly serialized (integration test)

describe "Tower.Controller.Params", ->
  beforeEach (done) ->
    App.Post.create title: 'First Post', rating: 8, =>
      App.Post.create title: 'Second Post', rating: 7, done

  beforeEach (done) ->
    Tower.start(done)

  afterEach ->
    Tower.stop()

  describe '#index', ->
    test 'GET', (done) ->
      params = {}
      
      _.get '/posts', params: params, (response) ->
        posts = response.controller.get('posts')
        assert.equal 2, posts.length
        assert.deepEqual ['First Post', 'Second Post'], _.map posts, (i) -> i.get('title')
        done()

    test 'rating: 8', (done) ->
      params = conditions: JSON.stringify(rating: 8)
      
      _.get '/posts', params: params, (response) ->
        posts = response.controller.get('posts')
        assert.equal 1, posts.length
        done()

    test 'rating: >=: 7', (done) ->
      params = conditions: JSON.stringify(rating: '>=': 7)
      
      _.get '/posts', params: params, (response) ->
        posts = response.controller.get('posts')
        assert.equal 2, posts.length
        done()

    test 'sort: ["title", "DESC"]', (done) ->
      params = sort: ["title", "DESC"]
      
      _.get '/posts', params: params, (response) ->
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
