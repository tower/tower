window.designer ||= new DesignIO("<%= app.name %>", port: 4181)

class <%= app.namespace %> extends Tower.Application
  @configure ->
    @use Tower.Middleware.Agent
    @use Tower.Middleware.Location
    @use Tower.Middleware.Router

window.<%= app.namespace %> = new <%= app.namespace %>
