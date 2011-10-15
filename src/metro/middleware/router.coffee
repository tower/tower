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
    routes = Metro.Application.routes()
    for route in routes
      if route.matches(request)
        route.call(request, response)
        break
    next() if next?
    
exports = module.exports = Router
