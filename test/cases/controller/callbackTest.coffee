require '../../config'

controller  = null
user        = null
router      = null

describe 'Tower.Controller.Callbacks', ->
  describe '.beforeAction', ->
    test "beforeAction('testCallback', only: ['testCreateCallback', 'testUpdateCallback'])", (done) ->
      Tower.get 'testCreateCallback', ->
        assert.equal @testCallbackCalled, true
        assert.equal @testCreateCallbackCalled, true
        
        Tower.get 'testNoCallback', ->
          assert.equal @testCallbackCalled, undefined
          assert.equal @testNoCallbackCalled, true
          done()
          