require './helper'

class CoachSpecApp.CustomController extends Coach.Controller
  @beforeFilter "setCurrentUser"
  
  index: ->
    @indexCalled = true
    @render json: JSON.stringify(musica: "universalis")
    
  setCurrentUser: (callback) ->
    @currentUser = name: "Lance"
    callback(null, true)

describe 'Coach.Controller', ->
  describe 'Callbacks', ->
    controller  = null
    router      = null
    
    beforeEach ->
      Coach.Application.instance().teardown()

      Coach.Route.draw ->
        @match "/custom",  to: "custom#index"
        @match "/custom/:id",  to: "custom#show"
      
      controller  = new CoachSpecApp.CustomController()
      router      = Coach.Middleware.Routes
      
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
