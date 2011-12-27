require '../../config'

describe 'Tower.Controller', ->
  describe 'Callbacks', ->
    controller  = null
    router      = null
    
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
