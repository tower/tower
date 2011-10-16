_url = require('url')
_   = require('underscore')

# http://nodejs.org/docs/v0.4.7/api/url.html
class Router
  @middleware: (request, result, next) -> (new Router).call(request, result, next)
  
  call: (request, response, next) ->
    @process(request, response)
    next() if next?
    
  routes: ->
    Metro.Application.routes().set
    
  process: (request, response) ->
    routes = @routes()
    for route in routes
      if controller = @process_route(route, request, response)
        return controller
    null
    
  process_route: (route, request, response) ->
    url                    = _url.parse(request.url)
    path                   = url.pathname
    match                  = route.match(path)
    return null unless match
    method                 = request.method.toLowerCase()
    keys                   = route.keys
    params                 = _.extend({}, route.defaults)
    match                  = match[1..-2]
    
    for capture, i in match
      params[keys[i].name] = decodeURIComponent(capture)
    
    controller             = route.controller
    
    params.action          = controller.action if controller
    
    request.params         = params
    
    if controller
      try
        controller         = new global[route.controller.class_name]
      catch error
        throw(new Error("#{route.controller.class_name} wasn't found"))
      controller.call(request, response)
    
    controller
    
module.exports = Router
