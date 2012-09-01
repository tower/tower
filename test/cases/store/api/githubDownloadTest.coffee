###
# This works, just need to figure out how to abstract it away
# so it can work on other/remote operating systems.
describe 'Tower.GithubDownloadStore', ->
  store     = undefined
  fromPath  = Tower.joinPath(Tower.srcRoot, 'index.js')

  beforeEach ->
    store = Tower.GithubDownloadStore.create()

  test '_extractCredentials', (done) ->
    store._extractCredentials (error, key, secret) ->
      # @todo not sure how to test this on travsici
      done()

  describe 'authenticated', ->
    beforeEach (done) ->
      store.configure(done)

    test '_buildGitHubResource', ->
      result = store._buildGitHubResource from: fromPath, repo: 'tower'

      assert.deepEqual result, 
        name: 'index.js'
        size: 248
        content_type: 'application/javascript'

    test 'update', (done) ->
      store.update repo: 'tower', from: fromPath, name: 'tmp.js', (error, data) ->
        console.log data
        done()

    test '_createGitHubResource', (done) ->
      store._createGitHubResource repo: 'tower', from: fromPath, name: 'tmp.js', (response) ->
        assert.equal response.body.bucket, 'github'
        done()
###