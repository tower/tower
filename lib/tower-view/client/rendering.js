
Tower.ViewRendering = {
  render: function(options, callback) {
    return this._normalizeRenderOptions(options);
  },
  _getEmberTemplate: function(name) {
    return Ember.get(Ember.TEMPLATES, name);
  }
};

module.exports = Tower.ViewRendering;
