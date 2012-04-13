require '../../config'

controller  = null
user        = null
router      = null

describe 'Tower.Controller.Rendering', ->
  test 'renderCoffeeCupFromTemplate', ->
    Tower.get 'renderCoffeeCupFromTemplate', ->
      assert.equal @body, "<h1>Hello World</h1>\n"
      assert.equal @headers["Content-Type"], "text/html"

  test 'renderHelloWorldFromVariable', ->
    Tower.get 'renderHelloWorldFromVariable', ->
      assert.equal @person, "david"
      assert.equal @body, "hello david"

  test 'renderWithExplicitStringTemplateAsAction', ->
    Tower.get 'renderWithExplicitStringTemplateAsAction', ->
      assert.equal @body, "<h1>Hello World!!!</h1>\n"

  #test 'helloWorldFile', ->
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
  test 'renderActionUpcasedHelloWorld', ->
    Tower.get 'renderActionUpcasedHelloWorld', ->
      assert.equal @body, "<h1>renderActionUpcasedHelloWorld</h1>\n"

  test 'renderActionUpcasedHelloWorldAsString', ->
    Tower.get 'renderActionUpcasedHelloWorldAsString', ->
      assert.equal @body, "<h1>renderActionUpcasedHelloWorld</h1>\n"

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

  test 'renderJsonHelloWorld', ->
    Tower.get 'renderJsonHelloWorld', ->
      assert.equal @body, JSON.stringify(hello: "world")
      assert.equal @headers["Content-Type"], "application/json"

  test 'renderJsonHelloWorldWithParams', ->
    Tower.get 'renderJsonHelloWorldWithParams', hello: "world", ->
      assert.equal @body, JSON.stringify(hello: "world")
      assert.equal @headers["Content-Type"], "application/json"
      assert.equal @status, 200

  test 'renderJsonHelloWorldWithStatus', ->
    Tower.get 'renderJsonHelloWorldWithStatus', ->
      assert.equal @body, JSON.stringify(hello: "world")
      assert.equal @headers["Content-Type"], "application/json"
      assert.equal @status, 401
