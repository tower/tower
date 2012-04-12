controller  = null
user        = null
router      = null

describeWith = (store) ->
  describe "Tower.Controller (Tower.Store.#{store.name})", ->
    beforeEach (done) ->
      Tower.Route.draw ->
        @match "/custom",  to: "custom#index"
        @match "/custom/:id",  to: "custom#show"
    
      controller  = new App.CustomController()
      
      done()
    
    test 'resource', ->
      controller = new App.PostsController
      assert.equal controller.resourceName, "post"
      assert.equal controller.collectionName, "posts"
      assert.equal controller.resourceType, "Post"
      
describeWith(Tower.Store.Memory)
describeWith(Tower.Store.MongoDB) unless Tower.client
