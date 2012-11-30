
Ember.TEMPLATES || (Ember.TEMPLATES = {});

Tower.View.reopen({
  findEmberViewOLD: function(path) {
    var view;
    if (!Ember.TEMPLATES.hasOwnProperty(path)) {
      return null;
    }
    view = Ember.View.create({
      templateName: path
    });
    return view;
  },
  findEmberView: function(options) {
    if (options.view) {
      return options.view;
    } else if (options.template) {
      this._getEmberTemplate(options.template);
      return Tower.Application.instance().get(Tower._.camelize(options.template) + 'View');
    }
  },
  renderEmberView: function(options) {
    return this.parentController().connectOutlet(this._connectOutletOptions(options));
  },
  _connectOutletOptions: function(options) {
    return {
      outletName: options.outlet || 'view',
      viewClass: this.findEmberView(options),
      controller: this._context
    };
  },
  _getEmberTemplate: function(name) {
    if (typeof Ember.TEMPLATES[name] === 'object') {
      Ember.TEMPLATES[name] = Ember.TEMPLATES[name].func();
    }
    return Ember.TEMPLATES[name];
  }
});
