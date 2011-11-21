class Metro.Middleware.Dependencies
  constructor: (request, result, next) ->
    unless @constructor == Metro.Middleware.Dependencies
      return new Metro.Middleware.Dependencies(request, response, next)
      
    Metro.Support.Dependencies.reloadModified()
    Metro.Route.reload()
    next() if next?
    
module.exports = Metro.Middleware.Dependencies
