Tower.Net.Route.DSL::match = ->
  @scope ||= {}
  route = new Tower.Net.Route(@_extractOptions(arguments...))
  Tower.router.insertRoute(route)
  Tower.Net.Route.create(route)
