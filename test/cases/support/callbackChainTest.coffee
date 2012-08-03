describe 'Tower.Support.Callbacks.CallbackChain', ->
  class CallbackTest extends Tower.Class
    @include Tower.Support.Callbacks

    # sync method, sync callback
    @before 'method', 'beforeMethod'
    @after 'method', 'afterMethod'
    @after 'method', 'afterMethod2'

    # sync method, async callback
    @before 'methodWithAsyncCallback', 'beforeMethodWithAsyncCallback'
    @after 'methodWithAsyncCallback', 'afterMethodWithAsyncCallback'
    
    # async method, sync callback
    @before 'asyncMethod', 'beforeAsyncMethod'
    @after 'asyncMethod', 'afterAsyncMethod'

    # async method, async callback
    @before 'asyncMethodWithAsyncCallback', 'beforeAsyncMethodWithAsyncCallback'
    @after 'asyncMethodWithAsyncCallback', 'afterAsyncMethodWithAsyncCallback'
    @after 'asyncMethodWithAsyncCallback', 'afterAsyncMethodWithAsyncCallback2'

    method: ->
      @runCallbacks 'method', ->
        @_method = true

    beforeMethod: ->
      @_beforeMethod = @_expectedBeforeMethod

    afterMethod: ->
      @_afterMethod = @_expectedAfterMethod

    afterMethod2: ->
      @_afterMethod2 = @_expectedAfter2Method
    
    methodWithAsyncCallback: ->
      @runCallbacks 'methodWithAsyncCallback', ->
        @_methodWithAsyncCallback = true

    beforeMethodWithAsyncCallback: (done) ->
      done @_beforeMethodWithAsyncCallback = @_expectedBeforeMethodWithAsyncCallback

    afterMethodWithAsyncCallback: (done) ->
      done @_afterMethodWithAsyncCallback = @_expectedAfterMethodWithAsyncCallback
    
    asyncMethodWithAsyncCallback: (methodDone) ->
      block = (blockDone) ->
        process.nextTick =>
          blockDone(@_asyncMethodWithAsyncCallback = @_expectedAsyncMethodWithAsyncCallback)

      @runCallbacks 'asyncMethodWithAsyncCallback', block, methodDone

    beforeAsyncMethodWithAsyncCallback: (done) ->
      process.nextTick =>
        done @_beforeAsyncMethodWithAsyncCallback = @_expectedBeforeAsyncMethodWithAsyncCallback

    afterAsyncMethodWithAsyncCallback: (done) ->
      process.nextTick =>
        done @_afterAsyncMethodWithAsyncCallback = @_expectedAfterAsyncMethodWithAsyncCallback

    afterAsyncMethodWithAsyncCallback2: (done) ->
      process.nextTick =>
        done @_afterAsyncMethodWithAsyncCallback2 = @_expectedAfterAsyncMethodWithAsyncCallback2

  record = null

  beforeEach ->
    Tower.Support.Callbacks.silent = true
    record = CallbackTest.build()

  describe 'sync method, sync callback', ->
    test 'if callbacks dont return false everything should be fine', ->
      record._expectedBeforeMethod = true
      record._expectedAfterMethod = true
      record._expectedAfter2Method = true
      record.method()
      assert.isTrue record._beforeMethod
      assert.isTrue record._method
      assert.isTrue record._afterMethod
      assert.isTrue record._afterMethod2

    test 'if beforeCallback returns false then it shouldnt execute method or after callback', ->
      record._expectedBeforeMethod = false
      record._expectedAfterMethod = undefined
      record.method()
      assert.equal record._beforeMethod, false
      assert.equal record._method, undefined
      assert.equal record._afterMethod, undefined
      assert.equal record._afterMethod2, undefined

    test 'if afterCallback returns false then it shouldnt execute subsequent after callbacks', ->
      record._expectedBeforeMethod = true
      record._expectedAfterMethod = false
      record.method()
      assert.equal record._beforeMethod, true
      assert.equal record._method, true
      assert.equal record._afterMethod, false
      assert.equal record._afterMethod2, undefined

    test 'should only halt if return false, not undefined or anything', ->
      record._expectedBeforeMethod = undefined
      record._expectedAfterMethod = false
      record.method()
      assert.equal record._beforeMethod, undefined
      assert.equal record._method, true
      assert.equal record._afterMethod, false
      assert.equal record._afterMethod2, undefined

  describe 'sync method, async callback', ->
    test 'if async beforeCallback calls back with an error (or anything except null, false, or undefined), it should halt', ->
      record._expectedBeforeMethodWithAsyncCallback = 'error!'
      record._expectedAfterMethodWithAsyncCallback = undefined
      record.methodWithAsyncCallback()
      assert.equal record._beforeMethodWithAsyncCallback, 'error!'
      assert.equal record._methodWithAsyncCallback, undefined
      assert.equal record._afterMethodWithAsyncCallback, undefined

  describe 'async method, async callback', ->
    test 'if async beforeCallback calls back with an error (or anything except null, false, or undefined), it should halt', (done) ->
      record._expectedBeforeAsyncMethodWithAsyncCallback = 'error!'
      record._expectedAfterAsyncMethodWithAsyncCallback = undefined
      record._expectedAsyncMethodWithAsyncCallback = false
      record.asyncMethodWithAsyncCallback (error) =>
        assert.equal error.message, 'error!'
        assert.equal record._beforeAsyncMethodWithAsyncCallback, 'error!'
        assert.equal record._asyncMethodWithAsyncCallback, undefined
        assert.equal record._afterAsyncMethodWithAsyncCallback, undefined
        done()

    test 'everything should execute if no errors', (done) ->
      record._expectedBeforeAsyncMethodWithAsyncCallback = undefined
      record._expectedAfterAsyncMethodWithAsyncCallback = false
      record._expectedAsyncMethodWithAsyncCallback = false
      record.asyncMethodWithAsyncCallback (error) =>
        assert.equal error, undefined
        assert.equal record._beforeAsyncMethodWithAsyncCallback, undefined
        assert.equal record._asyncMethodWithAsyncCallback, false
        assert.equal record._afterAsyncMethodWithAsyncCallback, false
        done()

    test 'if after callback fails subsequent ones should not be executed', (done) ->
      record._expectedBeforeAsyncMethodWithAsyncCallback = undefined
      record._expectedAfterAsyncMethodWithAsyncCallback = true
      record._expectedAfterAsyncMethodWithAsyncCallback2 = true
      record._expectedAsyncMethodWithAsyncCallback = false
      record.asyncMethodWithAsyncCallback (error) =>
        assert.equal error.message, 'true'
        assert.equal record._beforeAsyncMethodWithAsyncCallback, undefined
        assert.equal record._asyncMethodWithAsyncCallback, false
        assert.equal record._afterAsyncMethodWithAsyncCallback, true
        # never reaches this one.
        assert.equal record._afterAsyncMethodWithAsyncCallback2, undefined
        done()

    test '* if async block calls callback with anything but false/undefined/null it will halt', (done) ->
      record._expectedBeforeAsyncMethodWithAsyncCallback = false # but still will execute
      record._expectedAfterAsyncMethodWithAsyncCallback = false # but will be undefined because it halts
      record._expectedAsyncMethodWithAsyncCallback = 'error!'
      record.asyncMethodWithAsyncCallback (error) =>
        assert.equal error.message, 'error!'
        assert.equal record._beforeAsyncMethodWithAsyncCallback, false
        assert.equal record._asyncMethodWithAsyncCallback, 'error!'
        assert.equal record._afterAsyncMethodWithAsyncCallback, undefined
        done()

  describe 'uniqueness', ->
    class App.UniquenessModel extends Tower.Model
      @field 'title'
      @field 'slug'

      @belongsTo 'post'

      @validates 'title', presence: true
      @validates 'postId', uniqueness: true

      @before 'validate', 'slugify'
      
      slugify: ->
        @set 'slug', _.parameterize(@get('title')) if @get('title') && !@get('slug')?
        true

    record = null
    post = null

    beforeEach (done) ->
      App.Post.create rating: 8, (error, r) =>
        post = r
        App.UniquenessModel.create title: 'a title', postId: post.get('id'), (error, r) =>
          record = r
          done()

    # the uniqueness error might be coming from Tower.Model.AutosaveAssociation#_associationIsValid
    test 'save', (done) ->
      assert.isTrue record.get('isValid')

      record.save =>
        assert.isFalse record.get('isValid')
        done()