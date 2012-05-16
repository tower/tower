Tower.HTTP.Route.DSL::match = ->
  @scope ||= {}
  route = new Tower.HTTP.Route(@_extractOptions(arguments...))
  Tower.stateManager.insertRoute(route)
  Tower.HTTP.Route.create(route)
