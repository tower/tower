controller  = null
user        = null
router      = null

describe 'Tower.Controller.Callbacks', ->
  describe '.beforeAction', ->
    test "beforeAction('testOnlyCallback', only: ['testCreateCallback', 'testUpdateCallback'])", (done) ->
      Tower.get 'testCreateCallback', ->
        assert.equal @testOnlyCallbackCalled, true
        assert.equal @testCreateCallbackCalled, true
        
        Tower.get 'testNoCallback', ->
          assert.equal @testOnlyCallbackCalled, undefined
          assert.equal @testNoCallbackCalled, true
          done()
          
    test "beforeAction('testExceptCallback', except: 'testNoCallback')", (done) ->
      Tower.get 'testCreateCallback', ->
        assert.equal @testExceptCallbackCalled, true
        assert.equal @testCreateCallbackCalled, true
        
        Tower.get 'testNoCallback', ->
          assert.equal @testExceptCallbackCalled, undefined
          assert.equal @testNoCallbackCalled, true
          done()
  