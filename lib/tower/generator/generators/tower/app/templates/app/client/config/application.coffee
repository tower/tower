window.designer ||= new DesignIO("<%= project.name %>", port: 4181)

class <%= project.className %> extends Tower.Application
  @configure ->
    @use Tower.Middleware.Agent
    @use Tower.Middleware.Location
    @use Tower.Middleware.Router

window.<%= project.className %> = new <%= project.className %>
