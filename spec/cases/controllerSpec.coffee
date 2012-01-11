require '../config'

controller  = null
user        = null

describe 'Tower.Controller', ->
  test 'PostsController#resourceName', ->
    controller = new TowerSpecApp.PostsController
    expect(controller.resourceName).toEqual "post"
    expect(controller.collectionName).toEqual "posts"
    expect(controller.resourceType).toEqual "Post"

describe 'Tower.Controller.Callbacks', ->
  beforeEach ->
    Tower.Application.instance().teardown()
    
    Tower.Route.draw ->
      @match "/custom",  to: "custom#index"
      @match "/custom/:id",  to: "custom#show"
    
    controller  = new TowerSpecApp.CustomController()
    router      = Tower.Middleware.Router
    
  it 'should run callbacks', ->
    request       = method: "get", url: "http://www.local.host:3000/custom"
    indexFinished = false
    
    controller    = router.find request, {}, (controller) ->
      indexFinished  = true
    
    waits 300
    
    runs ->
      expect(controller.currentUser).toEqual name: "Lance"
      expect(controller.indexCalled).toEqual true
      expect(indexFinished).toEqual true
      
    #runs ->
    #  request       = method: "get", url: "http://www.local.host:3000/custom/2"
    #  indexFinished = false
    #  
    #  controller    = router.find request, {}, (controller) ->
    #    indexFinished  = true
    #
    #waits 300
    #
    #runs ->
    #  expect(controller.currentUser).toEqual name: "Lance"
    #  expect(controller.indexCalled).toEqual false
    #  expect(controller.indexFinished).toEqual false

describe 'Tower.Controller.Rendering', ->
  beforeEach ->
    controller = new TowerSpecApp.CustomController
    User.store(new Tower.Store.Memory(name: "users", type: "User"))
    user = User.create id: 1, firstName: "Lance"
    
  test 'render coffekup from template', ->
    controller.renderCoffeeKupFromTemplate()
    
    expect(controller.body).toEqual "<h1>Hello World</h1>"
    
  test 'render coffekup inline', ->
    controller.renderCoffeeKupInline()

    expect(controller.body).toEqual "<h1>I'm Inline!</h1>"
    
  test 'resourceful', ->  
    controller.params.id = 1
    controller.params.action = "show"
    controller.show()