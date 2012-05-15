Tower.View.reopen
  # findEmberView('loginView')
  findEmberView: (viewName) ->
    app = Tower.namespace()
    
    if view = app.getPath(viewName)
      view