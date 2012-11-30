Tower.NetRouteDSL::match = ->
  @scope ||= {}
  route = new Tower.NetRoute(@_extractOptions(arguments...))
  Tower.router.insertRoute(route)
  Tower.NetRoute.create(route)
