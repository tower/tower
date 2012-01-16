require '../config'

class global.MimesController extends Tower.Controller
  @respondTo "html", "json", "pdf"

controller  = null
user        = null
router      = null

get     = (action, options = {}, callback) ->
  request "get", action, options, callback
  
post    = (action, options = {}, callback) ->
  request "post", action, options, callback
  
put     = (action, options = {}, callback) ->
  request "put", action, options, callback
  
destroy = (action, options = {}, callback) ->
  request "delete", action, options, callback

request = (method, action, options = {}, callback) ->
  params              = _.extend {}, options
  params.action       = action
  url            = "http://example.com/#{action}"
  location       = new Tower.Dispatch.Url(url)
  controller     = new TowerSpecApp.CustomController()
  request        = new Tower.Dispatch.Request(url: url, location: location, method: method)
  response       = new Tower.Dispatch.Response(url: url, location: location, method: method)
  request.params = params
  controller.call request, response, (error, result) ->
    callback.call @, @response

describe 'Tower.Controller', ->
  beforeEach ->
    Tower.Route.draw ->
      @match "/custom",  to: "custom#index"
      @match "/custom/:id",  to: "custom#show"
    
    controller  = new TowerSpecApp.CustomController()
    
  test 'resource', ->
    controller = new TowerSpecApp.PostsController
    expect(controller.resourceName).toEqual "post"
    expect(controller.collectionName).toEqual "posts"
    expect(controller.resourceType).toEqual "Post"
    
  test 'posts controller', ->
    get 'renderCoffeeKupFromTemplate', {}, ->
      expect(@body).toEqual "<h1>Hello World</h1>"
      expect(@contentType).toEqual "text/html"
    
  #test 'should run callbacks', ->
  #  request       = method: "get", url: "http://www.local.host:3000/custom"
  #  indexFinished = false
  #  
  #  controller    = router.find request, {}, (controller) ->
  #    indexFinished  = true
  #  
  #  expect(controller.currentUser).toEqual name: "Lance"
  #  expect(controller.indexCalled).toEqual true
  #  expect(indexFinished).toEqual true
  #  
  #  #runs ->
  #  #  request       = method: "get", url: "http://www.local.host:3000/custom/2"
  #  #  indexFinished = false
  #  #  
  #  #  controller    = router.find request, {}, (controller) ->
  #  #    indexFinished  = true
  #  #
  #  #waits 300
  #  #
  #  #runs ->
  #  #  expect(controller.currentUser).toEqual name: "Lance"
  #  #  expect(controller.indexCalled).toEqual false
  #  #  expect(controller.indexFinished).toEqual false
###
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
###