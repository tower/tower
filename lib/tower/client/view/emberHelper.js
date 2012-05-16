
Tower.View.reopen({
  findEmberView: function(path) {
    var app, view, viewClass, viewName;
    viewName = _.camelize(path) + "View";
    app = Tower.Application.instance();
    if (view = app.get(viewName)) {
      view;

    } else if (viewClass = app.get(_.camelize(viewName))) {
      view = viewClass.create();
      app.set(viewName, view);
    } else {
      view = Ember.View.create({
        template: path
      });
      app.set(viewName, view);
    }
    return view;
  },
  renderEmberView: function(path) {
    var oldView, view;
    view = this.findEmberView(path);
    if (!view) {
      throw new Error("Ember view for '" + path + "' was not found.");
    }
    oldView = Tower.stateManager.get('currentView');
    if (oldView) {
      oldView.destroy();
    }
    Tower.stateManager.set('currentView', view);
    return view.append();
  }
});
