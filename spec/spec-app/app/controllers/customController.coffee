class TowerSpecApp.CustomController extends Tower.Controller
  @before "setCurrentUser"
  
  index: ->
    @indexCalled = true
    @render json: JSON.stringify(musica: "universalis")
    
  setCurrentUser: (callback) ->
    @currentUser = name: "Lance"
    callback(null, true)
