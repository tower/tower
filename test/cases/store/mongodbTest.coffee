describe 'Tower.Store.Mongodb', ->
  __config    = null
  config      = null

  beforeEach ->
    __config  = Tower.Store.Mongodb.config
    config    = Tower.Store.Mongodb.config = {}

  afterEach ->
    Tower.Store.Mongodb.config = __config

  test 'url', ->
    config.url = "mongodb://heroku_user:asdfasdfasdf@data123.mongolab.com:29197/heroku_app"

    expected =
      name: 'heroku_app'
      port: 29197
      host: 'data123.mongolab.com'
      username: 'heroku_user'
      password: 'asdfasdfasdf'

    result = Tower.Store.Mongodb.parseEnv()

    for key, value of expected
      assert.equal result[key], value