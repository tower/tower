class App extends Tower.Application
  @configure ->
    @use Tower.Middleware.Agent
    @use Tower.Middleware.Location
    @use Tower.Middleware.Router
    
  bootstrap: (data) ->

window.App = (new App).initialize()
