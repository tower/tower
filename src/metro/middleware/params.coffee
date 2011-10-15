url = require('url')

# http://nodejs.org/docs/v0.4.7/api/url.html
class Params
  @middleware: (request, result, next) -> (new Router).call(request, result, next)
  
  call: (request, response, next) ->
    routes  = Metro.Application.routes()
    request.params = url.parse(request.url)
    for route in routes
      if route.matches(request)
        route.call(request, response)
        break
    next() if next?
    
exports = module.exports = Params
