class Metro.Middleware.Dependencies
  @middleware: (request, result, next) -> (new Dependencies).call(request, result, next)
  
  call: (request, result, next) ->
    Metro.Support.Dependencies.reloadModified()
    Metro.Route.reload()
    next() if next?
    
module.exports = Metro.Middleware.Dependencies
