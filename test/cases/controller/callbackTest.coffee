controller  = null
user        = null
router      = null

describe 'Tower.ControllerCallbacks', ->
  beforeEach (done) ->
    Tower.start(done)

  afterEach ->
    Tower.stop()

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
