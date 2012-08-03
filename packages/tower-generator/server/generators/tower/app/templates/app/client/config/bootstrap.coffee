<%= app.namespace %>.bootstrap = (data) ->

Tower.Net.Connection.transport = Tower.Store.Transport.Ajax
<%= app.namespace %>.initialize()
<%= app.namespace %>.listen()

$ ->
  App.ApplicationView.create().append() # tmp