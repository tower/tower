<%= app.namespace %>.bootstrap = (data) ->

Tower.NetConnection.transport = Tower.StoreTransportAjax
<%= app.namespace %>.initialize()
<%= app.namespace %>.listen()

$ ->
  App.ApplicationView.create().append() # tmp