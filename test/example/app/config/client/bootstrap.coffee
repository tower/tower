# Tower.debug = Tower.env == 'development'

App.bootstrap = (data) ->
  # Optimized rendering (force right at bottom of DOM, before DOM ready)
  Ember.Handlebars.bootstrap(Ember.$(document))

  # Tower.NetConnection.transport = Tower.StoreTransportAjax
  if Tower.env == 'development'
    Tower.StoreTransportAjax.defaults.async = false
    
  App.initialize()
  App.listen()

  # Force rendering before dom ready (better UX with ember)
  Ember.run.autorun()
  Ember.run.currentRunLoop.flush('render')
