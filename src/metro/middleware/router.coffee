url = require('url')

# http://nodejs.org/docs/v0.4.7/api/url.html
class Router
  @middleware: (request, result, next) -> (new Router).call(request, result, next)
  
  call: (request, response, next) ->
    @process(request, response)
    next() if next?
    
  routes: ->
    Metro.Application.routes()
    
  process: (request, response)
    routes = @routes()
    for route in routes
      if match = route.match(request)
        @process_params(match, route, request, response)
        @process_controller(route, request, response)
        break
    
  process_params: (match, route, request, response) ->
    method = request.method.toLowerCase()
    url = parse(request.url)
    path = url.pathname
    keys  = route.keys
    params = {}
    
    for capture, i in match
      capture     = decodeURIComponent(capture)
      key         = keys[i]
      params[key] = capture
    
    if controller = route.options.controller
      params.action = controller.action
      params.controller = controller.name
      
    request.params = params
    
  process_controller: (route, request, response) ->
    if controller = route.options.controller
      controller = new global[controller.class_name]
      controller.call(request, response)
    
exports = module.exports = Router
