_url  = require('url')
_     = require('underscore')

class Metro.Middleware.Router
  @middleware: (request, result, next) -> (new Metro.Middleware.Router).call(request, result, next)
  
  call: (request, response, next) ->
    self = @
    
    @find request, response, (controller) ->
      if controller
        response.writeHead(200, controller.headers)
        response.write(controller.body)
        response.end()
        controller.clear()
      else
        self.error(request, response)
    
    response
  
  find: (request, response, callback) ->
    routes      = Metro.Route.all()
    
    for route in routes
      controller = @processRoute route, request, response
      break if controller
    
    if controller
      controller.call request, response, ->
        callback(controller)
    else
      callback(null)
    
    controller
    
  processRoute: (route, request, response) ->
    url                    = _url.parse(request.url)
    path                   = url.pathname
    match                  = route.match(path)
    
    return null unless match
    method                 = request.method.toLowerCase()
    keys                   = route.keys
    params                 = _.extend({}, route.defaults, request.query || {}, request.body || {})
    match                  = match[1..-1]
    
    for capture, i in match
      params[keys[i].name] = if capture then decodeURIComponent(capture) else null
    
    controller             = route.controller
    
    params.action          = controller.action if controller
    
    request.params         = params
    
    if controller
      try
        controller         = new global[route.controller.className]
      catch error
        throw(new Error("#{route.controller.className} wasn't found"))
    
    controller
    
  error: (request, response) ->
    if response
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/plain')
      response.end("No path matches #{request.url}")
      
module.exports = Metro.Middleware.Router
