require '../config'

controller  = null
user        = null
router      = null

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
    