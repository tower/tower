<%= app.namespace %>.bootstrap = (data) ->

Tower.NetConnection.transport = Tower.StoreTransportAjax
if Tower.env == 'development'
  Tower.StoreTransportAjax.defaults.async = false
  
<%= app.namespace %>.initialize()
<%= app.namespace %>.listen()

$ ->
  App.ApplicationView.create().append() # tmp