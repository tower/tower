<%= controller.namespace %>.<%= controller.className %> = Tower.Controller.extend({
  all: Tower.scope(),

  // @todo refactor
  destroy: function() {
    this.get('resource').destroy();
  }
});
