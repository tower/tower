describe 'Tower.StoreMongodb', ->
  __config    = null
  config      = null

  beforeEach ->
    __config  = Tower.StoreMongodb.config
    config    = Tower.StoreMongodb.config = {}

  afterEach ->
    Tower.StoreMongodb.config = __config

  test 'url', ->
    config.url = 'mongodb://heroku_user:asdfasdfasdf@data123.mongolab.com:29197/heroku_app'

    expected =
      name: 'heroku_app'
      port: 29197
      host: 'data123.mongolab.com'
      username: 'heroku_user'
      password: 'asdfasdfasdf'

    result = Tower.StoreMongodb.parseEnv()

    for key, value of expected
      assert.equal result[key], value