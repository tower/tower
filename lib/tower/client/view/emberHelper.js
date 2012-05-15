
Tower.View.reopen({
  findEmberView: function(viewName) {
    var app, view;
    app = Tower.namespace();
    if (view = app.getPath(viewName)) {
      return view;
    }
  }
});
