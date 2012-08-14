# @mixin
Tower.ViewRendering =
  render: (options, callback) ->
    @_normalizeRenderOptions(options)

  _getEmberTemplate: (name) ->
    # either this
    Ember.get(Ember.TEMPLATES, name) # so they can be lazily compiled
    # or this
    # Ember.TEMPLATES[name] = Ember.Handlebars.compile(Tower.View.cache[name])

module.exports = Tower.ViewRendering
