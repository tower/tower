url = require('url')

# http://nodejs.org/docs/v0.4.7/api/url.html
class Router
  @middleware: (request, result, next) -> (new Router).call(request, result, next)
  
  calling: (request, result, next) ->
    console.log "CALLED"
    renderer = new Metro.View.Renderer
    body = renderer.render("#{Metro.root}/app/views/posts/index", type: "jade")
    res.setHeader('Content-Length', body.length)
    res.end(body)
    next()
    
  call: (request, response, next) ->
    routes  = Metro.Application.routes()
    request.params = url.parse(request.url)
    route = routes[0]
    route.controller_class_name = "PostsController"
    request.params = {}
    request.params.action = "index"
    route.call(request, response)
    for route in routes
      if route.matches(request)
        route.call(request, response)
        break
    next() if next?
    
exports = module.exports = Router
