Coach.Middleware.Router = (request, response, callback) ->
  Coach.Middleware.Router.find request, response, (controller) ->
    if controller
      response.writeHead(200, controller.headers)
      response.write(controller.body)
      response.end()
      controller.clear()
    else
      self.error(request, response)
  
  response
  
Coach.Support.Object.extend Coach.Middleware.Router,  
  find: (request, response, callback) ->
    routes      = Coach.Route.all()
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
  
  # https://github.com/3rd-Eden/useragent/blob/master/lib/useragent.js  
  processHost: (request, response) ->
    request.location ||= new Coach.Net.Url(request.url)
  
  # https://github.com/shenoudab/active_device  
  processAgent: (request, response) ->
    request.userAgent ||= request.headers["user-agent"] if request.headers
    
  processRoute: (route, request, response) ->
    match = route.match(request)
    
    return null unless match
    method  = request.method.toLowerCase()
    keys    = route.keys
    params  = Coach.Support.Object.extend({}, route.defaults, request.query || {}, request.body || {})
    match   = match[1..-1]
    
    for capture, i in match
      params[keys[i].name] = if capture then decodeURIComponent(capture) else null
    
    controller      = route.controller
    params.action   = controller.action if controller
    request.params  = params
    
    controller      = new (Coach.constant(Coach.namespaced(route.controller.className))) if controller
    controller
    
  error: (request, response) ->
    if response
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/plain')
      response.end("No path matches #{request.url}")
      
module.exports = Coach.Middleware.Router
