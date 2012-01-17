require '../../config'

controller  = null
user        = null
router      = null

describe 'Tower.Controller.Rendering', ->
  test 'renderCoffeeKupFromTemplate', ->
    Tower.get 'renderCoffeeKupFromTemplate', ->
      expect(@body).toEqual "<h1>Hello World</h1>\n"
      expect(@contentType).toEqual "text/html"
  
  test 'renderHelloWorldFromVariable', ->
    Tower.get 'renderHelloWorldFromVariable', ->
      expect(@person).toEqual "david"
      expect(@body).toEqual "hello david"

  #test 'helloWorldFile', ->
  #  Tower.get 'helloWorldFile', ->
  #    expect(@body).toEqual "Hello world!"
  #    
  #test 'renderHelloWorld', ->
  #  Tower.get 'renderHelloWorld', ->
  #    expect(@body).toEqual "Hello world!"
  #    
  #test 'renderHelloWorldWithForwardSlash', ->
  #  Tower.get 'renderHelloWorldWithForwardSlash', ->
  #    expect(@body).toEqual "Hello world!"
  #    
  #test 'renderActionHelloWorld', ->
  #  Tower.get 'renderActionHelloWorld', ->
  #    expect(@body).toEqual "Hello world!"
  #    
  #test 'renderActionUpcasedHelloWorld', ->
  #  Tower.get 'renderActionUpcasedHelloWorld', ->
  #    expect(@body).toEqual "Hello world!"
  #    
  #test 'renderActionHelloWorldAsString', ->
  #  Tower.get 'renderActionUpcasedHelloWorld', ->
  #    expect(@body).toEqual "Hello world!"
  #
  #test 'renderTextHelloWorld', ->
  #  Tower.get 'renderActionUpcasedHelloWorld', ->
  #    expect(@body).toEqual "hello world"
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
      expect(@body).toEqual JSON.stringify(hello: "world")
      expect(@contentType).toEqual "application/json"
      
  test 'renderJsonHelloWorldWithParams', ->
    Tower.get 'renderJsonHelloWorldWithParams', hello: "world", ->
      expect(@body).toEqual JSON.stringify(hello: "world")
      expect(@contentType).toEqual "application/json"
      expect(@status).toEqual 200
      
  test 'renderJsonHelloWorldWithStatus', ->
    Tower.get 'renderJsonHelloWorldWithStatus', ->
      expect(@body).toEqual JSON.stringify(hello: "world")
      expect(@contentType).toEqual "application/json"
      expect(@status).toEqual 401