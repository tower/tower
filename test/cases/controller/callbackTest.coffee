controller  = null
user        = null
router      = null

if Tower.client
  _.get = (path, options, callback) ->
    if typeof options == "function"
      callback  = options
      options   = {}
    options   ||= {}
    headers     = options.headers || {}
    params      = options.params  || {}
    redirects   = options.redirects || 5
    auth        = options.auth
    format      = options.format# || "form-data"
    
    History.pushState null, null, path

    caller = -> callback.call Tower.Controller.testCase
    
    setTimeout caller, 200

describe 'Tower.ControllerCallbacks', ->
  unless Tower.client    
    beforeEach (done) ->
      Tower.start(done)

    afterEach ->
      Tower.stop()
  else
    afterEach ->
      History.replaceState(null, null, "/")

  describe '.beforeAction', ->
    test "beforeAction('testOnlyCallback', only: ['testCreateCallback', 'testUpdateCallback'])", (done) ->
      _.get '/custom/testCreateCallback', ->
        assert.equal @testOnlyCallbackCalled, true
        assert.equal @testCreateCallbackCalled, true
        
        _.get '/custom/testNoCallback', ->
          assert.equal @testOnlyCallbackCalled, undefined
          assert.equal @testNoCallbackCalled, true
          done()
          
    test "beforeAction('testExceptCallback', except: 'testNoCallback')", (done) ->
      _.get '/custom/testCreateCallback', ->
        assert.equal @testExceptCallbackCalled, true
        assert.equal @testCreateCallbackCalled, true
        
        _.get '/custom/testNoCallback', ->
          assert.equal @testExceptCallbackCalled, undefined
          assert.equal @testNoCallbackCalled, true
          done()
