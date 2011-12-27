class TowerSpecApp.CustomController extends Tower.Controller
  @beforeFilter "setCurrentUser"
  
  index: ->
    @indexCalled = true
    @render json: JSON.stringify(musica: "universalis")
    
  setCurrentUser: (callback) ->
    @currentUser = name: "Lance"
    callback(null, true)
