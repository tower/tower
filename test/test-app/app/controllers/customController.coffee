class TowerSpecApp.CustomController extends Tower.Controller
  @before "setCurrentUser"
  @resource type: "TowerSpecApp.User"
  
  @
  
  index: ->
    @indexCalled = true
    @render json: JSON.stringify(musica: "universalis")
    
  renderUser: ->
    
  renderCoffeeKupFromTemplate: ->
    @render 'index'
    
  renderCoffeeKupInline: ->
    @self = "I'm"
    
    @render ->
      h1 "#{@self} Inline!"
    
  setCurrentUser: (callback) ->
    @currentUser = name: "Lance"
    callback(null, true)
