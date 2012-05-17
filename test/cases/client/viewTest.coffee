if Tower.isClient
  describe 'Tower.View.EmberHelper', ->
    view = null
  
    beforeEach ->
      view = new Tower.View
  
    test '#findEmberView', ->  
      emberView = view.findEmberView('posts/index')
      emberView.append()
      
    test '#renderEmberView', ->  
      view.renderEmberView('posts/index')
      
      assert.ok Tower.stateManager.get('currentView')