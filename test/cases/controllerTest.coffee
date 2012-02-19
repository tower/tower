require '../config'

controller  = null
user        = null
router      = null

describe 'Tower.Controller', ->
  beforeEach ->
    Tower.Route.draw ->
      @match "/custom",  to: "custom#index"
      @match "/custom/:id",  to: "custom#show"
    
    controller  = new App.CustomController()
    
  test 'resource', ->
    controller = new App.PostsController
    assert.equal controller.resourceName, "post"
    assert.equal controller.collectionName, "posts"
    assert.equal controller.resourceType, "Post"
    
    