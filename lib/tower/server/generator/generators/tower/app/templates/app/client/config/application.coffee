class <%= app.namespace %> extends Tower.Application
  @configure ->
    @use Tower.Middleware.Agent
    @use Tower.Middleware.Location
    @use Tower.Middleware.Router
    
  bootstrap: (data) ->

window.<%= app.namespace %> = new <%= app.namespace %>
