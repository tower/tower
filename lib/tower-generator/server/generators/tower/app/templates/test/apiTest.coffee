agent = require('superagent')

describe 'API', ->
  before (done) ->
    # Tower.defaultURLOptions = host: 'localhost:3000'
    # App.Post.create done
    done()

  after ->
    # Tower.defaultURLOptions = undefined

  # @example App.Post
  #   describe 'posts', ->
  #     test '[index] GET /posts.json'
  #     test '[create] POST /posts.json'
  #     test '[show] GET /posts/:id.json'
  #     test '[update] PUT /posts/:id.json'
  #     test '[destroy] DELETE /posts/:id.json'