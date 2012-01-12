Tower.Middleware.Router = (request, response, callback) ->
  Tower.Middleware.Router.find request, response, (controller) ->
    if controller
      response.writeHead(200, controller.headers)
      response.write(controller.body)
      response.end()
      controller.clear()
    else
      Tower.Middleware.Router.error(request, response)
  
  response
  
Tower.Support.Object.extend Tower.Middleware.Router,  
  find: (request, response, callback) ->
    routes      = Tower.Route.all()
    @processHost request, response
    @processAgent request, response
    
    for route in routes
      controller = @processRoute route, request, response
      break if controller
    
    if controller
      controller.call request, response, ->
        callback(controller)
    else
      callback(null)
    
    controller
  
  processHost: (request, response) ->
    request.location ||= new Tower.Dispatch.Url(request.url)
  
  # https://github.com/shenoudab/active_device  
  processAgent: (request, response) ->
    request.userAgent ||= request.headers["user-agent"] if request.headers
    
  processRoute: (route, request, response) ->
    match = route.match(request)
    
    return null unless match
    method  = request.method.toLowerCase()
    keys    = route.keys
    params  = Tower.Support.Object.extend({}, route.defaults, request.query || {}, request.body || {})
    match   = match[1..-1]
    
    for capture, i in match
      params[keys[i].name] = if capture then decodeURIComponent(capture) else null
    
    controller      = route.controller
    params.action   = controller.action if controller
    request.params  = params
    
    controller      = new (Tower.constant(Tower.namespaced(route.controller.className))) if controller
    controller
    
  error: (request, response) ->
    if response
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/plain')
      response.end("No path matches #{request.url}")
      
module.exports = Tower.Middleware.Router
