Tower.View.reopen
  # findEmberView('loginView')
  # findEmberView('posts/index') => 'postsIndexView'
  findEmberView: (path) ->
    # Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(template)
    
    viewName = _.camelize(path) + "View"
    app = Tower.Application.instance()
    
    if view = app.get(viewName)
      view
    else if viewClass = app.get(_.camelize(viewName))
      view = viewClass.create()
      app.set(viewName, view)
    else
      view = Ember.View.create(template: path)
      app.set(viewName, view)
      
    view
    
  renderEmberView: (path) ->
    view = @findEmberView(path)
    
    throw new Error("Ember view for '#{path}' was not found.") unless view
    
    oldView = Tower.stateManager.get('currentView')
    oldView.destroy() if oldView
    
    Tower.stateManager.set('currentView', view)
    
    view.append()
