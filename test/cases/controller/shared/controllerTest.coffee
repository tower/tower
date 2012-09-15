describe 'Tower.Controller', ->
  controller  = null
  user        = null
  router      = null
  
  beforeEach (done) ->
    Tower.Route.draw ->
      @match '/custom',  to: 'custom#index'
      @match '/custom/:id',  to: 'custom#show'

    console.log 'here'
  
    controller  = App.CustomController.create()
    
    done()
  
  test 'resource', ->
    controller = App.PostsController.create()
    assert.equal controller.resourceName, 'post'
    assert.equal controller.collectionName, 'posts'
    assert.equal controller.resourceType, 'Post'
