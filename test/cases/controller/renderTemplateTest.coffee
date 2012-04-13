controller  = null
user        = null
router      = null

describe 'Tower.Controller.Rendering', ->
  beforeEach (done) ->
    Tower.start(done)

  afterEach ->
    Tower.stop()
    
  test 'renderCoffeeKupFromTemplate', (done) ->
    _.get '/custom/renderCoffeeKupFromTemplate', ->
      assert.equal @body, "<h1>Hello World</h1>\n"
      assert.equal @headers["Content-Type"], "text/html"
      done()
      
  test 'renderHelloWorldFromVariable', (done) ->
    _.get '/custom/renderHelloWorldFromVariable', ->
      assert.equal @person, "david"
      assert.equal @body, "hello david"
      done()
      
  test 'renderWithExplicitStringTemplateAsAction', (done) ->
    _.get '/custom/renderWithExplicitStringTemplateAsAction', ->
      assert.equal @body, "<h1>Hello World!!!</h1>\n"
      done()
         
  # test 'helloWorldFile', ->
  #  Tower.get 'helloWorldFile', ->
  #    assert.equal @body, "Hello world!"
  #    
  #test 'renderHelloWorld', ->
  #  Tower.get 'renderHelloWorld', ->
  #    assert.equal @body, "Hello world!"
  #    
  #test 'renderHelloWorldWithForwardSlash', ->
  #  Tower.get 'renderHelloWorldWithForwardSlash', ->
  #    assert.equal @body, "Hello world!"
  #    
  #test 'renderActionHelloWorld', ->
  #  Tower.get 'renderActionHelloWorld', ->
  #    assert.equal @body, "Hello world!"
  #    
  test 'renderActionUpcasedHelloWorld', (done) ->
    _.get '/custom/renderActionUpcasedHelloWorld', ->
      assert.equal @body, "<h1>renderActionUpcasedHelloWorld</h1>\n"
      done()
      
  test 'renderActionUpcasedHelloWorldAsString', (done) ->
    _.get '/custom/renderActionUpcasedHelloWorldAsString', ->
      assert.equal @body, "<h1>renderActionUpcasedHelloWorld</h1>\n"
      done()
  
  #test 'renderActionHelloWorldAsString', ->
  #  Tower.get 'renderActionUpcasedHelloWorld', ->
  #    assert.equal @body, "Hello world!"
  #
  #test 'renderTextHelloWorld', ->
  #  Tower.get 'renderActionUpcasedHelloWorld', ->
  #    assert.equal @body, "hello world"
  #    
  #test 'renderTextHelloWorldWithLayout'
  #    
  #test 'helloWorldWithLayoutFalse'
  #test 'renderFileWithInstanceVariables'
  #test 'renderFileAsStringWithInstanceVariables'
  #test 'renderFileNotUsingFullPath'
  #test 'renderFileNotUsingFullPathWithDotInPath'
  #test 'renderFileUsingPathname'
  #test 'renderFileFromTemplate'
  #test 'renderFileWithLocals'
  #test 'renderFileAsStringWithLocals'
  #
  #test 'accessingRequestInTemplate'
  #test 'accessingLoggerInTemplate'
  #test 'accessingActionNameInTemplate'
  #test 'accessingControllerNameInTemplate'
  #
  #test 'renderCustomCode'
  #test 'renderTextWithNull'
  #test 'renderTextWithFalse'
  #test 'renderTextWithResource'
  #test 'renderNothingWithAppendix'
  #
  #test 'heading'
  #
  #test 'blankResponse'
  #
  #test 'layoutTest'
  #
  #test 'accessingParamsInTemplate'
  #test 'accessingLocalAssignsInInlineTemplate'
  
  test 'renderJsonHelloWorld', (done) ->
    _.get '/custom/renderJsonHelloWorld', ->
      assert.equal @body, JSON.stringify(hello: "world")
      assert.equal @headers["Content-Type"], "application/json"
      done()
      
  test 'renderJsonHelloWorldWithParams', (done) ->
    _.get '/custom/renderJsonHelloWorldWithParams', params: hello: "world", ->
      assert.equal @body, JSON.stringify(hello: "world")
      assert.equal @headers["Content-Type"], "application/json"
      assert.equal @status, 200
      done()
      
  test 'renderJsonHelloWorldWithStatus', (done) ->
    _.get '/custom/renderJsonHelloWorldWithStatus', ->
      assert.equal @body, JSON.stringify(hello: "world")
      assert.equal @headers["Content-Type"], "application/json"
      assert.equal @status, 401
      done()
