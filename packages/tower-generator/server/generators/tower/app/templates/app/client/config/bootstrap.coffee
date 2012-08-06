Tower.debug = Tower.env == 'development'

<%= app.namespace %>.bootstrap = (data) ->
  # Optimized rendering (force right at bottom of DOM, before DOM ready)
  Ember.Handlebars.bootstrap(Ember.$(document))
  Ember.run.autorun()
  Ember.run.currentRunLoop.flush('render')

Tower.NetConnection.transport = Tower.StoreTransportAjax
if Tower.env == 'development'
  Tower.StoreTransportAjax.defaults.async = false
  
<%= app.namespace %>.initialize()
<%= app.namespace %>.listen()

$ ->
  App.ApplicationView.create().append() # tmp